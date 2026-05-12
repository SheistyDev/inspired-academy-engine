export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 bg-background mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 text-center md:text-left text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} TrueNorth. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
