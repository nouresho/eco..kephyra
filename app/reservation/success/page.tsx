
"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const WHATSAPP_NUMBER = "212623201547";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("id");

  if (!reservationId || !/^\d+$/.test(reservationId)) {
    return (
      <main className="min-h-[75vh] bg-[#F3EFE7] px-5 py-28 text-[#49372D]">
        <div className="mx-auto max-w-xl rounded-[30px] bg-[#FFFDF8] p-8 text-center">
          <h1 className="text-3xl font-black">
            Booking reference not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#6F7F73]">
            Please submit your booking request first.
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

  const whatsappMessage = [
    "Hello ECO KEPHYRA!",
    "",
    "I have submitted a scooter rental request.",
    `Booking reference: #${reservationId}`,
    "Payment method: Cash",
    "",
    "Could you please confirm my reservation?",
    "Thank you!",
  ].join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <main className="min-h-screen bg-[#F3EFE7] px-5 pb-28 pt-20 text-[#49372D] md:px-10 md:pt-28 lg:px-14">
      <div className="mx-auto max-w-4xl">
        <p className="vintage-label text-[#6F7F73]">
          Your next adventure
        </p>

        <h1 className="vintage-title retro-shadow mt-5 text-[52px] leading-[0.95] sm:text-[76px] md:text-[100px]">
          ALMOST
          <br />
          READY.
        </h1>

        <div className="mt-12 overflow-hidden rounded-[34px] border border-[#49372D]/10 bg-[#FFFDF8] shadow-[0_25px_70px_rgba(73,55,45,0.10)]">
          <div className="border-b border-[#49372D]/10 bg-[#DCE4C8]/55 px-6 py-8 text-center sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFFDF8] text-3xl text-[#6F7F73] shadow-sm">
              ✓
            </div>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#6F7F73]">
              Booking request received
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Your ride is almost ready!
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#6F7F73]">
              Your booking request has been submitted.
              Contact ECO KEPHYRA on WhatsApp to confirm
              your reservation details.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="rounded-[22px] border border-[#49372D]/10 bg-[#F3EFE7] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6F7F73]">
                Your booking reference
              </p>

              <p className="mt-3 text-4xl font-black tracking-tight">
                #{reservationId}
              </p>

              <div className="mt-7 space-y-4 border-t border-[#49372D]/10 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#6F7F73]">
                    Payment method
                  </span>
                  <span className="text-sm font-bold">
                    Cash
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#6F7F73]">
                    Payment status
                  </span>
                  <span className="text-sm font-bold">
                    Unpaid
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#6F7F73]">
                    Reservation status
                  </span>
                  <span className="rounded-full bg-[#EAD9BC] px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                    Pending confirmation
                  </span>
                </div>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-between rounded-full bg-[#49372D] px-7 py-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFFDF8] transition hover:-translate-y-1 hover:bg-[#6F7F73]"
            >
              <span>Confirm via WhatsApp</span>
              <span className="text-lg">↗</span>
            </a>

            <p className="mt-4 text-center text-xs leading-6 text-[#6F7F73]">
              WhatsApp will open with your booking reference.
              Please press Send to contact our team.
            </p>

            <div className="mt-8 border-t border-[#49372D]/10 pt-7 text-center">
              <Link
                href="/"
                className="text-xs font-bold text-[#6F7F73] underline underline-offset-4 transition hover:text-[#49372D]"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F3EFE7] px-5 py-28 text-center text-[#49372D]">
          Loading your booking...
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
