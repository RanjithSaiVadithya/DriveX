import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { DriverDosthMark } from "@/components/shared/driver-dosth-mark";
import { cn } from "@/lib/utils";
import { publicRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

const logoVariants = cva("inline-flex min-w-0 max-w-full items-center", {
  variants: {
    variant: {
      default: "",
      light: "",
      dark: "",
      compact: "",
    },
    size: {
      sm: "gap-1.5 sm:gap-2",
      md: "gap-2 sm:gap-2.5 md:gap-3",
      lg: "gap-2.5 sm:gap-3 md:gap-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const iconSizeClasses = {
  sm: "size-[clamp(1.875rem,7vw,2.5rem)]",
  md: "size-[clamp(2.5rem,8.5vw,3.5rem)]",
  lg: "size-[clamp(3rem,10vw,4.25rem)]",
} as const;

const wordmarkSizeClasses = {
  sm: "text-[clamp(1.05rem,4.5vw,1.4rem)]",
  md: "text-[clamp(1.3rem,5.5vw,1.85rem)]",
  lg: "text-[clamp(1.55rem,6.5vw,2.2rem)]",
} as const;

const taglineSizeClasses = {
  sm: "text-[clamp(0.55rem,2vw,0.62rem)]",
  md: "text-[clamp(0.58rem,2.1vw,0.68rem)]",
  lg: "text-[clamp(0.62rem,2.2vw,0.72rem)]",
} as const;

const wordmarkColorClasses = {
  default: {
    driver: "text-deep-navy",
    dosth: "text-olive",
    tagline: "text-muted-foreground",
    mark: "text-[#003058] [--logo-accent:#10a828]",
  },
  dark: {
    driver: "text-deep-navy",
    dosth: "text-olive",
    tagline: "text-muted-foreground",
    mark: "text-[#003058] [--logo-accent:#10a828]",
  },
  compact: {
    driver: "text-deep-navy",
    dosth: "text-olive",
    tagline: "text-muted-foreground",
    mark: "text-[#003058] [--logo-accent:#10a828]",
  },
  light: {
    driver: "text-warm-white",
    dosth: "text-[#7ec876]",
    tagline: "text-white/60",
    mark: "text-warm-white [--logo-accent:#7ec876]",
  },
} as const;

interface DriverDosthLogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
  href?: string;
  asLink?: boolean;
  showTagline?: boolean;
  /** Override mark primary color (D / driver / road). */
  markPrimary?: string;
  /** Override mark accent color (passenger). */
  markAccent?: string;
  /** Extra classes on the SVG mark (e.g. `text-deep-navy [--logo-accent:var(--olive)]`). */
  markClassName?: string;
}

export function DriverDosthLogo({
  variant = "default",
  size = "md",
  className,
  href = publicRoutes.home,
  asLink = true,
  showTagline = true,
  markPrimary,
  markAccent,
  markClassName,
}: DriverDosthLogoProps) {
  const resolvedSize = size ?? "md";
  const resolvedVariant = variant ?? "default";
  const colors = wordmarkColorClasses[resolvedVariant];

  const content = (
    <span
      className={cn(
        logoVariants({ variant: resolvedVariant, size: resolvedSize }),
        className,
      )}
    >
      <DriverDosthMark
        primary={markPrimary}
        accent={markAccent}
        className={cn(
          iconSizeClasses[resolvedSize],
          colors.mark,
          markClassName,
        )}
      />
      <span className="flex min-w-0 shrink-0 flex-col justify-center leading-none">
        <span
          className={cn(
            wordmarkSizeClasses[resolvedSize],
            "font-extrabold tracking-tight whitespace-nowrap",
          )}
        >
          <span className={colors.driver}>Driver</span>
          <span className={colors.dosth}>Dosth</span>
        </span>
        {showTagline ? (
          <span
            className={cn(
              taglineSizeClasses[resolvedSize],
              colors.tagline,
              "mt-1 font-medium uppercase tracking-[0.14em]",
            )}
          >
            Your Journey. Our People.
          </span>
        ) : null}
        <span className="sr-only">{siteConfig.name}</span>
      </span>
    </span>
  );

  if (!asLink) return content;
  return (
    <Link
      href={href}
      className="inline-flex min-w-0 max-w-full shrink focus-visible:rounded-sm"
    >
      {content}
    </Link>
  );
}
