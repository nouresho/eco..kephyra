"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

type AvailabilityResponse = {
  success: boolean;
  available?: boolean;
  totalScooters?: number;
  unavailableDates?: string[];
  availabilityByDate?: Record<string, number>;
  message?: string;
};

function createDate(year: number, month: number, day: number) {
  return new Date(year, month, day, 12, 0, 0, 0);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function todayKey() {
  return toDateKey(new Date());
}

function formatDate(date: Date | null) {
  if (!date) return "Not selected";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isSameDate(date1: Date | null, date2: Date | null) {
  if (!date1 || !date2) return false;

  return toDateKey(date1) === toDateKey(date2);
}

function getRentalDays(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) return 0;

  const start = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const end = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  return Math.max(0, Math.floor((end - start) / 86400000) + 1);
}

function isBetween(
  date: Date,
  startDate: Date | null,
  endDate: Date | null
) {
  if (!startDate || !endDate) return false;

  const key = toDateKey(date);

  return key > toDateKey(startDate) && key < toDateKey(endDate);
}

function nextDateKey(key: string) {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function rangeContainsUnavailable(
  start: Date,
  end: Date,
  unavailable: Set<string>
) {
  const endKey = toDateKey(end);

  for (
    let day = toDateKey(start);
    day <= endKey;
    day = nextDateKey(day)
  ) {
    if (unavailable.has(day)) return true;
  }

  return false;
}

function getMonthRange(year: number, month: number) {
  return {
    start: toDateKey(createDate(year, month, 1)),
    end: toDateKey(createDate(year, month + 1, 0)),
  };
}

export default function DateAvailabilityPage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [availabilityByDate, setAvailabilityByDate] = useState<
    Record<string, number>
  >({});

  const [loading, setLoading] = useState(true);
  const [checkingRange, setCheckingRange] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    "Select a start date on the calendar."
  );

  /* ---------- SWIPE STATE (mois) ---------- */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const unavailableSet = useMemo(
    () => new Set(unavailableDates),
    [unavailableDates]
  );

  const rentalDays = useMemo(
    () => getRentalDays(startDate, endDate),
    [startDate, endDate]
  );

  const calendarDays = useMemo(() => {
    const firstDay = createDate(currentYear, currentMonthIndex, 1);

    const daysInMonth = new Date(
      currentYear,
      currentMonthIndex + 1,
      0
    ).getDate();

    const offset = (firstDay.getDay() + 6) % 7;
    const cells: (Date | null)[] = [];

    for (let i = 0; i < offset; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(createDate(currentYear, currentMonthIndex, day));
    }

    return cells;
  }, [currentYear, currentMonthIndex]);

  const fetchAvailability = useCallback(async () => {
    const { start, end } = getMonthRange(
      currentYear,
      currentMonthIndex
    );

    setLoading(true);
    setError("");
    setUnavailableDates([]);
    setAvailabilityByDate({});

    try {
      const response = await fetch(
        `/api/availability?start=${start}&end=${end}`,
        { cache: "no-store" }
      );

      const data: AvailabilityResponse = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !Array.isArray(data.unavailableDates) ||
        !data.availabilityByDate
      ) {
        throw new Error(
          data.message || "Unable to load availability."
        );
      }

      setUnavailableDates(data.unavailableDates);
      setAvailabilityByDate(data.availabilityByDate);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load availability. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonthIndex]);

  useEffect(() => {
    void fetchAvailability();
  }, [fetchAvailability]);

  const previousMonth = () => {
    const now = new Date();
    const firstCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    if (currentMonth <= firstCurrentMonth) return;

    setCurrentMonth(
      new Date(currentYear, currentMonthIndex - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentYear, currentMonthIndex + 1, 1)
    );
  };

  /* ================================================= */
  /* SWIPE HANDLERS */
  /* ================================================= */

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // wach swipe horizontal wla scroll vertical
    if (
      isHorizontalSwipe.current === null &&
      (Math.abs(dx) > 8 || Math.abs(dy) > 8)
    ) {
      isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
    }

    if (isHorizontalSwipe.current) {
      // 0.5 = l calendrier kaytbe3 sba3ek b chwiya dyal résistance
      setDragX(dx * 0.5);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current && Math.abs(dragX) > 30) {
      if (dragX < 0) nextMonth();
      else previousMonth();
    }

    setDragX(0);
    setIsDragging(false);
    isHorizontalSwipe.current = null;
  };

  const handleDateClick = async (date: Date) => {
    if (loading || checkingRange || error) return;

    const key = toDateKey(date);

    if (key < todayKey() || unavailableSet.has(key)) return;

    if (!startDate || endDate) {
      setStartDate(date);
      setEndDate(null);
      setMessage("Now select your end date.");
      return;
    }

    if (key < toDateKey(startDate)) {
      setStartDate(date);
      setEndDate(null);
      setMessage("Now select your end date.");
      return;
    }

    if (isSameDate(date, startDate)) {
      setEndDate(date);
      setMessage("Your rental period is ready.");
      return;
    }

    if (rangeContainsUnavailable(startDate, date, unavailableSet)) {
      setMessage(
        "This period includes fully booked dates. Please choose another range."
      );
      return;
    }

    // Check the COMPLETE selected period, including dates in other months.
    setCheckingRange(true);
    setMessage("Checking your selected dates...");

    try {
      const start = toDateKey(startDate);
      const end = toDateKey(date);

      const response = await fetch(
        `/api/availability?start=${start}&end=${end}`,
        { cache: "no-store" }
      );

      const data: AvailabilityResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to check your selected dates."
        );
      }

      if (!data.available || (data.unavailableDates?.length ?? 0) > 0) {
        setMessage(
          "Some dates in this period are fully booked. Please choose another range."
        );

        // Refresh current month to display any newly booked dates.
        await fetchAvailability();
        return;
      }

      setEndDate(date);
      setMessage("Your rental period is ready.");
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Unable to check these dates. Please try again."
      );
    } finally {
      setCheckingRange(false);
    }
  };

  const canContinue =
    !!startDate &&
    !!endDate &&
    rentalDays > 0 &&
    !loading &&
    !checkingRange &&
    !error &&
    !rangeContainsUnavailable(startDate, endDate, unavailableSet);

  return (
    <main className="overflow-hidden bg-[#F3EFE7] text-[#49372D]">
      {/* HERO */}
      <section className="px-5 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <p className="vintage-label text-[#6F7F73]">
            Plan your ride
          </p>

          <div className="mt-5 grid items-end gap-8 lg:grid-cols-[1fr_0.55fr]">
            <h1 className="vintage-title retro-shadow text-[58px] text-[#49372D] sm:text-[78px] md:text-[105px]">
              CHECK
              <br />
              YOUR DATES.
            </h1>

            <p className="max-w-md text-sm font-medium leading-7 text-[#6F7F73] md:pb-2 md:text-base">
              Choose your rental period, explore live availability,
              and plan your next ride with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* CALENDAR */}
      <section className="px-5 pb-28 md:px-10 md:pb-36 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[34px] border border-[#49372D]/15 bg-[#FFFDF8] shadow-[0_25px_70px_rgba(73,55,45,0.10)]">
            <div className="p-5 sm:p-8 md:p-10 lg:p-12">
              {/* TOP LABEL */}
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#6F7F73]">
                    ECO KEPHYRA
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#49372D]">
                    Find your perfect rental dates
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#6F7F73]/20 bg-[#DCE4C8]/45 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#6F7F73]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#49372D]">
                    Live availability
                  </span>
                </div>
              </div>

              {/* MONTH HEADER */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={previousMonth}
                  disabled={
                    currentYear === new Date().getFullYear() &&
                    currentMonthIndex === new Date().getMonth()
                  }
                  aria-label="Previous month"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAD9BC] text-xl font-bold text-[#49372D] transition-all duration-300 hover:-translate-x-1 hover:bg-[#DCE4C8] disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-14"
                >
                  ←
                </button>

                <h2 className="text-center text-[25px] font-black tracking-[-0.045em] text-[#49372D] sm:text-[34px] md:text-[42px]">
                  {MONTHS[currentMonthIndex]} {currentYear}
                </h2>

                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Next month"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAD9BC] text-xl font-bold text-[#49372D] transition-all duration-300 hover:translate-x-1 hover:bg-[#DCE4C8] sm:h-14 sm:w-14"
                >
                  →
                </button>
              </div>

              {/* LOADING / ERROR */}
              {loading && (
                <div
                  role="status"
                  className="mt-6 rounded-2xl bg-[#B9DCEF]/30 px-5 py-3 text-center text-xs font-semibold text-[#49372D]"
                >
                  Loading live availability...
                </div>
              )}

              {error && !loading && (
                <div
                  role="alert"
                  className="mt-6 rounded-2xl border border-[#6B4935]/20 bg-[#EAD9BC]/45 p-4"
                >
                  <p className="text-center text-xs font-semibold text-[#49372D]">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => void fetchAvailability()}
                    className="mx-auto mt-3 block rounded-full bg-[#49372D] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#FFFDF8] transition hover:bg-[#6F7F73]"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* SWIPE AREA: jours + dates */}
              <div
                className="touch-pan-y select-none transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(${dragX}px)`,
                  transition: isDragging ? "none" : undefined,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                {/* WEEK DAYS */}
                <div className="mt-10 grid grid-cols-7 gap-1.5 sm:gap-2.5">
                  {WEEK_DAYS.map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-[7px] font-black tracking-[0.08em] text-[#49372D]/55 sm:text-[9px] sm:tracking-[0.15em]"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* DAYS */}
                <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2.5">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square"
                        />
                      );
                    }

                    const dateKey = toDateKey(date);
                    const past = dateKey < todayKey();
                    const fullyBooked = unavailableSet.has(dateKey);
                    const unavailable = past || fullyBooked;
                    const disabled =
                      unavailable || loading || checkingRange || !!error;

                    const selectedStart = isSameDate(date, startDate);
                    const selectedEnd = isSameDate(date, endDate);
                    const selected = selectedStart || selectedEnd;
                    const inRange = isBetween(
                      date,
                      startDate,
                      endDate
                    );

                    const remaining = availabilityByDate[dateKey];

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        disabled={disabled}
                        onClick={() => void handleDateClick(date)}
                        aria-label={`${formatDate(date)} ${
                          past
                            ? "past date"
                            : fullyBooked
                              ? "fully booked"
                              : selected
                                ? "selected"
                                : "available"
                        }`}
                        title={
                          past
                            ? "Past date"
                            : fullyBooked
                              ? "Fully booked"
                              : remaining !== undefined
                                ? `${remaining} scooter(s) available`
                                : "Availability loading"
                        }
                        className={`
                          relative flex aspect-square min-w-0
                          items-center justify-center rounded-[10px]
                          text-[11px] font-bold transition-all
                          duration-200 sm:rounded-[15px]
                          sm:text-[14px] md:rounded-[18px]
                          md:text-[16px]
                          ${
                            unavailable
                              ? "cursor-not-allowed bg-[#E5E3DF] text-[#49372D]/30"
                              : selected
                                ? "z-10 bg-[#49372D] text-[#FFFDF8] shadow-[0_8px_20px_rgba(73,55,45,0.20)]"
                                : inRange
                                  ? "bg-[#DCE4C8] text-[#49372D]"
                                  : "bg-[#F3EFE7] text-[#49372D] hover:-translate-y-1 hover:bg-[#EAD9BC]"
                          }
                          ${
                            disabled && !unavailable
                              ? "cursor-wait opacity-55"
                              : ""
                          }
                        `}
                      >
                        <span
                          className={
                            unavailable
                              ? "line-through decoration-[#6B4935]/65 decoration-2"
                              : ""
                          }
                        >
                          {date.getDate()}
                        </span>

                        {selected && !unavailable && (
                          <span className="absolute bottom-[6px] h-1 w-1 rounded-full bg-[#B9DCEF]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LEGEND */}
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#49372D]/10 pt-6">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[3px] bg-[#F3EFE7]" />
                  <span className="text-[10px] font-semibold text-[#49372D]/55">
                    Available
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[3px] bg-[#49372D]" />
                  <span className="text-[10px] font-semibold text-[#49372D]/55">
                    Selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[3px] bg-[#DCE4C8]" />
                  <span className="text-[10px] font-semibold text-[#49372D]/55">
                    Your range
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 items-center justify-center rounded-[3px] bg-[#E5E3DF] text-[9px] font-black leading-none text-[#49372D]/50">
                    /
                  </span>
                  <span className="text-[10px] font-semibold text-[#49372D]/55">
                    Fully booked / past
                  </span>
                </div>
              </div>

              {/* YOUR DATES */}
              <div className="mt-8 rounded-[24px] border border-[#49372D]/10 bg-[#F3EFE7] p-5 sm:p-7">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#49372D]">
                  Your dates
                </p>

                {!startDate && (
                  <p className="mt-4 text-[16px] font-medium leading-7 text-[#6F7F73] sm:text-[18px]">
                    Select a start date on the calendar.
                  </p>
                )}

                {startDate && !endDate && (
                  <div className="mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6F7F73]">
                      Start
                    </p>
                    <p className="mt-2 text-[22px] font-black tracking-[-0.035em] text-[#49372D]">
                      {formatDate(startDate)}
                    </p>
                    <p className="mt-4 text-[13px] font-medium text-[#6F7F73]">
                      Now choose your end date.
                    </p>
                  </div>
                )}

                {startDate && endDate && (
                  <div className="mt-5">
                    <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#6F7F73]">
                          Start
                        </p>
                        <p className="mt-2 text-[18px] font-black tracking-[-0.03em] text-[#49372D] sm:text-[21px]">
                          {formatDate(startDate)}
                        </p>
                      </div>

                      <span className="hidden text-[#49372D]/30 sm:block">
                        →
                      </span>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#6F7F73]">
                          End
                        </p>
                        <p className="mt-2 text-[18px] font-black tracking-[-0.03em] text-[#49372D] sm:text-[21px]">
                          {formatDate(endDate)}
                        </p>
                      </div>

                      <div className="flex min-h-[76px] items-center justify-center rounded-[18px] bg-[#DCE4C8] px-6 text-center">
                        <div>
                          <p className="text-[27px] font-black leading-none text-[#49372D]">
                            {rentalDays}
                          </p>
                          <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.13em] text-[#6F7F73]">
                            {rentalDays === 1 ? "Day" : "Days"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {startDate && (
                  <div className="mt-6 border-t border-[#49372D]/10 pt-5">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-[6px] h-2 w-2 shrink-0 rounded-full ${
                          startDate && endDate
                            ? "bg-[#6F7F73]"
                            : "bg-[#EAD9BC]"
                        }`}
                      />
                      <p
                        aria-live="polite"
                        className="text-[11px] font-medium leading-5 text-[#6F7F73]"
                      >
                        {message}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CONTINUE */}
              {canContinue && (
                <div className="mt-7">
                  <Link
                    href={`/reservation?start=${toDateKey(
                      startDate
                    )}&end=${toDateKey(
                      endDate
                    )}&days=${rentalDays}`}
                    className="flex w-full items-center justify-between rounded-full bg-[#49372D] px-7 py-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#F5F1E8] transition-all duration-300 hover:-translate-y-1 hover:bg-[#6F7F73]"
                  >
                    <span>Continue to booking</span>
                    <span className="text-base">↗</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-[10px] font-medium leading-5 text-[#6F7F73]/70">
            Availability is checked live. Your booking is only
            secured after the reservation is successfully submitted.
          </p>
        </div>
      </section>
    </main>
  );
}