import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { publicRoutes } from "@/config/routes";

export function Breadcrumbs({
  current,
  className,
}: {
  current: string;
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("mb-6 flex items-center gap-2 text-sm", className)}
    >
      <Link
        href={publicRoutes.home}
        className="text-muted-foreground hover:text-olive transition-colors duration-200"
      >
        Home
      </Link>
      <ChevronRight className="text-muted-foreground/60 size-4" aria-hidden />
      <span aria-current="page" className="text-deep-navy font-semibold">
        {current}
      </span>
    </nav>
  );
}
