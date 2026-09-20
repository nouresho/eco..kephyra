
"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import PayPalCheckout from "../components/PayPalCheckout";
import { useRouter, useSearchParams } from "next/navigation";

type PaymentMethod = "online" | "cash";

type AvailabilityResponse = {
  success: boolean;
  available?: boolean;
  message?: string;
};

type ReservationResponse = {
  success: boolean;
  reservationId?: number;
  message?: string;
};

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function calculateDays(start: string, end: string): number {
  if (!isValidDate(start) || !isValidDate(end) || end < start) {
    return 0;
  }

  const startTime = Date.parse(`${start}T00:00:00.000Z`);
  const endTime = Date.parse(`${end}T00:00:00.000Z`);

  return Math.round((endTime - startTime) / 86400000) + 1;
}

function getDailyRate(days: number): number {
  if (days >= 30) return 120;
  if (days >= 7) return 155;
  if (days >= 5) return 170;
  if (days >= 3) return 180;

  return 200;
}

function formatDate(value: string): string {
  if (!isValidDate(value)) return "—";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function ReservationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("start") ?? "";
  const endDate = searchParams.get("end") ?? "";

  const totalDays = calculateDays(startDate, endDate);
  const dailyRate = getDailyRate(totalDays);
  const totalPrice = totalDays * dailyRate;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");

  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (totalDays < 1) {
      setChecking(false);
      setAvailable(false);
      return;
    }

    const controller = new AbortController();

    async function checkAvailability() {
      setChecking(true);
      setAvailable(false);
      setError("");

      try {
        const response = await fetch(
          `/api/availability?start=${encodeURIComponent(
            startDate
          )}&end=${encodeURIComponent(endDate)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data: AvailabilityResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to check availability."
          );
        }

        setAvailable(Boolean(data.available));
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to check availability."
        );
      } finally {
        if (!controller.signal.aborted) {
          setChecking(false);
        }
      }
    }

    void checkAvailability();

    return () => controller.abort();
  }, [startDate, endDate, totalDays]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || checking || !available || totalDays < 1) {
      return;
    }

    setError("");

    if (paymentMethod === "online") {
      setError(
        "Use the PayPal button below to see your EUR total."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          start_date: startDate,
          end_date: endDate,
          payment_method: "cash",
        }),
      });

      const data: ReservationResponse = await response.json();

      if (!response.ok || !data.success || !data.reservationId) {
        throw new Error(
          data.message || "Unable to submit your booking request."
        );
      }

      router.push(
        `/reservation/success?id=${encodeURIComponent(
          String(data.reservationId)
        )}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your booking request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (totalDays < 1) {
    return (
      <main className="min-h-[70vh] bg-[#F3EFE7] px-5 py-28 text-[#49372D]">
        <div className="mx-auto max-w-xl rounded-[30px] bg-[#FFFDF8] p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black">
            Choose your rental dates first.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#6F7F73]">
            Select your start and end dates before continuing
            with your reservation.
          </p>

          <Link
            href="/date-availability"
            className="mt-8 inline-flex rounded-full bg-[#49372D] px-7 py-4 text-xs font-bold uppercase tracking-wider text-white"
          >
            Check availability →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3EFE7] px-5 pb-28 pt-20 text-[#49372D] md:px-10 md:pt-28 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <p className="vintage-label text-[#6F7F73]">
          Your next adventure
        </p>

        <h1 className="vintage-title retro-shadow mt-5 text-[58px] leading-[0.95] sm:text-[78px] md:text-[105px]">
          BOOK
          <br />
          YOUR RIDE.
        </h1>

        <p className="mt-6 max-w-xl text-sm font-medium leading-7 text-[#6F7F73]">
          Complete your details and choose how you would like
          to pay for your ECO KEPHYRA adventure.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-[30px] border border-[#49372D]/10 bg-[#FFFDF8] p-6 shadow-[0_20px_60px_rgba(73,55,45,0.07)] sm:p-9"
          >
            {/* CUSTOMER INFORMATION */}
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCE4C8] text-sm font-black">
                01
              </span>

              <h2 className="text-xl font-black tracking-tight">
                Your information
              </h2>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="customer-name"
                  className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em]"
                >
                  Full name
                </label>

                <input
                  id="customer-name"
                  type="text"
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-[#49372D]/15 bg-[#F3EFE7]/60 px-5 py-4 text-sm outline-none transition focus:border-[#6F7F73]"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-email"
                  className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em]"
                >
                  Email address
                </label>

                <input
                  id="customer-email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={customerEmail}
                  onChange={(event) =>
                    setCustomerEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-[#49372D]/15 bg-[#F3EFE7]/60 px-5 py-4 text-sm outline-none transition focus:border-[#6F7F73]"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em]"
                >
                  Phone / WhatsApp
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  required
                  maxLength={30}
                  autoComplete="tel"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  placeholder="+212 6..."
                  className="w-full rounded-2xl border border-[#49372D]/15 bg-[#F3EFE7]/60 px-5 py-4 text-sm outline-none transition focus:border-[#6F7F73]"
                />
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="mt-10 border-t border-[#49372D]/10 pt-8">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B9DCEF]/60 text-sm font-black">
                  02
                </span>

                <h2 className="text-xl font-black tracking-tight">
                  Payment method
                </h2>
              </div>

              <p className="mt-4 text-xs leading-6 text-[#6F7F73]">
                Choose the payment option that suits you.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                
                <label
                  className={`relative flex cursor-pointer flex-col rounded-[22px] border-2 p-5 transition ${
                    paymentMethod === "online"
                      ? "border-[#6F7F73] bg-[#DCE4C8]/35"
                      : "border-[#49372D]/10 bg-[#F3EFE7]/45 hover:border-[#6F7F73]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => {
                      setPaymentMethod("online");
                      setError("");
                    }}
                    className="sr-only"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B9DCEF]/60 text-xl">
                      💳
                    </span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        paymentMethod === "online"
                          ? "border-[#6F7F73]"
                          : "border-[#49372D]/30"
                      }`}
                    >
                      {paymentMethod === "online" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#6F7F73]" />
                      )}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-black">
                    PayPal
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#6F7F73]">
                    Pay the full rental amount securely in EUR with PayPal.
                  </p>

                  <span className="mt-4 self-start rounded-full bg-[#EAD9BC] px-3 py-1 text-[9px] font-black uppercase tracking-wider">
                    Secure checkout
                  </span>
                </label>

                {/* PAY CASH */}
                <label
                  className={`flex cursor-pointer flex-col rounded-[22px] border-2 p-5 transition ${
                    paymentMethod === "cash"
                      ? "border-[#6F7F73] bg-[#DCE4C8]/35"
                      : "border-[#49372D]/10 bg-[#F3EFE7]/45 hover:border-[#6F7F73]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => {
                      setPaymentMethod("cash");
                      setError("");
                    }}
                    className="sr-only"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DCE4C8] text-xl">
                      💬
                    </span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        paymentMethod === "cash"
                          ? "border-[#6F7F73]"
                          : "border-[#49372D]/30"
                      }`}
                    >
                      {paymentMethod === "cash" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#6F7F73]" />
                      )}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-black">
                    Pay Cash
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#6F7F73]">
                    Send your booking request via WhatsApp.
                    Pay when collecting your scooter.
                  </p>

                  <span className="mt-4 self-start rounded-full bg-[#DCE4C8] px-3 py-1 text-[9px] font-black uppercase tracking-wider">
                    Available now
                  </span>
                </label>
              </div>
            </div>

            {/* AVAILABILITY & ERRORS */}
            {checking && (
              <p className="mt-7 rounded-2xl bg-[#B9DCEF]/35 p-4 text-xs font-semibold">
                Checking live availability...
              </p>
            )}

            {!checking && !available && !error && (
              <p className="mt-7 rounded-2xl bg-[#EAD9BC]/55 p-4 text-xs font-semibold">
                These dates are no longer available. Please
                choose another period.
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-7 rounded-2xl bg-[#EAD9BC]/55 p-4 text-xs font-semibold"
              >
                {error}
              </p>
            )}

            {/* SUBMIT */}
            {paymentMethod === "online" ? (
              <PayPalCheckout booking={{ customer_name: customerName, customer_email: customerEmail, customer_phone: customerPhone, start_date: startDate, end_date: endDate }} disabled={checking || submitting || !available || totalDays < 1} />
            ) : (
              <>
                <button
                  type="submit"
                  disabled={checking || submitting || !available || totalDays < 1}
                  className="mt-8 flex w-full items-center justify-between rounded-full bg-[#49372D] px-7 py-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFFDF8] transition hover:bg-[#6F7F73] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{submitting ? "Submitting your request..." : "Continue to WhatsApp"}</span>
                  <span className="text-lg">↗</span>
                </button>
                <p className="mt-4 text-center text-[11px] leading-5 text-[#6F7F73]">
                  Your request will be saved first. You can then send your booking reference via WhatsApp.
                </p>
              </>
            )}
          </form>

          {/* BOOKING SUMMARY */}
          <aside className="rounded-[30px] border border-[#49372D]/10 bg-[#FFFDF8] p-6 shadow-[0_20px_60px_rgba(73,55,45,0.07)] sm:p-9">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6F7F73]">
              Your reservation
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight">
              THE RIDE
              <br />
              AWAITS.
            </h2>

            <div className="mt-8 space-y-5 border-y border-[#49372D]/10 py-7">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#6F7F73]">
                  Pick-up date
                </span>

                <span className="text-right text-sm font-bold">
                  {formatDate(startDate)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#6F7F73]">
                  Return date
                </span>

                <span className="text-right text-sm font-bold">
                  {formatDate(endDate)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#6F7F73]">
                  Rental period
                </span>

                <span className="text-sm font-bold">
                  {totalDays} {totalDays === 1 ? "day" : "days"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#6F7F73]">
                  Daily rate
                </span>

                <span className="text-sm font-bold">
                  {dailyRate} DH
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#6F7F73]">
                  Payment method
                </span>

                <span className="text-right text-sm font-bold">
                  {paymentMethod === "cash"
                    ? "Cash / WhatsApp"
                    : "Online payment"}
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6F7F73]">
                  Estimated total
                </p>

                <p className="mt-1 text-xs text-[#6F7F73]">
                  {paymentMethod === "cash"
                    ? "Pay on collection"
                    : "Pay online"}
                </p>
              </div>

              <p className="text-4xl font-black tracking-tight">
                {totalPrice}
                <span className="ml-1 text-base">DH</span>
              </p>
            </div>

            <Link
              href="/date-availability"
              className="mt-8 inline-flex text-xs font-bold text-[#6F7F73] underline underline-offset-4 transition hover:text-[#49372D]"
            >
              ← Change dates
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function ReservationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F3EFE7] px-5 py-28 text-center text-[#49372D]">
          Loading your reservation...
        </main>
      }
    >
      <ReservationForm />
    </Suspense>
  );
}
