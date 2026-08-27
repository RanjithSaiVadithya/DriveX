import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-caption font-semibold uppercase tracking-wider text-orange">
        DriveX
      </p>
      <h1 className="text-h2 text-deep-navy">Page not found</h1>
      <p className="text-muted-foreground">
        That link doesn&apos;t match a DriveX page. Head home or open the app.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/" className={cn(buttonVariants())}>
          Home
        </Link>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline" }))}>
          Log in
        </Link>
      </div>
    </main>
  );
}
