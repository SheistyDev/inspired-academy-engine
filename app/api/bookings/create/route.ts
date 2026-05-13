import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, timeslot, name, email, phone } = body;

    if (!date || !timeslot || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Database Step 1: Upsert User (Student)
    let student;
    try {
      student = await prisma.user.upsert({
        where: { email },
        update: {
          name,
          phone,
        },
        create: {
          email,
          name,
          phone,
          role: "STUDENT",
        },
      });
    } catch (error: unknown) {
      console.error("Error upserting user:", error);
      return NextResponse.json({ error: "Failed to create or update user" }, { status: 500 });
    }

    // Database Step 2: Find Master Agency Account (Tutor)
    const adminTutor = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminTutor) {
      console.error("No ADMIN user found to serve as tutor.");
      return NextResponse.json({ error: "Booking service is currently unavailable. Contact support." }, { status: 503 });
    }

    // Database Step 3: Parse Date and Time
    // `date` is "YYYY-MM-DD"
    // `timeslot` is "HH:MM AM/PM" (e.g. "09:00 AM", "01:00 PM")

    // Parse timeslot
    const [time, period] = timeslot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    const startTime = new Date(`${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00.000Z`);

    // Assuming 1 hour session
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    // Database Step 4: Create Session
    const session = await prisma.session.create({
      data: {
        tutorId: adminTutor.id,
        studentId: student.id,
        startTime,
        endTime,
        status: "PENDING",
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
