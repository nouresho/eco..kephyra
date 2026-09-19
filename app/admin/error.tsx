'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="ec-login"><h1>Chargement impossible.</h1><p>Vérifiez la configuration Supabase et votre connexion.</p><button onClick={reset}>Réessayer</button></main>;
}
