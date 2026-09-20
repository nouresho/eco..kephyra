"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
type Result = { state: string; reservationId: string; eur: string; mad: string; mode: string };
function PaymentResult() {
  const params = useSearchParams(), cancelled = params.get('cancelled') === '1', orderId = params.get('token');
  const [result, setResult] = useState<Result | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(true);
  const running = useRef(false);
  const check = useCallback(async () => {
    if (running.current) return;
    running.current = true; setBusy(true); setError('');
    try {
      const response = await fetch(cancelled ? '/api/paypal/session' : '/api/paypal/capture-order', cancelled ? { cache: 'no-store' } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to verify payment.');
      setResult(data);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to verify payment.'); }
    finally { running.current = false; setBusy(false); }
  }, [cancelled, orderId]);
  useEffect(() => { void check(); }, [check]);
  const paid = result?.state === 'paid';
  return <main className="min-h-screen bg-[#F3EFE7] px-5 py-28 text-[#49372D]"><div className="mx-auto max-w-xl rounded-[30px] bg-[#FFFDF8] p-8">
    <h1 className="text-3xl font-black">{paid ? 'Your ride is confirmed.' : busy ? 'Checking your payment…' : cancelled ? 'Checkout cancelled.' : 'Payment verification'}</h1>
    {paid && <p className="mt-5 leading-7">Reservation #{result.reservationId} · Paid {result.eur} EUR ({result.mad} MAD).{result.mode === 'sandbox' && ' Sandbox test — no real money was charged.'}</p>}
    {!paid && !busy && <p className="mt-5 leading-7">{cancelled ? 'An unpaid reservation expires automatically after 15 minutes. An already approved payment may still be confirmed.' : 'Your payment is not confirmed yet. Check again before starting another booking. If this persists, contact ECO KEPHYRA.'}</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-[#EAD9BC] p-4">{error}</p>}
    {!paid && <button onClick={() => void check()} disabled={busy} className="mt-6 rounded-full bg-[#49372D] px-6 py-3 text-white disabled:opacity-50">Check again</button>}
    <Link href="/" className="mt-6 block underline">Back to home</Link>
  </div></main>;
}
export default function Page() { return <Suspense fallback={<p>Checking payment…</p>}><PaymentResult /></Suspense>; }
