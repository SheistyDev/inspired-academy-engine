import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderText } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const { sessionId, newTimestamp } = await req.json();

    if (!sessionId || !newTimestamp) {
      return NextResponse.json(
        { error: "sessionId and newTimestamp are required" },
        { status: 400 }
      );
    }

    const newStartTime = new Date(newTimestamp);

    // Get the existing session to find the duration and student details
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        student: true,
        tutor: true,
      },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const duration =
      existingSession.endTime.getTime() - existingSession.startTime.getTime();
    const newEndTime = new Date(newStartTime.getTime() + duration);

    // Check for overlapping sessions for the tutor
    const conflictingSessions = await prisma.session.findMany({
      where: {
        tutorId: existingSession.tutorId,
        id: { not: sessionId }, // Exclude the current session
        OR: [
          {
            startTime: { lt: newEndTime },
            endTime: { gt: newStartTime },
          },
        ],
      },
    });

    if (conflictingSessions.length > 0) {
      return NextResponse.json(
        { error: "The selected time slot is not available" },
        { status: 409 }
      );
    }

    // Update the session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        startTime: newStartTime,
        endTime: newEndTime,
      },
    });

    // Send SMS notification if student has a phone number
    if (existingSession.student.phone) {
      const message = `Hi ${
        existingSession.student.name || "Student"
      }, your session with ${
        existingSession.tutor.name || "your tutor"
      } has been rescheduled to ${newStartTime.toLocaleString()}.`;

      try {
        await sendReminderText(existingSession.student.phone, message);
      } catch (smsError) {
        console.error("Failed to send reschedule SMS:", smsError);
        // We don't fail the API call if just the SMS fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Session rescheduled successfully",
      data: updatedSession,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
