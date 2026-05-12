import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const upcomingSessions = await prisma.session.count({
      where: {
        startTime: {
          gt: new Date(),
        },
      },
    });

    const totalStudents = await prisma.user.count({
      where: {
        role: "STUDENT",
      },
    });

    const paymentsAggregation = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });

    const totalRevenue = paymentsAggregation._sum.amount || 0;

    return NextResponse.json({
      upcomingSessions,
      totalStudents,
      totalRevenue,
    });
  } catch (error: unknown) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
