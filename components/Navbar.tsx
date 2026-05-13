import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

export function Navbar() {
  // Read the branding variables from your .env file
  const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME || "TrueNorth";
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL;

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          {/* Conditionally render the logo if the URL is provided */}
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${clientName} Logo`}
              className="h-8 w-auto rounded object-contain"
            />
          )}
          <span>{clientName}</span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {/* Use 'asChild' so the Button acts as a routing Link */}
          <Button variant="default" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}