import Link from "next/link";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTASection({
  title,
  description,
  primary,
  secondary,
  tone = "cream",
  className,
}: {
  title: string;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: "cream" | "navy";
  className?: string;
}) {
  const navy = tone === "navy";
  return (
    <section
      className={cn(
        "public-section",
        navy ? "bg-deep-navy text-warm-white" : "bg-cream",
        className,
      )}
    >
      <PageContainer className="text-center">
        <h2 className={cn("text-h2", navy && "text-warm-white")}>{title}</h2>
        {description ? (
          <p
            className={cn(
              "mx-auto mt-3 max-w-xl text-base",
              navy ? "text-white/75" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href={primary.href}
            className={cn(
              buttonVariants({ variant: navy ? "default" : "navy", size: "lg" }),
              "w-full sm:w-auto",
            )}
          >
            {primary.label}
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto",
                navy &&
                  "text-warm-white border-white/25 bg-transparent hover:bg-white/10",
              )}
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
}
