import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const dynamic = 'force-dynamic'; // Ensure we don't statically cache

export default async function StudentNotesPage() {
  // Find the first student to act as the current user
  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  });

  if (!student) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Notes</h1>
        <p>No student found. Please create a student account.</p>
      </div>
    );
  }

  // Fetch all past sessions with notes for this student
  const sessions = await prisma.session.findMany({
    where: {
      studentId: student.id,
      notes: { not: null },
      endTime: { lt: new Date() }, // Past sessions
    },
    include: {
      tutor: true,
    },
    orderBy: {
      startTime: "desc", // Most recent first
    },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>

      {sessions.length === 0 ? (
        <p className="text-gray-500">No notes available from past sessions.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {sessions.map((session) => (
            <AccordionItem key={session.id} value={session.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-lg">
                    {format(session.startTime, "MMMM d, yyyy")}
                  </span>
                  <span className="text-sm text-gray-500">
                    Tutor: {session.tutor.name || "Unknown"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="prose dark:prose-invert max-w-none">
                  {/* Handle potentially long text with whitespace */}
                  <p className="whitespace-pre-wrap">{session.notes}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
