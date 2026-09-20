import { NextRequest } from 'next/server';
import { details, reconcile, session, TOKEN_COOKIE } from '@/lib/paypal-bookings';
import { failure, input, reply } from '@/lib/paypal-http';
import { CheckoutError } from '@/lib/paypal';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function POST(request: NextRequest) {
  try { const body = await input(request); const row = await session(request.cookies.get(TOKEN_COOKIE)?.value);
    if (body.orderId && body.orderId !== row.order_id) throw new CheckoutError('Another checkout is open in this browser. Return to the original booking tab.', 409);
    return reply(details(await reconcile(row, true))); }
  catch (error) { return failure(error); }
}
