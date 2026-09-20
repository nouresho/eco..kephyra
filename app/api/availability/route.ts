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

    const { error: expiryError } = await supabaseAdmin.rpc('ec_paypal_expire');
    if (expiryError) throw new Error('Unable to release expired checkouts');
    const { data: days, error: availabilityError } = await supabaseAdmin.rpc('ec_availability', { p_start: startDate, p_end: endDate });
    if (availabilityError || !days || days.length !== totalDays) throw new Error('Unable to check availability');
    const unavailableDates: string[] = [];
    const availabilityByDate: Record<string, number> = {};
    for (const row of days) {
      availabilityByDate[row.day] = row.available_scooters;
      if (row.available_scooters === 0) unavailableDates.push(row.day);
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