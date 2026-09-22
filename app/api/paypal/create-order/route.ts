
import { NextRequest } from 'next/server';

import {
  CheckoutError,
  config,
  exchangeRate,
  paypal,
} from '@/lib/paypal';

import {
  database,
  details,
  hash,
  rpc,
  TOKEN_COOKIE,
} from '@/lib/paypal-bookings';

import { bookingInput } from '@/lib/paypal-validation';

import {
  failure,
  input,
  reply,
} from '@/lib/paypal-http';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // STEP 1: PayPal configuration
    console.log('[PAYPAL] STEP 1: Loading configuration');

    const c = config();

    console.log('[PAYPAL] Configuration loaded', {
      mode: c.mode,
      origin: c.origin,
    });

    // STEP 2: Read request body
    console.log('[PAYPAL] STEP 2: Reading request');

    const body = await input(request);

    if (
      typeof body.requestId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        body.requestId
      )
    ) {
      throw new CheckoutError(
        'Invalid checkout identifier.',
        400
      );
    }

    // STEP 3: Validate booking
    console.log('[PAYPAL] STEP 3: Validating booking');

    let booking;

    try {
      booking = bookingInput(body);
    } catch (error) {
      throw new CheckoutError(
        (error as Error).message,
        400
      );
    }

    // STEP 4: Generate identifiers
    console.log('[PAYPAL] STEP 4: Generating identifiers');

    const tokenHash = hash(body.requestId);

    const fingerprint = hash(
      JSON.stringify(booking)
    );

    // STEP 5: Connect to database
    console.log('[PAYPAL] STEP 5: Connecting to database');

    const db = database();

    const {
      data: existingRow,
      error: databaseError,
    } = await db
      .from('paypal_payments')
      .select('*')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (databaseError) {
      console.error(
        '[PAYPAL] Database lookup failed:',
        databaseError.code,
        databaseError.message
      );

      throw new CheckoutError(
        'Online booking setup is incomplete. Please contact us.'
      );
    }

    let row = existingRow;

    console.log('[PAYPAL] STEP 5 OK: Database lookup completed');

    // STEP 6: Check existing checkout
    if (
      row &&
      (
        row.fingerprint !== fingerprint ||
        row.environment !== c.mode
      )
    ) {
      throw new CheckoutError(
        'Start a new checkout for changed booking details.',
        409
      );
    }

    // STEP 7: Reserve booking
    if (!row) {
      console.log(
        '[PAYPAL] STEP 7: Getting exchange rate'
      );

      const rate = await exchangeRate();

      console.log(
        '[PAYPAL] STEP 7 OK: Exchange rate received'
      );

      console.log(
        '[PAYPAL] STEP 8: Reserving booking'
      );

      row = await rpc('ec_paypal_reserve_quantity', {
        p_hash: tokenHash,
        p_fingerprint: fingerprint,
        p_booking: booking,
        p_rate: rate.rate,
        p_date: rate.date,
        p_environment: c.mode,
      });

      console.log(
        '[PAYPAL] STEP 8 OK: Booking reserved'
      );
    }

    // STEP 9: Check checkout expiration
    console.log(
      '[PAYPAL] STEP 9: Checking checkout state'
    );

    if (
      row.state === 'expired' ||
      row.state === 'failed' ||
      (
        row.state === 'held' &&
        Date.parse(row.expires_at) <= Date.now()
      )
    ) {
      throw new CheckoutError(
        'This checkout expired. Start a new checkout.',
        409
      );
    }

    // STEP 10: Create PayPal order
    if (!row.order_id) {
      console.log(
        '[PAYPAL] STEP 10: Creating PayPal order'
      );

      const order = await paypal(
        '/v2/checkout/orders',
        'POST',
        {
          intent: 'CAPTURE',

          purchase_units: [
            {
              reference_id: row.id,
              custom_id: row.id,

              invoice_id:
                `ECO-${c.mode}-${row.id}`,

              description:
                `${booking.scooter_quantity} scooter(s): ${booking.start_date} to ${booking.end_date}`,

              amount: {
                currency_code: 'EUR',

                value: Number(
                  row.eur_total
                ).toFixed(2),
              },
            },
          ],

          payment_source: {
            paypal: {
              experience_context: {
                brand_name: 'ECO KEPHYRA',

                shipping_preference:
                  'NO_SHIPPING',

                user_action:
                  'PAY_NOW',

                return_url:
                  `${c.origin}/reservation/paypal-return`,

                cancel_url:
                  `${c.origin}/reservation/paypal-return?cancelled=1`,
              },
            },
          },
        },
        `create-${row.id}`
      );

      console.log(
        '[PAYPAL] STEP 10 OK: PayPal order created'
      );

      // STEP 11: Find PayPal approval URL
      console.log(
        '[PAYPAL] STEP 11: Checking PayPal redirect'
      );

      const link = order.links?.find(
        (l: any) =>
          l.rel === 'payer-action' ||
          l.rel === 'approve'
      )?.href;

      if (!order.id || !link) {
        throw new CheckoutError(
          'Unable to open PayPal checkout.'
        );
      }

      const target = new URL(link);

      const host =
        c.mode === 'live'
          ? 'www.paypal.com'
          : 'www.sandbox.paypal.com';

      if (
        target.protocol !== 'https:' ||
        target.hostname !== host
      ) {
        throw new CheckoutError(
          'Unexpected PayPal redirect.'
        );
      }

      console.log(
        '[PAYPAL] STEP 11 OK: Redirect validated'
      );

      // STEP 12: Save PayPal order
      console.log(
        '[PAYPAL] STEP 12: Saving PayPal order'
      );

      const saved = await db
        .from('paypal_payments')
        .update({
          order_id: order.id,
          approve_url: link,
        })
        .eq('id', row.id)
        .select('*')
        .single();

      if (saved.error) {
        console.error(
          '[PAYPAL] Order save failed:',
          saved.error.code,
          saved.error.message
        );

        throw new CheckoutError(
          'Unable to save PayPal checkout. Retry with the same booking.'
        );
      }

      row = saved.data;

      console.log(
        '[PAYPAL] STEP 12 OK: Order saved'
      );
    }

    // STEP 13: Prepare response
    console.log(
      '[PAYPAL] STEP 13: Preparing checkout response'
    );

    const response = reply(
      details(row)
    );

    response.cookies.set(
      TOKEN_COOKIE,
      body.requestId,
      {
        httpOnly: true,

        secure:
          c.origin.startsWith('https://'),

        sameSite: 'lax',

        path: '/api/paypal',

        maxAge: 86400,
      }
    );

    console.log(
      '[PAYPAL] SUCCESS: Checkout ready'
    );

    return response;

  } catch (error) {
    console.error(
      '[PAYPAL] CHECKOUT FAILED:',
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            status:
              error instanceof CheckoutError
                ? error.status
                : undefined,
          }
        : 'Unknown error'
    );

    return failure(error);
  }
}
