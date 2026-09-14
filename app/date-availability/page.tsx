"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const quickDurations = [1, 3, 5, 7];

function formatDate(date: Date | null) {
  if (!date) return "Select date";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toInputDate(date: Date | null) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseInputDate(value: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);

  return newDate;
}

function getRentalDays(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) return 0;

  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );

  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );

  const difference = end.getTime() - start.getTime();

  if (difference < 0) return 0;

  return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
}

export default function DateAvailabilityPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [checked, setChecked] = useState(false);

  const rentalDays = useMemo(
    () => getRentalDays(startDate, endDate),
    [startDate, endDate],
  );

  const today = toInputDate(new Date());

  const handleStartDate = (value: string) => {
    const date = parseInputDate(value);

    setStartDate(date);
    setChecked(false);

    if (date && endDate && endDate < date) {
      setEndDate(null);
    }
  };

  const handleEndDate = (value: string) => {
    const date = parseInputDate(value);

    setEndDate(date);
    setChecked(false);
  };

  const handleQuickSelect = (days: number) => {
    let start = startDate;

    if (!start) {
      start = new Date();
      setStartDate(start);
    }

    const end = addDays(start, days - 1);

    setEndDate(end);
    setChecked(false);
  };

  const handleCheckAvailability = () => {
    if (!startDate || !endDate || rentalDays <= 0) return;

    setChecked(true);
  };

  return (
    <main className="overflow-hidden bg-[#F7F5EF] text-[#183B48]">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#69BFE3]">
                Plan your ride
              </p>

              <h1 className="max-w-4xl text-[58px] font-semibold leading-[0.88] tracking-[-0.06em] text-[#183B48] sm:text-[78px] md:text-[100px] lg:text-[118px]">
                CHECK
                <br />
                YOUR DATES.
              </h1>
            </div>

            <div className="max-w-md lg:pb-3">
              <p className="text-sm font-medium leading-7 text-[#183B48]/65 md:text-base">
                Choose your rental period and see how many days you&apos;ve
                selected before continuing with your reservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* DATE SELECTION */}
      {/* ================================================= */}

      <section className="px-5 pb-28 md:px-10 md:pb-36 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[32px] border border-[#183B48]/10 bg-white shadow-[0_30px_80px_rgba(24,59,72,0.08)]">
            <div className="grid lg:grid-cols-[1fr_0.42fr]">
              {/* LEFT */}

              <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="mb-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#69BFE3]">
                    Rental period
                  </p>

                  <h2 className="mt-3 text-[34px] font-semibold tracking-[-0.045em] text-[#183B48] md:text-[44px]">
                    Choose your dates
                  </h2>
                </div>

                {/* DATE INPUTS */}

                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  {/* START */}

                  <label className="group block">
                    <span className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#183B48]/45">
                      Start date
                    </span>

                    <div className="rounded-[22px] border border-[#183B48]/10 bg-[#F7F5EF] p-5 transition-all duration-300 focus-within:border-[#69BFE3] focus-within:bg-white focus-within:shadow-[0_12px_30px_rgba(105,191,227,0.12)]">
                      <input
                        type="date"
                        value={toInputDate(startDate)}
                        min={today}
                        onChange={(event) =>
                          handleStartDate(event.target.value)
                        }
                        className="w-full cursor-pointer bg-transparent text-[15px] font-semibold text-[#183B48] outline-none"
                      />

                      <p className="mt-2 text-[11px] text-[#183B48]/45">
                        {formatDate(startDate)}
                      </p>
                    </div>
                  </label>

                  {/* ARROW */}

                  <div className="hidden pt-6 text-[#183B48]/25 md:block">
                    →
                  </div>

                  {/* END */}

                  <label className="group block">
                    <span className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#183B48]/45">
                      End date
                    </span>

                    <div className="rounded-[22px] border border-[#183B48]/10 bg-[#F7F5EF] p-5 transition-all duration-300 focus-within:border-[#69BFE3] focus-within:bg-white focus-within:shadow-[0_12px_30px_rgba(105,191,227,0.12)]">
                      <input
                        type="date"
                        value={toInputDate(endDate)}
                        min={startDate ? toInputDate(startDate) : today}
                        disabled={!startDate}
                        onChange={(event) =>
                          handleEndDate(event.target.value)
                        }
                        className="w-full cursor-pointer bg-transparent text-[15px] font-semibold text-[#183B48] outline-none disabled:cursor-not-allowed disabled:opacity-35"
                      />

                      <p className="mt-2 text-[11px] text-[#183B48]/45">
                        {formatDate(endDate)}
                      </p>
                    </div>
                  </label>
                </div>

                {/* QUICK SELECT */}

                <div className="mt-10 border-t border-[#183B48]/10 pt-8">
                  <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#183B48]/45">
                    Quick select
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {quickDurations.map((days) => {
                      const active = rentalDays === days;

                      return (
                        <button
                          key={days}
                          type="button"
                          onClick={() => handleQuickSelect(days)}
                          className={`rounded-full border px-5 py-3 text-[11px] font-semibold transition-all duration-300 ${
                            active
                              ? "border-[#183B48] bg-[#183B48] text-white"
                              : "border-[#183B48]/12 bg-[#F7F5EF] text-[#183B48] hover:border-[#69BFE3] hover:bg-[#69BFE3] hover:text-[#183B48]"
                          }`}
                        >
                          {days} {days === 1 ? "day" : "days"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* MOBILE RESULT */}

                {rentalDays > 0 && (
                  <div className="mt-8 rounded-[22px] bg-[#DCE4C8] p-5 lg:hidden">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#183B48]/50">
                      Your selection
                    </p>

                    <div className="mt-3 flex items-end justify-between gap-5">
                      <div>
                        <p className="text-[22px] font-semibold tracking-[-0.04em]">
                          {rentalDays}{" "}
                          {rentalDays === 1 ? "day" : "days"}
                        </p>

                        <p className="mt-1 text-[11px] text-[#183B48]/55">
                          {formatDate(startDate)} → {formatDate(endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SUMMARY */}

              <aside className="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-[#183B48] p-7 text-[#F7F5EF] sm:p-8 lg:p-10">
                <div className="absolute -right-20 -top-20 h-[230px] w-[230px] rounded-full border border-white/10" />
                <div className="absolute -right-10 -top-10 h-[140px] w-[140px] rounded-full border border-white/10" />

                <div className="relative z-10">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#69BFE3]">
                    Your rental
                  </p>

                  {rentalDays > 0 ? (
                    <>
                      <p className="mt-6 text-[62px] font-semibold leading-none tracking-[-0.06em] md:text-[74px]">
                        {String(rentalDays).padStart(2, "0")}
                      </p>

                      <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.12em] text-white/55">
                        {rentalDays === 1 ? "Day selected" : "Days selected"}
                      </p>

                      <div className="mt-8 border-t border-white/10 pt-6">
                        <p className="text-[11px] leading-6 text-white/55">
                          {formatDate(startDate)}
                        </p>

                        <div className="my-2 h-8 w-px bg-[#69BFE3]/50" />

                        <p className="text-[11px] leading-6 text-white/55">
                          {formatDate(endDate)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="mt-8">
                      <p className="max-w-[240px] text-[30px] font-semibold leading-[1.05] tracking-[-0.045em]">
                        Pick your start and end dates.
                      </p>

                      <p className="mt-5 max-w-[250px] text-[12px] leading-6 text-white/50">
                        The number of rental days will be calculated
                        automatically.
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative z-10 mt-10">
                  <button
                    type="button"
                    disabled={!startDate || !endDate}
                    onClick={handleCheckAvailability}
                    className="flex w-full items-center justify-between rounded-full bg-[#69BFE3] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#183B48] transition-all duration-300 hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
                  >
                    <span>Check availability</span>

                    <span>↗</span>
                  </button>
                </div>
              </aside>
            </div>
          </div>

          {/* ================================================= */}
          {/* RESULT */}
          {/* ================================================= */}

          {checked && startDate && endDate && (
            <div className="mt-8 rounded-[30px] border border-[#183B48]/10 bg-[#DCE4C8] p-6 sm:p-8 md:p-10">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#6F7F73]" />

                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6F7F73]">
                      Rental period selected
                    </p>
                  </div>

                  <h3 className="mt-4 text-[32px] font-semibold tracking-[-0.045em] text-[#183B48] md:text-[42px]">
                    {rentalDays} {rentalDays === 1 ? "day" : "days"}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#183B48]/55">
                    {formatDate(startDate)} → {formatDate(endDate)}
                  </p>
                </div>

                <Link
                  href={`/reservation?start=${toInputDate(
                    startDate,
                  )}&end=${toInputDate(endDate)}&days=${rentalDays}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#183B48] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#69BFE3] hover:text-[#183B48]"
                >
                  Continue to booking
                  <span>↗</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}