"use client";
import { useRef, useState } from 'react';
type Booking = { customer_name: string; customer_email: string; customer_phone: string; start_date: string; end_date: string };
type Quote = { state: string; mad: string; eur: string; rateDate: string; expiresAt: string; approveUrl: string; mode: string };
export default function PayPalCheckout({ disabled, booking }: { disabled: boolean; booking: Booking }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [quote, setQuote] = useState<{ key: string; value: Quote } | null>(null);
  const locked = useRef(false);
  const key = JSON.stringify(booking);
  async function prepare(button: HTMLButtonElement) {
    if (locked.current || !button.form?.reportValidity()) return;
    locked.current = true; setBusy(true); setError('');
    try {
      const saved = sessionStorage.getItem('ec-paypal-request');
      let request = saved ? JSON.parse(saved) : null;
      if (!request || request.key !== key) request = { key, id: crypto.randomUUID() };
      sessionStorage.setItem('ec-paypal-request', JSON.stringify(request));
      const response = await fetch('/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...booking, requestId: request.id }) });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409 && /expired/i.test(data.message)) sessionStorage.removeItem('ec-paypal-request');
        throw new Error(data.message || 'Unable to prepare payment.');
      }
      if (data.state === 'paid' || data.state === 'capturing') { window.location.assign('/reservation/paypal-return'); return; }
      setQuote({ key, value: data });
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to prepare payment. Please retry.'); }
    finally { locked.current = false; setBusy(false); }
  }
  const current = quote?.key === key ? quote.value : null;
  return <div className="mt-8 space-y-4">
    {current ? <div className="rounded-2xl border border-[#49372D]/15 bg-[#F3EFE7] p-5">
      <p className="font-bold">Full rental: {current.mad} MAD</p>
      <p className="mt-2 text-2xl font-black">Pay {current.eur} EUR</p>
      <p className="mt-2 text-xs leading-5 text-[#6F7F73]">Converted using the daily rate dated {current.rateDate}. Your quote and scooter are held until {new Date(current.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Your card issuer may apply its own conversion or fees.</p>
      {current.mode === 'sandbox' && <p className="mt-3 text-sm font-bold">Test mode — no real payment.</p>}
      <a href={current.approveUrl} className="mt-4 block rounded-full bg-[#FFC439] px-6 py-4 text-center font-bold text-[#003087]">Pay {current.eur} EUR with PayPal →</a>
    </div> : <button type="button" disabled={disabled || busy} onClick={event => void prepare(event.currentTarget)} className="w-full rounded-full bg-[#FFC439] px-7 py-5 font-bold text-[#003087] disabled:opacity-50">{busy ? 'Preparing your payment…' : 'Continue with PayPal →'}</button>}
    {!current && <p className="text-center text-xs text-[#6F7F73]">See the exact EUR total before paying securely on PayPal.</p>}
    {error && <p role="alert" className="rounded-xl bg-[#EAD9BC] p-4 text-sm">{error}</p>}
  </div>;
}
