import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function StudentPage() {
  // Simulate logged-in student
  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  });

  if (!student) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8 bg-zinc-50 dark:bg-black">
        <h1 className="text-2xl font-bold tracking-tight mb-4 text-black dark:text-zinc-50">Student Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">No student user found in the database.</p>
      </div>
    );
  }

  // Fetch upcoming sessions
  const now = new Date();
  const upcomingSessions = await prisma.session.findMany({
    where: {
      studentId: student.id,
      endTime: {
        gt: now,
      },
    },
    include: {
      tutor: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black py-12">
      <div className="w-full max-w-5xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-black dark:text-zinc-50">Student Dashboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Welcome, {student.name || "Student"}. Here are your upcoming sessions.</p>
        </div>

        {upcomingSessions.length === 0 ? (
          <Card className="w-full bg-white dark:bg-black border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">You have no upcoming sessions.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="flex flex-col justify-between bg-white dark:bg-black border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg text-black dark:text-zinc-50">Session with {session.tutor.name || "Tutor"}</CardTitle>
                  <CardDescription className="text-zinc-500 dark:text-zinc-400">
                    {new Date(session.startTime).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-600 dark:text-zinc-300">
                    <p><strong>Start:</strong> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p><strong>End:</strong> {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Join Video Call</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
