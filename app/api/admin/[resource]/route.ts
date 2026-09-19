import { NextRequest, NextResponse } from 'next/server';
import { authorizedAdmin } from '@/lib/ec-admin/server';
import * as v from '@/lib/ec-admin/validation';
export const dynamic = 'force-dynamic';
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
type Context = { params: Promise<{ resource: string }> };

async function handle(request: NextRequest, context: Context) {
  const { db, allowed, user } = await authorizedAdmin();
  if (!allowed) return json({ message: 'Accès refusé.' }, user ? 403 : 401);
  const { resource } = await context.params;
  if (!['reservations', 'settings', 'reviews'].includes(resource)) return json({ message: 'Introuvable.' }, 404);
  if (request.method === 'GET') {
    const raw = request.nextUrl.searchParams.get('page') ?? '1';
    const page = /^\d{1,5}$/.test(raw) ? Math.max(1, Number(raw)) : 1;
    const status = request.nextUrl.searchParams.get('status');
    let query = db.from(resource).select('*', { count: 'exact' }).order('id', { ascending: false });
    if (status && resource !== 'settings') query = query.eq('status', status);
    const { data, error, count } = await query.range((page - 1) * 25, page * 25 - 1);
    return error ? json({ message: 'Lecture impossible. Vérifiez la migration.' }, 500) : json({ data, count, page });
  }
  const origin = process.env.ADMIN_APP_ORIGIN;
  if (!origin || request.headers.get('origin') !== origin) return json({ message: 'Origine refusée.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ message: 'JSON requis.' }, 415);
  // Bound the stream, not only the untrusted Content-Length header.
  const reader = request.body?.getReader();
  if (!reader) return json({ message: 'Données requises.' }, 400);
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > 8192) { await reader.cancel(); return json({ message: 'Requête trop grande.' }, 413); } chunks.push(value); }
  let b: Record<string, unknown>;
  try { b = v.object(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { return json({ message: 'Données invalides.' }, 400); }
  try {
    if (request.method === 'POST' && resource === 'reservations') {
      const row = { ...v.booking(b), created_by_admin: user!.id };
      const { data, error } = await db.from('reservations').insert(row).select('id').single();
      if (error?.code === '23505') {
        const { data: existing } = await db.from('reservations').select('*').eq('admin_request_id', row.admin_request_id).eq('created_by_admin', user!.id).maybeSingle();
        const same = existing && Object.entries(row).every(([k, val]) => k === 'status' || k === 'payment_status' || String(existing[k]) === String(val));
        return same ? json({ success: true, id: existing.id }) : json({ message: 'Identifiant déjà utilisé. Rechargez le formulaire.' }, 409);
      }
      if (error) return dbError(error);
      return json({ success: true, id: data.id }, 201);
    }
    if (request.method !== 'PATCH') return json({ message: 'Méthode refusée.' }, 405);
    const rowId = v.id(String(b.id ?? ''));
    const version = v.integer(b.admin_version, 1, 2147483646);
    let changes: Record<string, unknown>;
    if (resource === 'settings') changes = { total_scooters: v.integer(b.total_scooters, 0, 10000) };
    else if (resource === 'reviews') changes = { status: v.choice(b.status, ['approved', 'rejected', 'pending']) };
    else {
      const field = v.choice(b.field, ['status', 'payment_status']);
      changes = { [field]: v.choice(b.value, field === 'status' ? ['confirmed', 'cancelled', 'completed'] : ['unpaid', 'paid', 'refunded']) };
    }
    const { data, error } = await db.from(resource).update(changes).eq('id', rowId).eq('admin_version', version).select('id');
    if (error) return dbError(error);
    if (!data?.length) return json({ message: 'Données modifiées ailleurs. Actualisez puis réessayez.' }, 409);
    return json({ success: true });
  } catch { return json({ message: 'Champs invalides. Vérifiez dates, email, téléphone et montant.' }, 400); }
}
function dbError(error: { code?: string; message: string }) {
  if (error.message.includes('EC_CAPACITY')) return json({ message: 'Capacité insuffisante pour ces dates ou ce nombre de scooters.' }, 409);
  if (error.message.includes('EC_TRANSITION')) return json({ message: 'Ce changement de statut est interdit.' }, 409);
  if (error.code === '40001' || error.code === '40P01') return json({ message: 'Modification simultanée. Réessayez avec le même formulaire.' }, 409);
  return json({ message: 'Enregistrement refusé. Vérifiez les champs et la configuration.' }, 400);
}
async function safely(request: NextRequest, context: Context) { try { return await handle(request, context); } catch { return json({ message: 'Service indisponible.' }, 503); } }
export const GET = safely;
export const POST = safely;
export const PATCH = safely;
