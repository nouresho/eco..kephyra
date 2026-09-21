"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
type Review = { id: string; name: string; rating: number; text: string };
export default function HomeReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true), [loadError, setLoadError] = useState('');
  const [sending, setSending] = useState(false), [message, setMessage] = useState('');
  const inFlight = useRef(false), sequence = useRef(0);
  const load = useCallback(async () => {
    const ticket = ++sequence.current;
    try {
      const res = await fetch('/api/reviews', { cache: 'no-store', signal: AbortSignal.timeout(12000) });
      const data = await res.json(); if (!res.ok) throw new Error();
      if (ticket === sequence.current) { setReviews(data.reviews); setLoadError(''); }
    } catch { if (ticket === sequence.current) { setReviews([]); setLoadError('Reviews are temporarily unavailable.'); } }
    finally { if (ticket === sequence.current) setLoading(false); }
  }, []);
  useEffect(() => {
    void load();
    const refresh = () => { if (document.visibilityState === 'visible') void load(); };
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh); document.addEventListener('visibilitychange', refresh);
    return () => { sequence.current++; clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [load]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (inFlight.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    inFlight.current = true; setSending(true); setMessage('');
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, rating: Number(values.rating) }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || 'Unable to submit your review.');
      form.reset(); setMessage(data.message);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Network error. Please try again.'); }
    finally { inFlight.current = false; setSending(false); }
  }
  return <>
      <section className="bg-[#F5F1E8] px-5 py-24 md:px-10 md:py-32 lg:px-14">

        <div className="mx-auto max-w-7xl">

          {/* CENTERED TITLE */}
          <div className="mb-14 text-center md:mb-20">


            <h2 className="section-title mt-5">
              FROM THE ROAD
            </h2>

            <p className="mx-auto mt-5 max-w-md text-sm font-medium leading-7 text-[#6F7F73]">
              Experiences shared by people who explored the coast on two
              electric wheels.
            </p>

          </div>


          {/* ================================================= */}
          {/* REVIEW CARDS — ALL CREAMY GREEN */}
          {/* ================================================= */}

          <div role="status" className="mb-6 text-center text-sm text-[#49372D]">
            {loading ? 'Loading reviews…' : loadError || (reviews.length === 0 ? 'Be the first to share your ride.' : '')}
            {loadError && <button type="button" className="ml-3 underline" onClick={() => void load()}>Try again</button>}
          </div>
          <div className="grid gap-5 md:grid-cols-3">

            {reviews.map((review) => (
              <article
                key={review.id}
                className="
                  flex
                  min-h-[330px]
                  flex-col
                  justify-between
                  rounded-[26px]
                  border
                  border-[#49372D]/10
                  bg-[#DCE4C8]
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-[0_18px_40px_rgba(73,55,45,0.10)]
                  md:p-8
                "
              >

                <div>

                  {/* STARS */}
                  <div className="text-[15px] tracking-[0.12em] text-[#49372D]">
                    {"★".repeat(review.rating)}
                  </div>


                  {/* REVIEW */}
                  <p className="mt-8 text-[20px] font-bold leading-8 tracking-[-0.025em] text-[#49372D]">
                    “{review.text}”
                  </p>

                </div>


                {/* NAME */}
                <div className="mt-10 border-t border-[#49372D]/15 pt-5">

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6F7F73]">
                    {review.name}
                  </p>

                </div>

              </article>
            ))}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* ADD REVIEW */}
      {/* ================================================= */}

      <section className="bg-[#F3EFE7] px-5 py-24 md:px-10 md:py-32 lg:px-14">

        <div className="mx-auto max-w-6xl">

          {/* CENTERED TITLE */}
          <div className="mb-14 text-center md:mb-20">



            <h2 className="section-title mt-5">
              LEAVE A REVIEW.
            </h2>

            <p className="mx-auto mt-6 max-w-md text-sm font-medium leading-7 text-[#6F7F73]">
Share your ride
            </p>

          </div>


          {/* ================================================= */}
          {/* REVIEW FORM */}
          {/* ================================================= */}

          <form onSubmit={submit} className="mx-auto max-w-3xl rounded-[30px] border-2 border-[#49372D]/15 bg-[#FFFDF8] p-6 shadow-[0_18px_50px_rgba(73,55,45,0.10)] md:p-10">

            {/* FORM HEADER */}
            <div className="mb-9 border-b border-[#49372D]/10 pb-6">

              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#49372D]">
                Write your review
              </p>

              <p className="mt-2 text-xs leading-5 text-[#6F7F73]">
                Fill in the fields below to share your experience.
              </p>

            </div>


            {/* NAME */}
            <div>

              <label
                htmlFor="review-name"
                className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#49372D]"
              >
                YOUR FULL NAME
              </label>

              <input
                id="review-name"
                name="name" required minLength={2} maxLength={120}
                type="text"
                placeholder="Enter your name"
                className="
                  w-full
                  rounded-[14px]
                  border
                  border-[#49372D]/20
                  bg-[#F3EFE7]
                  px-5
                  py-4
                  text-[14px]
                  font-medium
                  text-[#49372D]
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-[#6F7F73]/60
                  hover:border-[#49372D]/35
                  focus:border-[#6F7F73]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#6F7F73]/10
                "
              />

            </div>



            <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            {/* RATING */}
            <div className="mt-6">

              <label
                htmlFor="review-rating"
                className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#49372D]"
              >
                Your rating
              </label>

              <select
                id="review-rating"
                name="rating"
                defaultValue="5"
                className="
                  w-full
                  cursor-pointer
                  rounded-[14px]
                  border
                  border-[#49372D]/20
                  bg-[#F3EFE7]
                  px-5
                  py-4
                  text-[14px]
                  font-medium
                  text-[#49372D]
                  outline-none
                  transition-all
                  duration-300
                  hover:border-[#49372D]/35
                  focus:border-[#6F7F73]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#6F7F73]/10
                "
              >
                <option value="5">★★★★★ — Excellent</option>
                <option value="4">★★★★☆ — Very good</option>
                <option value="3">★★★☆☆ — Good</option>
                <option value="2">★★☆☆☆ — Fair</option>
                <option value="1">★☆☆☆☆ — Poor</option>
              </select>

            </div>


            {/* REVIEW MESSAGE */}
            <div className="mt-6">

              <label
                htmlFor="review-message"
                className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#49372D]"
              >
                Your review
              </label>

              <textarea
                id="review-message"
                name="review" required minLength={10} maxLength={2000}
                rows={6}
                placeholder="How was your ride? Share your experience..."
                className="
                  w-full
                  resize-none
                  rounded-[14px]
                  border
                  border-[#49372D]/20
                  bg-[#F3EFE7]
                  px-5
                  py-4
                  text-[14px]
                  font-medium
                  leading-7
                  text-[#49372D]
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-[#6F7F73]/60
                  hover:border-[#49372D]/35
                  focus:border-[#6F7F73]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#6F7F73]/10
                "
              />

            </div>


            {/* SUBMIT */}
            <div className="mt-8 flex justify-center">

              <button
                type="submit" disabled={sending}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-between
                  rounded-full
                  bg-[#49372D]
                  px-7
                  py-4
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#F5F1E8]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#6F7F73]
                  sm:w-auto
                  sm:min-w-[230px]
                "
              >
                {sending ? 'Sending…' : 'Submit review '}


              </button>

            </div>

          <p role="status" aria-live="polite" className="mt-5 text-center text-sm text-[#49372D]">{message}</p>
          </form>

        </div>

      </section>



  </>;
}
