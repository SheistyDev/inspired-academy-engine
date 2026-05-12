import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          TrueNorth
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="default">Login</Button>
        </div>
      </div>
    </nav>
  );
}
