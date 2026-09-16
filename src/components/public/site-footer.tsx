import Link from "next/link";
import { DriverDosthLogo } from "@/components/shared/logo";
import { PageContainer } from "@/components/shared/page-container";
import { AppDownloadSection } from "@/components/public/app-download-section";
import {
  footerSupportLinks,
  publicContent,
  publicNavItems,
} from "@/config/content";
import { publicRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const footerNavItems = [
  ...publicNavItems,
  { label: "Drive With Us", href: publicRoutes.driveWithUs },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-deep-navy text-warm-white">
      <PageContainer className="flex flex-col gap-10 py-12">
        <div className="flex w-full flex-col gap-6">
          <DriverDosthLogo
            variant="light"
            size="lg"
            className="w-fit max-w-full shrink-0"
          />
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            {publicContent.footer.description}
          </p>
          <Link
            href={footerSupportLinks[0].href}
            className="w-fit rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#7ec876] hover:bg-[#7ec876] hover:text-deep-navy"
          >
            Contact the DriverDosth team
          </Link>

          <nav
            aria-label="Footer"
            className="border-white/10 flex w-full flex-wrap items-center gap-1 border-t pt-6 sm:gap-0.5"
          >
            {footerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                  "text-white/90 hover:bg-white/10 hover:text-[#7ec876]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white/55 uppercase">
              Support
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerSupportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white/55 uppercase">
              Popular cities
            </h2>
            <ul className="mt-4 space-y-2.5">
              {publicContent.popularCities.cities.map((city) => (
                <li key={city.name} className="text-sm text-white/85">
                  {city.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-semibold tracking-wide text-white/55 uppercase">
              Download App
            </h2>
            <p className="mt-3 text-sm text-white/65">
              Install DriverDosth on your phone for faster booking.
            </p>
            <div className="mt-4">
              <AppDownloadSection compact />
            </div>
          </div>
        </div>
      </PageContainer>

      <div className="border-t border-white/10">
        <PageContainer className="text-caption flex flex-col gap-2 py-6 text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Safe. Reliable. Always.</p>
        </PageContainer>
      </div>
    </footer>
  );
}
