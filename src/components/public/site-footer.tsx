import Link from "next/link";
import { DriveXLogo } from "@/components/shared/logo";
import { PageContainer } from "@/components/shared/page-container";
import { AppDownloadSection } from "@/components/public/app-download-section";
import { footerCompanyLinks, footerSupportLinks, publicContent } from "@/config/content";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-deep-navy text-warm-white">
      <PageContainer className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr_1.1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <DriveXLogo variant="light" size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {publicContent.footer.description}
          </p>
          <Link
            href={footerSupportLinks[0].href}
            className="text-olive border-olive/40 hover:bg-olive mt-5 inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:text-white"
          >
            Contact the DriveX team
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white/55 uppercase">
            Company
          </h2>
          <ul className="mt-4 space-y-2.5">
            {footerCompanyLinks.map((link) => (
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

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white/55 uppercase">
            Download App
          </h2>
          <p className="mt-3 text-sm text-white/65">
            Install DriveX on your phone for faster booking.
          </p>
          <div className="mt-4">
            <AppDownloadSection compact />
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
