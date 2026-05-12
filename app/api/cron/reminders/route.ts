import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderText } from "@/lib/twilio";

export async function GET() {
  try {
    const now = new Date();

    // Sessions starting exactly in 2 hours
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    // Add a 15-minute buffer to ensure we catch sessions if the cron runs every 15 minutes
    const twoHoursAndFifteenMinutesFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000);

    const upcomingSessions = await prisma.session.findMany({
      where: {
        startTime: {
          gte: twoHoursFromNow,
          lt: twoHoursAndFifteenMinutesFromNow,
        },
      },
      include: {
        tutor: true,
        student: true,
      },
    });

    let remindersSent = 0;
    const errors: string[] = [];

    for (const session of upcomingSessions) {
      const timeString = session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (session.student.phone) {
        try {
          await sendReminderText(
            session.student.phone,
            `Reminder: Your tutoring session with ${session.tutor.name || 'your tutor'} starts at ${timeString}.`
          );
          remindersSent++;
        } catch (error) {
          console.error(`Failed to send reminder to student ${session.student.id}:`, error);
          errors.push(`Failed to send to student ${session.student.id}`);
        }
      }

      if (session.tutor.phone) {
        try {
          await sendReminderText(
            session.tutor.phone,
            `Reminder: Your tutoring session with ${session.student.name || 'your student'} starts at ${timeString}.`
          );
          remindersSent++;
        } catch (error) {
          console.error(`Failed to send reminder to tutor ${session.tutor.id}:`, error);
          errors.push(`Failed to send to tutor ${session.tutor.id}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      sessionsFound: upcomingSessions.length,
      remindersSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
