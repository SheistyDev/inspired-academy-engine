import { ReactNode } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-6 lg:h-[60px]">
        <Link className="flex items-center gap-2 font-semibold" href="/student">
          <span className="">TrueNorth Student</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/student/sessions">
              My Sessions
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {session?.user?.name || "Student"}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
