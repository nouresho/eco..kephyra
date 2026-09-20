-- Run once in Supabase SQL Editor AFTER 001_admin_and_capacity.sql.
-- No credentials. Atomic migration; existing cash reservations are preserved.
begin;
do $$ begin
 if to_regprocedure('public.ec_lock_capacity()') is null then raise exception 'Install the admin capacity migration first'; end if;
 if not exists(select 1 from pg_trigger where tgrelid='public.reservations'::regclass and tgname='ec_reservation_guard' and tgenabled='O') then raise exception 'Capacity trigger is missing or disabled'; end if;
end $$;
create table public.paypal_payments (
 id uuid primary key default gen_random_uuid(),
 token_hash text not null unique,
 fingerprint text not null,
 reservation_id bigint not null unique references public.reservations(id),
 environment text not null check(environment in ('sandbox','live')),
 mad_total numeric(10,2) not null check(mad_total>0),
 eur_total numeric(10,2) not null check(eur_total>0),
 fx_rate numeric(18,10) not null check(fx_rate>0),
 fx_date date not null,
 order_id text unique,
 capture_id text unique,
 approve_url text,
 state text not null default 'held' check(state in ('held','capturing','paid','expired','failed')),
 expires_at timestamptz not null default now()+interval '15 minutes',
 created_at timestamptz not null default now()
);
alter table public.paypal_payments enable row level security;
revoke all on public.paypal_payments from public,anon,authenticated;
grant all on public.paypal_payments to service_role;

create function public.ec_paypal_expire() returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare r record;
begin
 perform public.ec_lock_capacity();
 for r in select * from public.paypal_payments where state='held' and expires_at<=now() for update loop
   update public.reservations set status='cancelled' where id=r.reservation_id and status='pending' and payment_status='unpaid';
   update public.paypal_payments set state='expired' where id=r.id;
 end loop;
end $$;

create function public.ec_paypal_reserve(p_hash text,p_fingerprint text,p_booking jsonb,p_rate numeric,p_date date,p_environment text)
returns public.paypal_payments language plpgsql security definer set search_path=pg_catalog as $$
declare result public.paypal_payments; rid bigint; days integer; mad numeric; eur numeric; start_d date; end_d date;
begin
 perform public.ec_lock_capacity();
 perform public.ec_paypal_expire();
 select * into result from public.paypal_payments where token_hash=p_hash;
 if found then
   if result.fingerprint<>p_fingerprint or result.environment<>p_environment then raise exception 'EC_CHANGED'; end if;
   return result;
 end if;
 start_d:=(p_booking->>'start_date')::date; end_d:=(p_booking->>'end_date')::date; days:=end_d-start_d+1;
 if days not between 1 and 366 or start_d<(now() at time zone 'Africa/Casablanca')::date or p_rate is null or p_rate<=0 or p_date is null or p_date<current_date-7 or p_date>current_date+1 then raise exception 'Invalid booking or rate'; end if;
 mad:=days*(case when days>=30 then 120 when days>=7 then 155 when days>=5 then 170 when days>=3 then 180 else 200 end);
 eur:=round(mad*p_rate,2);
 insert into public.reservations(customer_name,customer_email,customer_phone,start_date,end_date,total_days,total_price,status,payment_status,payment_method)
 values(p_booking->>'customer_name',p_booking->>'customer_email',p_booking->>'customer_phone',start_d,end_d,days,mad,'pending','unpaid','online') returning id into rid;
 insert into public.paypal_payments(token_hash,fingerprint,reservation_id,environment,mad_total,eur_total,fx_rate,fx_date)
 values(p_hash,p_fingerprint,rid,p_environment,mad,eur,p_rate,p_date) returning * into result;
 return result;
end $$;

create function public.ec_paypal_begin_capture(p_id uuid) returns public.paypal_payments
language plpgsql security definer set search_path=pg_catalog as $$
declare r public.paypal_payments; b public.reservations;
begin
 perform public.ec_lock_capacity();
 select * into strict r from public.paypal_payments where id=p_id for update;
 if r.state='paid' then return r; end if;
 if r.state='held' and r.expires_at<=now() then raise exception 'EC_EXPIRED'; end if;
 if r.state not in ('held','capturing') then raise exception 'EC_STATE'; end if;
 select * into strict b from public.reservations where id=r.reservation_id for update;
 if b.status<>'pending' or b.payment_status<>'unpaid' then raise exception 'EC_STATE'; end if;
 update public.paypal_payments set state='capturing' where id=p_id returning * into r;
 return r;
end $$;

create function public.ec_paypal_finish(p_id uuid,p_capture text,p_eur numeric) returns public.paypal_payments
language plpgsql security definer set search_path=pg_catalog as $$
declare r public.paypal_payments;
begin
 perform public.ec_lock_capacity();
 select * into strict r from public.paypal_payments where id=p_id for update;
 if r.eur_total<>p_eur or p_capture is null or length(p_capture)<5 then raise exception 'EC_STATE amount'; end if;
 if r.state='paid' then
   if r.capture_id<>p_capture then raise exception 'EC_STATE capture'; end if;
   return r;
 end if;
 if r.state<>'capturing' then raise exception 'EC_STATE payment requires reconciliation'; end if;
 update public.reservations set status='confirmed',payment_status='paid' where id=r.reservation_id and status='pending' and payment_status='unpaid';
 if not found then raise exception 'EC_STATE booking'; end if;
 update public.paypal_payments set state='paid',capture_id=p_capture where id=p_id returning * into r;
 return r;
end $$;

create function public.ec_paypal_fail(p_id uuid) returns public.paypal_payments
language plpgsql security definer set search_path=pg_catalog as $$
declare r public.paypal_payments;
begin
 perform public.ec_lock_capacity();
 select * into strict r from public.paypal_payments where id=p_id for update;
 if r.state='paid' then return r; end if;
 update public.reservations set status='cancelled' where id=r.reservation_id and status='pending';
 update public.paypal_payments set state='failed' where id=p_id returning * into r;
 return r;
end $$;

-- An admin must not free a scooter or manually mark it paid during capture.
create function public.ec_paypal_admin_guard() returns trigger
language plpgsql security definer set search_path=pg_catalog as $$
declare s text;
begin
 if auth.role()='authenticated' then
   select state into s from public.paypal_payments where reservation_id=OLD.id;
   if s is not null and (NEW.payment_status is distinct from OLD.payment_status or (s in ('held','capturing') and NEW.status is distinct from OLD.status)) then
     raise exception 'EC_PAYPAL_MANAGED: PayPal manages this payment. Await confirmation or expiry.';
   end if;
 end if;
 return NEW;
end $$;
create trigger ec_paypal_admin_guard before update on public.reservations for each row execute function public.ec_paypal_admin_guard();

revoke all on function public.ec_paypal_expire(),public.ec_paypal_reserve(text,text,jsonb,numeric,date,text),public.ec_paypal_begin_capture(uuid),public.ec_paypal_finish(uuid,text,numeric),public.ec_paypal_fail(uuid),public.ec_paypal_admin_guard() from public,anon,authenticated;
grant execute on function public.ec_paypal_expire(),public.ec_paypal_reserve(text,text,jsonb,numeric,date,text),public.ec_paypal_begin_capture(uuid),public.ec_paypal_finish(uuid,text,numeric),public.ec_paypal_fail(uuid) to service_role;
commit;
