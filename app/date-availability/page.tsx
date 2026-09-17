"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/* ================================================= */
/* TEMPORARY UNAVAILABLE DATES
/* Later these dates will come from your database/API.
/* ================================================= */

const unavailableDates = [
  "2026-09-01",
  "2026-09-02",
  "2026-09-03",
  "2026-09-04",
  "2026-09-05",
  "2026-09-06",
];

/* ================================================= */
/* HELPERS */
/* ================================================= */

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

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createDate(year: number, month: number, day: number) {
  return new Date(year, month, day, 12, 0, 0, 0);
}

function isSameDate(date1: Date | null, date2: Date | null) {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0
  );
}

function formatDate(date: Date | null) {
  if (!date) return "Not selected";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
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

  const difference = end - start;

  if (difference < 0) return 0;

  return Math.floor(difference / 86400000) + 1;
}

function isBetween(
  date: Date,
  startDate: Date | null,
  endDate: Date | null
) {
  if (!startDate || !endDate) return false;

  const current = startOfDay(date).getTime();
  const start = startOfDay(startDate).getTime();
  const end = startOfDay(endDate).getTime();

  return current > start && current < end;
}

function rangeContainsUnavailable(
  startDate: Date,
  endDate: Date,
  unavailable: Set<string>
) {
  const current = startOfDay(startDate);
  const end = startOfDay(endDate);

  while (current <= end) {
    if (unavailable.has(toDateKey(current))) {
      return true;
    }

    current.setDate(current.getDate() + 1);
  }

  return false;
}

/* ================================================= */
/* PAGE */
/* ================================================= */

export default function DateAvailabilityPage() {
  /*
   * Demo starts on September 2026 to match your reference.
   * Later you can change this to:
   *
   * const now = new Date();
   * useState(now.getFullYear());
   * useState(now.getMonth());
   */

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [message, setMessage] = useState(
    "Select a start date on the calendar."
  );

  const unavailableSet = useMemo(
    () => new Set(unavailableDates),
    []
  );

  const rentalDays = useMemo(
    () => getRentalDays(startDate, endDate),
    [startDate, endDate]
  );

  /* ================================================= */
  /* CALENDAR DAYS */
  /* ================================================= */

  const calendarDays = useMemo(() => {
    const firstDay = createDate(currentYear, currentMonth, 1);

    const daysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    /*
     * JS:
     * Sunday = 0
     * Monday = 1
     *
     * We want Monday first:
     * Monday = 0 ... Sunday = 6
     */
    const offset = (firstDay.getDay() + 6) % 7;

    const cells: (Date | null)[] = [];

    for (let i = 0; i < offset; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(createDate(currentYear, currentMonth, day));
    }

    return cells;
  }, [currentYear, currentMonth]);

  /* ================================================= */
  /* MONTH NAVIGATION */
  /* ================================================= */

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  };

  /* ================================================= */
  /* DATE SELECTION */
  /* ================================================= */

  const handleDateClick = (date: Date) => {
    const key = toDateKey(date);

    if (unavailableSet.has(key)) {
      return;
    }

    /*
     * No start OR range already completed:
     * start a new selection.
     */
    if (!startDate || endDate) {
      setStartDate(date);
      setEndDate(null);

      setMessage("Now select your end date.");

      return;
    }

    /*
     * Clicking before current start:
     * make it the new start.
     */
    if (date < startDate) {
      setStartDate(date);
      setEndDate(null);

      setMessage("Now select your end date.");

      return;
    }

    /*
     * Same start/end date = 1 day rental.
     */
    if (isSameDate(date, startDate)) {
      setEndDate(date);

      setMessage("Your rental period is ready.");

      return;
    }

    /*
     * Do not allow a range crossing unavailable dates.
     */
    if (
      rangeContainsUnavailable(
        startDate,
        date,
        unavailableSet
      )
    ) {
      setMessage(
        "This period includes unavailable dates. Please choose another range."
      );

      return;
    }

    setEndDate(date);

    setMessage("Your rental period is ready.");
  };

  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <main className="overflow-hidden bg-[#F3EFE7] text-[#49372D]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

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
              Choose your rental period and check which dates
              are available before continuing with your booking.
            </p>

          </div>
        </div>
      </section>


      {/* ================================================= */}
      {/* CALENDAR */}
      {/* ================================================= */}

      <section className="px-5 pb-28 md:px-10 md:pb-36 lg:px-14">
        <div className="mx-auto max-w-5xl">

          <div
            className="
              overflow-hidden
              rounded-[34px]
              border
              border-[#49372D]/15
              bg-[#FFFDF8]
              shadow-[0_25px_70px_rgba(73,55,45,0.10)]
            "
          >
            <div className="p-5 sm:p-8 md:p-10 lg:p-12">

              {/* ================================================= */}
              {/* MONTH HEADER */}
              {/* ================================================= */}

              <div className="flex items-center justify-between gap-4">

                {/* PREVIOUS */}
                <button
                  type="button"
                  onClick={previousMonth}
                  aria-label="Previous month"
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#EAD9BC]
                    text-xl
                    font-bold
                    text-[#49372D]
                    transition-all
                    duration-300
                    hover:-translate-x-1
                    hover:bg-[#DCE4C8]
                    sm:h-14
                    sm:w-14
                  "
                >
                  ←
                </button>


                {/* MONTH */}
                <h2
                  className="
                    text-center
                    text-[25px]
                    font-black
                    tracking-[-0.045em]
                    text-[#49372D]
                    sm:text-[34px]
                    md:text-[42px]
                  "
                >
                  {MONTHS[currentMonth]} {currentYear}
                </h2>


                {/* NEXT */}
                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Next month"
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#EAD9BC]
                    text-xl
                    font-bold
                    text-[#49372D]
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:bg-[#DCE4C8]
                    sm:h-14
                    sm:w-14
                  "
                >
                  →
                </button>

              </div>


              {/* ================================================= */}
              {/* WEEK DAYS */}
              {/* ================================================= */}

              <div className="mt-10 grid grid-cols-7 gap-1.5 sm:gap-2.5">

                {WEEK_DAYS.map((day) => (
                  <div
                    key={day}
                    className="
                      py-2
                      text-center
                      text-[7px]
                      font-black
                      tracking-[0.08em]
                      text-[#49372D]/55
                      sm:text-[9px]
                      sm:tracking-[0.15em]
                    "
                  >
                    {day}
                  </div>
                ))}

              </div>


              {/* ================================================= */}
              {/* DAYS */}
              {/* ================================================= */}

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

                  const unavailable =
                    unavailableSet.has(dateKey);

                  const selectedStart =
                    isSameDate(date, startDate);

                  const selectedEnd =
                    isSameDate(date, endDate);

                  const selected =
                    selectedStart || selectedEnd;

                  const inRange =
                    isBetween(date, startDate, endDate);

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      disabled={unavailable}
                      onClick={() => handleDateClick(date)}
                      aria-label={`${formatDate(date)}${
                        unavailable
                          ? " unavailable"
                          : selected
                            ? " selected"
                            : " available"
                      }`}
                      className={`
                        relative
                        flex
                        aspect-square
                        min-w-0
                        items-center
                        justify-center
                        rounded-[10px]
                        text-[11px]
                        font-bold
                        transition-all
                        duration-200
                        sm:rounded-[15px]
                        sm:text-[14px]
                        md:rounded-[18px]
                        md:text-[16px]

                        ${
                          unavailable
                            ? `
                              cursor-not-allowed
                              bg-[#E5E3DF]
                              text-[#49372D]/25
                            `
                            : selected
                              ? `
                                z-10
                                bg-[#49372D]
                                text-[#FFFDF8]
                                shadow-[0_8px_20px_rgba(73,55,45,0.20)]
                              `
                              : inRange
                                ? `
                                  bg-[#DCE4C8]
                                  text-[#49372D]
                                `
                                : `
                                  bg-[#F3EFE7]
                                  text-[#49372D]
                                  hover:-translate-y-1
                                  hover:bg-[#EAD9BC]
                                `
                        }
                      `}
                    >
                      {date.getDate()}

                      {/* START / END DOT */}
                      {selected && (
                        <span
                          className="
                            absolute
                            bottom-[6px]
                            h-1
                            w-1
                            rounded-full
                            bg-[#B9DCEF]
                          "
                        />
                      )}
                    </button>
                  );
                })}

              </div>


              {/* ================================================= */}
              {/* LEGEND */}
              {/* ================================================= */}

              <div
                className="
                  mt-9
                  flex
                  flex-wrap
                  items-center
                  gap-x-6
                  gap-y-3
                  border-t
                  border-[#49372D]/10
                  pt-6
                "
              >

                {/* AVAILABLE */}
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[3px] bg-[#F3EFE7]" />

                  <span className="text-[10px] font-semibold text-[#49372D]/55">
                    Available
                  </span>
                </div>


                {/* SELECTED */}
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[3px] bg-[#49372D]" />

                  <span className="text-[10px] font-semibold text-[#49372D]/55">
                    Selected
                  </span>
                </div>


                {/* RANGE */}
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[3px] bg-[#DCE4C8]" />

                  <span className="text-[10px] font-semibold text-[#49372D]/55">
                    Your range
                  </span>
                </div>


                {/* UNAVAILABLE */}
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[3px] bg-[#E5E3DF]" />

                  <span className="text-[10px] font-semibold text-[#49372D]/55">
                    Unavailable
                  </span>
                </div>

              </div>


              {/* ================================================= */}
              {/* YOUR DATES */}
              {/* ================================================= */}

              <div
                className="
                  mt-8
                  rounded-[24px]
                  border
                  border-[#49372D]/10
                  bg-[#F3EFE7]
                  p-5
                  sm:p-7
                "
              >

                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#49372D]">
                  Your dates
                </p>


                {/* NO DATE */}
                {!startDate && (
                  <p className="mt-4 text-[16px] font-medium leading-7 text-[#6F7F73] sm:text-[18px]">
                    Select a start date on the calendar.
                  </p>
                )}


                {/* START ONLY */}
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


                {/* COMPLETE RANGE */}
                {startDate && endDate && (
                  <div className="mt-5">

                    <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center">

                      {/* START */}
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


                      {/* END */}
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#6F7F73]">
                          End
                        </p>

                        <p className="mt-2 text-[18px] font-black tracking-[-0.03em] text-[#49372D] sm:text-[21px]">
                          {formatDate(endDate)}
                        </p>
                      </div>


                      {/* DAYS */}
                      <div
                        className="
                          flex
                          min-h-[76px]
                          items-center
                          justify-center
                          rounded-[18px]
                          bg-[#DCE4C8]
                          px-6
                          text-center
                        "
                      >
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


                {/* STATUS MESSAGE */}
                {startDate && (
                  <div className="mt-6 border-t border-[#49372D]/10 pt-5">

                    <div className="flex items-start gap-3">

                      <span
                        className={`
                          mt-[6px]
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          ${
                            startDate && endDate
                              ? "bg-[#6F7F73]"
                              : "bg-[#EAD9BC]"
                          }
                        `}
                      />

                      <p className="text-[11px] font-medium leading-5 text-[#6F7F73]">
                        {message}
                      </p>

                    </div>

                  </div>
                )}

              </div>


              {/* ================================================= */}
              {/* CONTINUE */}
              {/* ================================================= */}

              {startDate && endDate && rentalDays > 0 && (
                <div className="mt-7">

                  <Link
                    href={`/reservation?start=${toDateKey(
                      startDate
                    )}&end=${toDateKey(
                      endDate
                    )}&days=${rentalDays}`}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-full
                      bg-[#49372D]
                      px-7
                      py-5
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.13em]
                      text-[#F5F1E8]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-[#6F7F73]
                    "
                  >
                    <span>Continue to booking</span>

                    <span className="text-base">
                      ↗
                    </span>
                  </Link>

                </div>
              )}

            </div>
          </div>


          {/* ================================================= */}
          {/* SMALL NOTE */}
          {/* ================================================= */}

          <p className="mx-auto mt-6 max-w-xl text-center text-[10px] font-medium leading-5 text-[#6F7F73]/70">
            Availability shown here is currently for demonstration.
            Live availability will be connected to the booking system.
          </p>

        </div>
      </section>

    </main>
  );
}