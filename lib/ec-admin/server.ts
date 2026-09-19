import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function adminClient() {
  const jar = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Configure Supabase environment variables.');
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (items) => {
        try { items.forEach(({ name, value, options }) => jar.set(name, value, options)); }
        catch { /* Server Component: session refresh is handled by proxy/middleware. */ }
      },
    },
  });
}

export async function authorizedAdmin() {
  const db = await adminClient();
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !user) return { db, user: null, allowed: false };
  const { data, error: roleError } = await db.rpc('ec_is_admin');
  return { db, user, allowed: !roleError && data === true };
}
