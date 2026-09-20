import { NextRequest } from 'next/server';
import { config, paypal } from '@/lib/paypal';
import { database, reconcile } from '@/lib/paypal-bookings';
import { failure, input, reply } from '@/lib/paypal-http';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    config();
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) return reply({ message: 'Webhook not configured.' }, 503);
    const event = await input(request, true);
    const verification = await paypal('/v1/notifications/verify-webhook-signature', 'POST', {
      auth_algo: request.headers.get('paypal-auth-algo'), cert_url: request.headers.get('paypal-cert-url'), transmission_id: request.headers.get('paypal-transmission-id'), transmission_sig: request.headers.get('paypal-transmission-sig'), transmission_time: request.headers.get('paypal-transmission-time'), webhook_id: webhookId, webhook_event: event
    });
    if (verification.verification_status !== 'SUCCESS') return reply({ message: 'Invalid signature.' }, 400);
    if (!['CHECKOUT.ORDER.APPROVED', 'PAYMENT.CAPTURE.COMPLETED', 'PAYMENT.CAPTURE.PENDING', 'PAYMENT.CAPTURE.DENIED'].includes(event.event_type)) return reply({ received: true });
    const orderId = event.event_type === 'CHECKOUT.ORDER.APPROVED' ? event.resource?.id : event.resource?.supplementary_data?.related_ids?.order_id;
    if (!orderId) return reply({ message: 'Missing order reference.' }, 400);
    const { data: row, error } = await database().from('paypal_payments').select('*').eq('order_id', orderId).maybeSingle();
    if (error) return reply({ message: 'Database unavailable.' }, 503);
    // Retry unknown orders: the callback can arrive before local create-order storage.
    if (!row) return reply({ message: 'Order not yet recorded.' }, 503);
    if (row.state === 'expired' || row.state === 'failed') return reply({ received: true });
    await reconcile(row, event.event_type === 'CHECKOUT.ORDER.APPROVED');
    return reply({ received: true });
  } catch (error) { return failure(error); }
}
