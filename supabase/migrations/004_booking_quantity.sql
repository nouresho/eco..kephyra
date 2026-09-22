-- Apply once AFTER migration 003. Existing reservations keep quantity 1.
begin;
lock table public.settings, public.reservations, public.paypal_payments in access exclusive mode;
alter table public.reservations add column scooter_quantity integer not null default 1 check (scooter_quantity between 1 and 10000);
alter table public.paypal_payments add column scooter_quantity integer not null default 1 check (scooter_quantity between 1 and 10000);
grant insert (scooter_quantity) on public.reservations to authenticated;

create or replace function public.ec_peak_active() returns bigint
language sql volatile security definer set search_path=pg_catalog as $$
  with events as (
    select start_date d, scooter_quantity n from public.reservations where status in ('pending','confirmed')
    union all
    select end_date+1, -scooter_quantity from public.reservations where status in ('pending','confirmed')
  ), daily as (select d,sum(n) n from events group by d), running as (
    select sum(n) over(order by d) n from daily
  ) select coalesce(max(n),0)::bigint from running;
$$;

create or replace function public.ec_reservation_guard() returns trigger
language plpgsql security definer set search_path=pg_catalog as $$
declare capacity integer; used bigint; day date;
begin
  perform public.ec_lock_capacity();
  if TG_OP='DELETE' then return OLD; end if;
  -- Detect a replay BEFORE the capacity check (the first request may fill the fleet).
  -- The lock also makes concurrent replays see the first committed request.
  if TG_OP='INSERT' and NEW.admin_request_id is not null and exists(
    select 1 from public.reservations where admin_request_id=NEW.admin_request_id
  ) then raise exception 'EC_REQUEST_EXISTS' using errcode='23505'; end if;
  if NEW.end_date-NEW.start_date not between 0 and 365 then raise exception 'EC_DATES'; end if;
  if NEW.scooter_quantity is null or NEW.scooter_quantity not between 1 and 10000 then raise exception 'EC_QUANTITY'; end if;
  if TG_OP='UPDATE' then
    if NEW.scooter_quantity is distinct from OLD.scooter_quantity then raise exception 'EC_QUANTITY_IMMUTABLE'; end if;
    if NEW.status is distinct from OLD.status and not (
      (OLD.status='pending' and NEW.status in ('confirmed','cancelled')) or
      (OLD.status='confirmed' and NEW.status in ('completed','cancelled'))
    ) then raise exception 'EC_TRANSITION'; end if;
    NEW.admin_version := OLD.admin_version+1;
  end if;
  if NEW.status in ('pending','confirmed') then
    select total_scooters into strict capacity from public.settings;
    day := NEW.start_date;
    while day <= NEW.end_date loop
      select coalesce(sum(r.scooter_quantity),0) into used from public.reservations r
      where r.status in ('pending','confirmed') and r.start_date<=day and r.end_date>=day
        and r.id<>NEW.id;
      if used+NEW.scooter_quantity>capacity then raise exception 'EC_CAPACITY' using errcode='23514'; end if;
      day := day+1;
    end loop;
  end if;
  return NEW;
end $$;

create or replace function public.ec_availability(p_start date,p_end date)
returns table(day date, available_scooters integer)
language plpgsql stable security definer set search_path=pg_catalog as $$
begin
  if p_start is null or p_end is null or p_end-p_start not between 0 and 365 then raise exception 'Invalid dates'; end if;
  return query select p_start+i, greatest(0,s.total_scooters-coalesce(sum(r.scooter_quantity),0)::integer)
    from generate_series(0,p_end-p_start) i cross join public.settings s
    left join public.reservations r on r.start_date<=p_start+i and r.end_date>=p_start+i and r.status in ('pending','confirmed')
    group by p_start+i,s.total_scooters order by 1;
end $$;

create function public.ec_paypal_reserve_quantity(p_hash text,p_fingerprint text,p_booking jsonb,p_rate numeric,p_date date,p_environment text)
returns public.paypal_payments language plpgsql security definer set search_path=pg_catalog as $$
declare result public.paypal_payments; rid bigint; days integer; mad numeric; eur numeric; start_d date; end_d date; qty integer;
begin
 perform public.ec_lock_capacity();
 perform public.ec_paypal_expire();
 select * into result from public.paypal_payments where token_hash=p_hash;
 if found then
   if result.fingerprint<>p_fingerprint or result.environment<>p_environment then raise exception 'EC_CHANGED'; end if;
   return result;
 end if;
 if p_booking ? 'scooter_quantity' and (jsonb_typeof(p_booking->'scooter_quantity') <> 'number' or (p_booking->>'scooter_quantity') !~ '^[0-9]+$') then raise exception 'EC_QUANTITY'; end if;
 qty:=coalesce((p_booking->>'scooter_quantity')::integer,1);
 if qty not between 1 and 10000 then raise exception 'EC_QUANTITY'; end if;
 start_d:=(p_booking->>'start_date')::date; end_d:=(p_booking->>'end_date')::date; days:=end_d-start_d+1;
 if days not between 1 and 366 or start_d<(now() at time zone 'Africa/Casablanca')::date or p_rate is null or p_rate<=0 or p_date is null or p_date<current_date-7 or p_date>current_date+1 then raise exception 'Invalid booking or rate'; end if;
 mad:=qty*days*(case when days>=30 then 120 when days>=7 then 155 when days>=5 then 170 when days>=3 then 180 else 200 end);
 eur:=round(mad*p_rate,2);
 insert into public.reservations(customer_name,customer_email,customer_phone,start_date,end_date,total_days,scooter_quantity,total_price,status,payment_status,payment_method)
 values(p_booking->>'customer_name',p_booking->>'customer_email',p_booking->>'customer_phone',start_d,end_d,days,qty,mad,'pending','unpaid','online') returning id into rid;
 insert into public.paypal_payments(token_hash,fingerprint,reservation_id,environment,mad_total,eur_total,fx_rate,fx_date,scooter_quantity)
 values(p_hash,p_fingerprint,rid,p_environment,mad,eur,p_rate,p_date,qty) returning * into result;
 return result;
end $$;


revoke all on function public.ec_paypal_reserve_quantity(text,text,jsonb,numeric,date,text) from public,anon,authenticated;
grant execute on function public.ec_paypal_reserve_quantity(text,text,jsonb,numeric,date,text) to service_role;
notify pgrst, 'reload schema';
commit;
