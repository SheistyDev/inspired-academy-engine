import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const error = err as Error;
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as unknown as {
        metadata?: { sessionId?: string };
        id: string;
        amount_total: number | null;
      };

      const sessionId = session.metadata?.sessionId;

      if (sessionId) {
        const updatedSession = await prisma.session.update({
          where: { id: sessionId },
          data: { status: "CONFIRMED" },
        });

        if (session.amount_total !== null) {
          await prisma.payment.create({
            data: {
              sessionId: updatedSession.id,
              userId: updatedSession.studentId,
              amount: session.amount_total / 100, // Stripe amount is in cents
            },
          });
        }
      }
      console.log("Checkout session completed:", session.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
