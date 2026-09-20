import 'server-only';

export class CheckoutError extends Error {
  constructor(message: string, public status = 503) { super(message); }
}
export function config() {
  const client = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_ENV || 'sandbox';
  const origin = process.env.ADMIN_APP_ORIGIN;
  if (!client || !secret || !origin || !['sandbox', 'live'].includes(mode)) throw new CheckoutError('Online payment is not configured yet.');
  if (mode === 'live' && (!origin.startsWith('https://') || !process.env.PAYPAL_WEBHOOK_ID)) throw new CheckoutError('Live payment configuration is incomplete.');
  return { client, secret, origin: new URL(origin).origin, mode, base: mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com' };
}
export async function paypal(path: string, method = 'GET', body?: unknown, requestId?: string): Promise<any> {
  const c = config();
  const tokenResponse = await fetch(`${c.base}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${c.client}:${c.secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials', cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!tokenResponse.ok) {
  const errorBody = await tokenResponse.text();

  console.error('[PAYPAL AUTH ERROR]', {
    status: tokenResponse.status,
    response: errorBody,
    environment: c.mode,
  });

  throw new CheckoutError(
    'PayPal authentication failed. Check server logs.',
    503
  );
}
  const token = await tokenResponse.json();
  const res = await fetch(`${c.base}${path}`, { method, headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(requestId ? { 'PayPal-Request-Id': requestId } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}), cache: 'no-store', signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new CheckoutError('PayPal has not confirmed this payment. Retry to check its status.', res.status === 404 ? 404 : 503);
  return res.status === 204 ? {} : res.json();
}
export async function exchangeRate() {
  const res = await fetch('https://api.frankfurter.dev/v2/rates?base=MAD&quotes=EUR', { cache: 'no-store', signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new CheckoutError('Currency conversion is temporarily unavailable.');
  const data = await res.json();
  const row = Array.isArray(data) ? data.find((r: any) => r.base === 'MAD' && r.quote === 'EUR') : null;
  const age = row ? Date.now() - Date.parse(row.date) : NaN;
  if (!row || !Number.isFinite(row.rate) || row.rate <= 0 || !Number.isFinite(age) || age < -86400000 || age > 7 * 86400000) throw new CheckoutError('A recent exchange rate is unavailable. Please try again later.');
  return { rate: row.rate as number, date: row.date as string };
}
