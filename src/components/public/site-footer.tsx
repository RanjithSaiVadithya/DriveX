import Link from "next/link";
import { DriveXLogo } from "@/components/shared/logo";
import { PageContainer } from "@/components/shared/page-container";
import { AppDownloadSection } from "@/components/public/app-download-section";
import {
  footerCompanyLinks,
  footerSupportLinks,
  publicContent,
} from "@/config/content";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-deep-navy text-warm-white">
      <PageContainer className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <DriveXLogo variant="light" size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-warm-beige/85">
            {publicContent.footer.description}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-beige">
            Company
          </h2>
          <ul className="mt-4 space-y-2">
            {footerCompanyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-warm-white/85 transition-colors hover:text-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-beige">
            Support
          </h2>
          <ul className="mt-4 space-y-2">
            {footerSupportLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-warm-white/85 transition-colors hover:text-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-beige">
            Popular cities
          </h2>
          <p className="mt-2 text-caption text-warm-beige/70">
            {publicContent.citiesDemo.note}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {publicContent.citiesDemo.cities.map((city) => (
              <li
                key={city}
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-warm-white/90"
              >
                {city}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-warm-beige">Download App</p>
            <AppDownloadSection compact />
          </div>
        </div>
      </PageContainer>

      <div className="border-t border-white/10">
        <PageContainer className="flex flex-col gap-2 py-6 text-caption text-warm-beige/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Phase 2 public website foundation.</p>
        </PageContainer>
      </div>
    </footer>
  );
}
