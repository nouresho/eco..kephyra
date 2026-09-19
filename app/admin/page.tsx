import { authorizedAdmin } from '@/lib/ec-admin/server';
import { redirect } from 'next/navigation';
import Dashboard from './dashboard';
import { logout } from './login/actions';
export default async function Admin() {
  const { allowed, user } = await authorizedAdmin();
  if (!allowed) redirect('/admin/login');
  return <main className="ec-shell"><header className="ec-header"><div><p className="ec-eyebrow">ECO KEPHYRA · ADMINISTRATION</p><h1>Let’s manage<br />the ride.</h1></div><form action={logout}><p>{user?.email}</p><button className="ec-secondary">Déconnexion</button></form></header><Dashboard /></main>;
}
