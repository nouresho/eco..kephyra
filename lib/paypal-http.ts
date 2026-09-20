import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { CheckoutError, config } from './paypal';
export const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
export function failure(error: unknown) { return reply({ message: error instanceof CheckoutError ? error.message : 'Payment service temporarily unavailable. Please retry.' }, error instanceof CheckoutError ? error.status : 503); }
export async function input(request: NextRequest, webhook = false) {
  if (!webhook && request.headers.get('origin') !== config().origin) throw new CheckoutError('Request origin not allowed.', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new CheckoutError('JSON required.', 415);
  const reader = request.body?.getReader(); if (!reader) throw new CheckoutError('Request body required.', 400);
  const parts: Uint8Array[] = []; let length = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; length += value.length; if (length > (webhook ? 262144 : 8192)) { await reader.cancel(); throw new CheckoutError('Request too large.', 413); } parts.push(value); }
  try { const body = JSON.parse(Buffer.concat(parts).toString('utf8')); if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error(); return body; }
  catch { throw new CheckoutError('Invalid request.', 400); }
}
