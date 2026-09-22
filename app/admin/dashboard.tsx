'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
type Row = { scooter_quantity?: number; id: string | number; admin_version: number; customer_name?: string; customer_email?: string; customer_phone?: string; start_date?: string; end_date?: string; total_price?: number; total_days?: number; status?: string; payment_status?: string; payment_method?: string; booking_source?: string; total_scooters?: number; rating?: number; review_text?: string };
type Resource = 'reservations' | 'reviews' | 'settings';
const labels: Record<string, string> = { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée', completed: 'Terminée', unpaid: 'Non payé', paid: 'Payé', refunded: 'Remboursé', approved: 'Approuvé', rejected: 'Rejeté' };
export default function Dashboard() {
  const [tab, setTab] = useState<Resource>('reservations');
  const [rows, setRows] = useState<Row[]>([]), [count, setCount] = useState(0), [page, setPage] = useState(1), [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [manual, setManual] = useState(false);
  const requestId = useRef('');
  const generation = useRef(0);
  const load = useCallback(async () => {
    const seq = ++generation.current; setLoading(true); setError('');
    try { const res = await fetch(`/api/admin/${tab}?page=${page}&status=${filter}`, { cache: 'no-store' }); const result = await res.json();
      if (!res.ok) throw new Error(result.message); if (seq === generation.current) { setRows(result.data); setCount(result.count ?? 0); }
    } catch (e) { if (seq === generation.current) { setRows([]); setError(e instanceof Error ? e.message : 'Chargement impossible.'); } }
    finally { if (seq === generation.current) setLoading(false); }
  }, [tab, page, filter]);
  useEffect(() => { void load(); return () => { generation.current++; }; }, [load]);
  async function mutate(resource: Resource, body: object, method = 'PATCH') {
    setBusy(true); setError(''); setNotice('');
    try { const res = await fetch(`/api/admin/${resource}`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const result = await res.json();
      if (!res.ok) throw new Error(result.message); await load(); setNotice('Modification enregistrée.'); return true;
    } catch (e) { setError(e instanceof Error ? e.message : 'Enregistrement impossible.'); return false; }
    finally { setBusy(false); }
  }
  async function change(row: Row, field: string, value: string) {
    if (!window.confirm(`Confirmer : ${labels[value] ?? value} ?`)) return;
    await mutate(tab, { id: String(row.id), admin_version: row.admin_version, ...(tab === 'reviews' ? { status: value } : { field, value }) });
  }
  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form));
    if (!requestId.current) requestId.current = crypto.randomUUID();
    if (await mutate('reservations', { ...data, scooter_quantity: Number(data.scooter_quantity), total_price: Number(data.total_price), admin_request_id: requestId.current }, 'POST')) { form.reset(); requestId.current = ''; setManual(false); }
  }
  return <>
    <nav className="ec-tabs" aria-label="Administration">{(['reservations', 'reviews', 'settings'] as Resource[]).map(key => <button disabled={busy} key={key} aria-pressed={tab === key} onClick={() => { setTab(key); setPage(1); setFilter(''); setManual(false); setNotice(''); }}>{key === 'reservations' ? 'Réservations' : key === 'reviews' ? 'Avis clients' : 'Parc scooters'}</button>)}</nav>
    <section className="ec-toolbar"><div><p className="ec-eyebrow">VOTRE ACTIVITÉ, SIMPLEMENT</p><h2>{tab === 'reservations' ? 'Les prochaines aventures.' : tab === 'reviews' ? 'La voix des voyageurs.' : 'Prêt pour la route.'}</h2></div><button disabled={busy || loading} className="ec-secondary" onClick={() => void load()}>Actualiser</button></section>
    {error && <p role="alert" className="ec-alert">{error}</p>}{notice && <p role="status" className="ec-notice">{notice}</p>}
    {tab === 'reservations' && <button disabled={busy} onClick={() => { setManual(!manual); }}>+ Réservation WhatsApp</button>}
    {manual && tab === 'reservations' && <form className="ec-card ec-form" onSubmit={add}><h3>Ajouter une réservation WhatsApp</h3><p>Choisissez le nombre de scooters. Les deux dates sont incluses. Le prix total convenu est saisi en MAD ; aucun paiement n’est déclenché.</p><fieldset disabled={busy} className="ec-grid">
      <label>Nom<input name="customer_name" minLength={2} maxLength={120} required /></label><label>Email<input name="customer_email" type="email" maxLength={254} required /></label><label>Téléphone<input name="customer_phone" type="tel" minLength={6} maxLength={40} required /></label>
      <label>Début<input name="start_date" type="date" required /></label><label>Fin incluse<input name="end_date" type="date" required /></label><label>Nombre de scooters<input name="scooter_quantity" type="number" min="1" max="10000" step="1" defaultValue={1} required /></label><label>Prix total du groupe (MAD)<input name="total_price" type="number" min="0" max="99999999.99" step="0.01" required /></label><label>Mode de paiement<select name="payment_method"><option value="cash">Espèces</option><option value="online">En ligne</option></select></label>
    </fieldset><button disabled={busy}>{busy ? 'Enregistrement…' : 'Vérifier la capacité et enregistrer'}</button><p>La réservation sera confirmée, avec paiement « Non payé ». Après une erreur réseau, réessayez sans fermer ce formulaire : la même demande ne sera pas créée deux fois.</p></form>}
    {tab !== 'settings' && <div className="ec-toolbar"><label>Filtrer par statut <select disabled={busy} value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}><option value="">Tous</option>{(tab === 'reservations' ? ['pending', 'confirmed', 'cancelled', 'completed'] : ['pending', 'approved', 'rejected']).map(s => <option key={s} value={s}>{labels[s]}</option>)}</select></label><span>{count} résultat(s)</span></div>}
    {loading ? <p role="status">Chargement…</p> : <div className="ec-list">{!rows.length && !error && <div className="ec-card">Aucun résultat.</div>}{rows.map(row => <article className="ec-card" key={String(row.id)}>
      {tab === 'settings' ? <form className="ec-form" onSubmit={async e => { e.preventDefault(); const total = Number(new FormData(e.currentTarget).get('total')); if (window.confirm(`Définir le parc à ${total} scooter(s) ?`)) await mutate('settings', { id: String(row.id), admin_version: row.admin_version, total_scooters: total }); }}><h3>Nombre de scooters</h3><p>Une réduction est refusée si elle rend une réservation active impossible. Zéro ferme les nouvelles réservations.</p><label>Parc disponible<input key={`${row.id}-${row.admin_version}`} name="total" type="number" min="0" max="10000" defaultValue={row.total_scooters} required /></label><button disabled={busy}>Enregistrer le parc</button></form> : <>
        <div className="ec-toolbar"><div><p className="ec-eyebrow">#{String(row.id)} {tab === 'reservations' ? `· ${row.booking_source ?? 'site'}` : `· ${'★'.repeat(row.rating ?? 0)}`}</p><h3>{row.customer_name}</h3></div><span className="ec-badge">{labels[row.status ?? ''] ?? row.status}</span></div>
        <p className="ec-contact">{row.customer_email}{row.customer_phone && ` · ${row.customer_phone}`}</p>
        {tab === 'reservations' ? <><div className="ec-details"><p><strong>{row.start_date} → {row.end_date}</strong><br />{row.total_days} jour(s) · {row.scooter_quantity ?? 1} scooter(s)</p><p><strong>{Number(row.total_price).toFixed(2)} MAD</strong><br />{labels[row.payment_status ?? '']} · {row.payment_method === 'cash' ? 'Espèces' : 'En ligne'}</p></div><div className="ec-actions">
          {row.status === 'pending' && <button disabled={busy} onClick={() => void change(row, 'status', 'confirmed')}>Confirmer</button>}
          {['pending', 'confirmed'].includes(row.status ?? '') && <button disabled={busy} className="ec-secondary" onClick={() => void change(row, 'status', 'cancelled')}>Annuler</button>}
          {row.status === 'confirmed' && <button disabled={busy} className="ec-secondary" onClick={() => void change(row, 'status', 'completed')}>Terminer / scooter rendu</button>}
          <label>Paiement <select disabled={busy} value={row.payment_status} onChange={e => void change(row, 'payment_status', e.target.value)}>{['unpaid', 'paid', 'refunded'].map(s => <option value={s} key={s}>{labels[s]}</option>)}</select></label></div><small>Le statut de paiement est un suivi administratif, sans débit ni remboursement bancaire.</small></> : <><p className="ec-review">{row.review_text}</p><div className="ec-actions">{['approved', 'rejected', 'pending'].filter(s => s !== row.status).map(s => <button disabled={busy} key={s} className="ec-secondary" onClick={() => void change(row, 'status', s)}>{labels[s]}</button>)}</div></>}
      </>}
    </article>)}</div>}
    {tab !== 'settings' && <div className="ec-toolbar"><button disabled={busy || loading || page <= 1} className="ec-secondary" onClick={() => setPage(page - 1)}>← Précédent</button><span>Page {page} / {Math.max(1, Math.ceil(count / 25))}</span><button disabled={busy || loading || page * 25 >= count} className="ec-secondary" onClick={() => setPage(page + 1)}>Suivant →</button></div>}
  </>;
}
