import { login } from './actions';
import { authorizedAdmin } from '@/lib/ec-admin/server';
import { redirect } from 'next/navigation';
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { allowed } = await authorizedAdmin();
  if (allowed) redirect('/admin');
  const { error } = await searchParams;
  return <main className="ec-login"><p className="ec-eyebrow">ECO KEPHYRA · TAMRAGHT</p><h1>Bienvenue.</h1><p>Votre espace de gestion des locations.</p>
    <form action={login} className="ec-card ec-form">
      <h2>Connexion administrateur</h2>
      {error && <p role="alert">Connexion refusée. Vérifiez vos identifiants et votre accès administrateur.</p>}
      <label>Email<input name="email" type="email" autoComplete="username" maxLength={254} required /></label>
      <label>Mot de passe<input name="password" type="password" autoComplete="current-password" maxLength={256} required /></label>
      <button>Se connecter →</button><p>Accès réservé aux comptes autorisés. Mot de passe oublié : contactez le propriétaire du projet Supabase.</p>
    </form></main>;
}
