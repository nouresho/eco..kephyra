import { NextRequest } from 'next/server';
import { details, rpc, session, TOKEN_COOKIE } from '@/lib/paypal-bookings';
import { failure, reply } from '@/lib/paypal-http';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try { await rpc('ec_paypal_expire'); return reply(details(await session(request.cookies.get(TOKEN_COOKIE)?.value))); }
  catch (error) { return failure(error); }
}
