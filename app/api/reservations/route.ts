
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string): boolean {
  if (!DATE_REGEX.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function getRentalDays(startDate: string, endDate: string): number {
  const start = Date.parse(`${startDate}T00:00:00.000Z`);
  const end = Date.parse(`${endDate}T00:00:00.000Z`);

  return Math.round((end - start) / 86400000) + 1;
}

function getNextDay(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
}

function getDailyPrice(days: number): number {
  if (days >= 30) return 120;
  if (days >= 7) return 155;
  if (days >= 5) return 170;
  if (days >= 3) return 180;

  return 200;
}

function getMoroccoToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Read customer information
    const customerName = String(body.customer_name ?? "").trim();
    const customerEmail = String(body.customer_email ?? "")
      .trim()
      .toLowerCase();
    const customerPhone = String(body.customer_phone ?? "").trim();

    const startDate = String(body.start_date ?? "").trim();
    const endDate = String(body.end_date ?? "").trim();
    const paymentMethod = String(body.payment_method ?? "").trim();

    // 2. Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (
      customerName.length > 120 ||
      customerEmail.length > 254 ||
      customerPhone.length > 30 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter valid contact information.",
        },
        { status: 400 }
      );
    }

    // This route currently handles Pay Cash only.
    if (paymentMethod !== "cash") {
      return NextResponse.json(
        {
          success: false,
          message: "Please select Pay Cash.",
        },
        { status: 400 }
      );
    }

    // 3. Validate rental dates
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select valid rental dates.",
        },
        { status: 400 }
      );
    }

    if (endDate < startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "The return date cannot be before the pick-up date.",
        },
        { status: 400 }
      );
    }

    if (startDate < getMoroccoToday()) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot book a past date.",
        },
        { status: 400 }
      );
    }

    const totalDays = getRentalDays(startDate, endDate);

    if (totalDays < 1 || totalDays > 366) {
      return NextResponse.json(
        {
          success: false,
          message: "Please choose a rental period of up to 366 days.",
        },
        { status: 400 }
      );
    }

    const { error: expiryError } = await supabaseAdmin.rpc("ec_paypal_expire");
    if (expiryError) throw new Error("Unable to release expired checkouts");

    // 4. Get the total number of scooters
    const { data: settings, error: settingsError } =
      await supabaseAdmin
        .from("settings")
        .select("total_scooters")
        .order("id", { ascending: true })
        .limit(1)
        .single();

    if (settingsError || !settings) {
      console.error("SUPABASE SETTINGS ERROR:", settingsError);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to load scooter availability.",
        },
        { status: 500 }
      );
    }

    const totalScooters = Number(settings.total_scooters);

    if (!Number.isInteger(totalScooters) || totalScooters < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Scooter capacity is not configured correctly.",
        },
        { status: 500 }
      );
    }

    // 5. Get reservations overlapping the selected dates
    const { data: existingReservations, error: reservationsError } =
      await supabaseAdmin
        .from("reservations")
        .select("start_date, end_date")
        .in("status", ["pending", "confirmed"])
        .lte("start_date", endDate)
        .gte("end_date", startDate)
        .limit(10000);

    if (reservationsError) {
      console.error(
        "SUPABASE AVAILABILITY ERROR:",
        reservationsError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Unable to check availability. Please try again.",
        },
        { status: 500 }
      );
    }

    if ((existingReservations ?? []).length === 10000) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to verify availability. Please contact us.",
        },
        { status: 503 }
      );
    }

    // 6. Check that every day has at least one free scooter
    for (
      let date = startDate;
      date <= endDate;
      date = getNextDay(date)
    ) {
      const bookedScooters = (existingReservations ?? []).filter(
        (reservation) =>
          reservation.start_date <= date &&
          reservation.end_date >= date
      ).length;

      if (bookedScooters >= totalScooters) {
        return NextResponse.json(
          {
            success: false,
            message: `No scooters are available on ${date}. Please select another rental period.`,
          },
          { status: 409 }
        );
      }
    }

    // 7. Calculate price on the server
    const dailyPrice = getDailyPrice(totalDays);
    const totalPrice = dailyPrice * totalDays;

    // 8. Save booking request in Supabase
    const { data: reservation, error: insertError } =
      await supabaseAdmin
        .from("reservations")
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          start_date: startDate,
          end_date: endDate,
          total_days: totalDays,
          total_price: totalPrice,
          status: "pending",
          payment_method: "cash",
          payment_status: "unpaid",
        })
        .select("id")
        .single();

    if (insertError?.message.includes("EC_CAPACITY")) return NextResponse.json({ success: false, message: "These dates have just sold out. Please select another period." }, { status: 409 });
    if (insertError || !reservation) {
      console.error("SUPABASE INSERT ERROR:", insertError);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to save your booking. Please try again.",
        },
        { status: 500 }
      );
    }

    // 9. Return the booking reference to the frontend
    return NextResponse.json(
      {
        success: true,
        reservationId: reservation.id,
        totalDays,
        dailyPrice,
        totalPrice,
        paymentMethod: "cash",
        status: "pending",
        message: "Your booking request has been received.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RESERVATION API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
