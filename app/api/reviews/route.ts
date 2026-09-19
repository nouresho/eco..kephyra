import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing server configuration');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
export async function GET() {
  try {
    const { data, error } = await database().from('reviews')
      .select('id,customer_name,rating,review_text').eq('status', 'approved')
      .order('id', { ascending: false }).limit(100);
    if (error) return response({ message: 'Reviews are temporarily unavailable.' }, 503);
    return response({ reviews: data.map(row => ({ id: String(row.id), name: row.customer_name, rating: row.rating, text: row.review_text })) });
  } catch { return response({ message: 'Reviews are temporarily unavailable.' }, 503); }
}
export async function POST(request: NextRequest) {
  const reqOrigin = request.headers.get('origin');
const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
let sameOrigin = false;
try { sameOrigin = !!reqOrigin && new URL(reqOrigin).host === host; } catch {}
const allowed = (process.env.ADMIN_APP_ORIGIN ?? '').split(',').map(s => s.trim()).filter(Boolean);
if (!reqOrigin || (!sameOrigin && !allowed.includes(reqOrigin))) {
  return response({ message: 'Request origin not allowed.' }, 403);
}
  if (!request.headers.get('content-type')?.startsWith('application/json')) return response({ message: 'JSON required.' }, 415);
  try {
    const reader = request.body?.getReader();
    if (!reader) return response({ message: 'Review required.' }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.length;
      if (size > 12000) { await reader.cancel(); return response({ message: 'Review too long.' }, 413); }
      chunks.push(value);
    }
    let body: Record<string, unknown>;
    try { const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(); body = parsed; }
    catch { return response({ message: 'Invalid review.' }, 400); }
    // Honeypot: public submission never accepts moderation fields from the visitor.
    if (body.website) return response({ success: true, message: 'Thank you! Your review will appear after approval.' }, 202);
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const review = typeof body.review === 'string' ? body.review.trim() : '';
    const rating = body.rating;
    if (name.length < 2 || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || review.length < 10 || review.length > 2000 || typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return response({ message: 'Enter a name, valid email, rating from 1 to 5, and a review of 10–2000 characters.' }, 400);
    }
    const { error } = await database().from('reviews').insert({ customer_name: name, customer_email: email, rating, review_text: review, status: 'pending' });
    if (error) return response({ message: 'Your review could not be saved. Please try again.' }, 503);
    return response({ success: true, message: 'Thank you! Your review will appear after approval.' }, 201);
  } catch { return response({ message: 'Your review could not be saved. Please try again.' }, 503); }
}
