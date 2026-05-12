import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate mock timeslots based on the date to make it feel somewhat dynamic
  const baseDate = new Date(date);
  const isWeekend = baseDate.getDay() === 0 || baseDate.getDay() === 6;

  const timeslots = isWeekend
    ? ["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"]
    : ["09:00 AM", "09:30 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:00 PM"];

  return NextResponse.json({ date, timeslots });
}
