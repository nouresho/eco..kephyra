'use server';
import { authorizedAdmin, adminClient } from '@/lib/ec-admin/server';
import { redirect } from 'next/navigation';
export async function login(form: FormData) {
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (email.length > 254 || password.length > 256 || !email || !password) redirect('/admin/login?error=1');
  const db = await adminClient();
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) redirect('/admin/login?error=1');
  const { allowed } = await authorizedAdmin();
  if (!allowed) { await db.auth.signOut(); redirect('/admin/login?error=1'); }
  redirect('/admin');
}
export async function logout() {
  const db = await adminClient();
  await db.auth.signOut();
  redirect('/admin/login');
}
