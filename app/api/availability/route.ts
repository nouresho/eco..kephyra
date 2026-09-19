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

function nextDay(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    // 1. Validate dates
    if (
      !startDate ||
      !endDate ||
      !isValidDate(startDate) ||
      !isValidDate(endDate)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid start and end dates are required.",
        },
        { status: 400 }
      );
    }

    if (endDate < startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "End date cannot be before start date.",
        },
        { status: 400 }
      );
    }

    const totalDays =
      Math.round(
        (Date.parse(`${endDate}T00:00:00.000Z`) -
          Date.parse(`${startDate}T00:00:00.000Z`)) /
          86400000
      ) + 1;

    if (totalDays > 366) {
      return NextResponse.json(
        {
          success: false,
          message: "Date range cannot exceed 366 days.",
        },
        { status: 400 }
      );
    }

    // 2. Get scooter capacity
    const { data: settings, error: settingsError } =
      await supabaseAdmin
        .from("settings")
        .select("id, total_scooters")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (settingsError || !settings) {
      console.error("SUPABASE SETTINGS ERROR:", {
        message: settingsError?.message,
        code: settingsError?.code,
        details: settingsError?.details,
        hint: settingsError?.hint,
        settings,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Unable to load scooter settings.",
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

    // 3. Get reservations overlapping the requested dates
    const { data: reservations, error: reservationsError } =
      await supabaseAdmin
        .from("reservations")
        .select("start_date, end_date")
        .in("status", ["pending", "confirmed"])
        .lte("start_date", endDate)
        .gte("end_date", startDate);

    if (reservationsError) {
      console.error("SUPABASE RESERVATIONS ERROR:", {
        message: reservationsError.message,
        code: reservationsError.code,
        details: reservationsError.details,
        hint: reservationsError.hint,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Unable to check reservations.",
        },
        { status: 500 }
      );
    }

    // 4. Calculate availability for EACH day
    const unavailableDates: string[] = [];
    const availabilityByDate: Record<string, number> = {};

    for (
      let day = startDate;
      day <= endDate;
      day = nextDay(day)
    ) {
      const reservedScooters = (reservations ?? []).filter(
        (reservation) =>
          reservation.start_date <= day &&
          reservation.end_date >= day
      ).length;

      const remainingScooters = Math.max(
        totalScooters - reservedScooters,
        0
      );

      availabilityByDate[day] = remainingScooters;

      if (remainingScooters === 0) {
        unavailableDates.push(day);
      }
    }

    // 5. Return calendar data
    return NextResponse.json(
      {
        success: true,
        available: unavailableDates.length === 0,
        totalScooters,
        unavailableDates,
        availabilityByDate,
        startDate,
        endDate,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("AVAILABILITY API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to check availability.",
      },
      { status: 500 }
    );
  }
}