import 'server-only';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { CheckoutError, config, paypal } from './paypal';

export const TOKEN_COOKIE = 'ec_paypal_checkout';
export function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new CheckoutError('Booking service is not configured.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export const hash = (token: string) => createHash('sha256').update(token).digest('hex');
export async function rpc(name: string, params: Record<string, unknown> = {}) {
  const { data, error } = await database().rpc(name, params);
  if (error) {
    if (error.message.includes('EC_CAPACITY')) throw new CheckoutError('These dates have just sold out. Please choose another period.', 409);
    if (error.message.includes('EC_EXPIRED')) throw new CheckoutError('This checkout has expired. Start a new booking.', 409);
    if (error.message.includes('EC_CHANGED')) throw new CheckoutError('This checkout belongs to a different booking. Start a new checkout.', 409);
    if (error.message.includes('EC_STATE')) throw new CheckoutError('This payment needs verification. Please check again or contact us.', 409);
    throw new CheckoutError('Booking service unavailable. Please contact us if this continues.');
  }
  return data;
}
export async function session(token?: string) {
  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) throw new CheckoutError('Checkout not found in this browser.', 401);
  const { data, error } = await database().from('paypal_payments').select('*').eq('token_hash', hash(token)).maybeSingle();
  if (error) throw new CheckoutError('Booking service unavailable.');
  if (!data) throw new CheckoutError('Checkout not found.', 404);
  return data;
}
export function details(row: any) {
  return { scooterQuantity: row.scooter_quantity ?? 1, id: row.id, reservationId: String(row.reservation_id), state: row.state, mad: Number(row.mad_total).toFixed(2), eur: Number(row.eur_total).toFixed(2), rate: row.fx_rate, rateDate: row.fx_date, expiresAt: row.expires_at, mode: row.environment, approveUrl: row.approve_url };
}
export function verifyOrder(order: any, row: any) {
  const units = order.purchase_units;
  if (order.id !== row.order_id || !Array.isArray(units) || units.length !== 1 || units[0].custom_id !== row.id || units[0].amount?.currency_code !== 'EUR' || Number(units[0].amount?.value) !== Number(row.eur_total)) throw new CheckoutError('Payment details do not match this booking.', 409);
  return units[0];
}
export async function reconcile(row: any, allowCapture: boolean) {
  if (row.environment !== config().mode) throw new CheckoutError('This checkout belongs to a different PayPal environment.', 409);
  if (row.state === 'paid') return row;
  if (!row.order_id) throw new CheckoutError('PayPal order is not ready. Retry from the booking form.', 409);
  let order = await paypal(`/v2/checkout/orders/${encodeURIComponent(row.order_id)}`);
  verifyOrder(order, row);
  if (allowCapture && order.status === 'APPROVED') {
    row = await rpc('ec_paypal_begin_capture', { p_id: row.id });
    if (row.state === 'paid') return row;
    try { await paypal(`/v2/checkout/orders/${encodeURIComponent(row.order_id)}/capture`, 'POST', {}, `capture-${row.id}`); }
    catch { /* A timeout can happen after capture; verify with PayPal before retrying. */ }
    order = await paypal(`/v2/checkout/orders/${encodeURIComponent(row.order_id)}`);
  }
  const unit = verifyOrder(order, row);
  const captures = unit.payments?.captures ?? [];
  if (captures.length > 1) throw new CheckoutError('Payment requires manual verification.', 409);
  const cap = captures[0];
  if (cap?.status === 'COMPLETED') {
    if (cap.amount?.currency_code !== 'EUR' || Number(cap.amount?.value) !== Number(row.eur_total)) throw new CheckoutError('Payment amount mismatch.', 409);
    return rpc('ec_paypal_finish', { p_id: row.id, p_capture: cap.id, p_eur: cap.amount.value });
  }
  if (cap?.status === 'DECLINED' || cap?.status === 'FAILED' || order.status === 'VOIDED') return rpc('ec_paypal_fail', { p_id: row.id });
  return row;
}
