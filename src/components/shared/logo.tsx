import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { publicRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

const logoVariants = cva("inline-flex items-baseline font-extrabold tracking-tight", {
  variants: {
    variant: {
      default: "text-deep-navy",
      light: "text-warm-white",
      dark: "text-deep-navy",
      compact: "text-deep-navy",
    },
    size: {
      sm: "text-xl",
      md: "text-2xl",
      lg: "text-3xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface DriveXLogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
  href?: string;
  asLink?: boolean;
}

export function DriveXLogo({
  variant = "default",
  size = "md",
  className,
  href = publicRoutes.home,
  asLink = true,
}: DriveXLogoProps) {
  const content = (
    <span className={cn(logoVariants({ variant, size }), className)}>
      Drive
      <span className="text-olive">X</span>
      <span className="sr-only">{siteConfig.name}</span>
    </span>
  );

  if (!asLink) return content;
  return (
    <Link href={href} className="inline-flex focus-visible:rounded-sm">
      {content}
    </Link>
  );
}
