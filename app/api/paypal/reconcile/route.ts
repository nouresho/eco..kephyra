import { NextRequest } from 'next/server';
import { database, reconcile, rpc } from '@/lib/paypal-bookings';
import { reply } from '@/lib/paypal-http';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return reply({ message: 'Unauthorized' }, 401);
  await rpc('ec_paypal_expire');
  const { data, error } = await database().from('paypal_payments').select('*').eq('state', 'capturing').order('created_at').limit(5);
  if (error) return reply({ message: 'Unable to reconcile payments.' }, 503);
  const outcomes = await Promise.allSettled((data ?? []).map(row => reconcile(row, true)));
  return reply({ checked: outcomes.length, unresolved: outcomes.filter(r => r.status === 'rejected' || r.value.state === 'capturing').length });
}
