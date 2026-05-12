import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, parseISO, setHours, setMinutes, isBefore } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    const date = parseISO(dateParam);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Define the start and end of the requested day
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    // Query existing sessions for this date
    const existingSessions = await prisma.session.findMany({
      where: {
        startTime: {
          gte: dayStart,
        },
        endTime: {
          lte: dayEnd,
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Generate potential 1-hour timeslots from 9 AM to 5 PM
    const timeslots: string[] = [];
    const workHoursStart = 9; // 9 AM
    const workHoursEnd = 17; // 5 PM

    for (let hour = workHoursStart; hour < workHoursEnd; hour++) {
      const slotStart = setMinutes(setHours(date, hour), 0);
      const slotEnd = setMinutes(setHours(date, hour + 1), 0);

      // Check if this slot conflicts with any existing session
      const isConflict = existingSessions.some((session) => {
        // Overlap condition:
        // A conflict occurs if the slot starts before the session ends AND the slot ends after the session starts.
        return isBefore(slotStart, session.endTime) && isBefore(session.startTime, slotEnd);
      });

      if (!isConflict) {
        // Format as HH:MM AM/PM for response if needed, but let's keep the existing mock format or something sensible.
        // Actually the prompt says "return an array of available 1-hour time slots"
        // Since the previous implementation returned things like "09:00 AM", we can format it similarly.
        const formattedHour = hour > 12 ? hour - 12 : hour;
        const amPm = hour >= 12 ? "PM" : "AM";
        const formattedTime = `${formattedHour.toString().padStart(2, "0")}:00 ${amPm}`;
        timeslots.push(formattedTime);
      }
    }

    return NextResponse.json({ date: dateParam, timeslots });
  } catch (error: unknown) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
