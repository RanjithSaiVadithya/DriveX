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

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-deep-navy text-warm-white">
      <PageContainer className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <DriveXLogo variant="light" size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {publicContent.footer.description}
          </p>
          <ul className="mt-5 flex items-center gap-2">
            {socialLinks.map(({ label, href, path }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-olive hover:bg-olive hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d={path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/55">
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
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/55">
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
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/55">
            Popular cities
          </h2>
          <ul className="mt-4 space-y-2.5">
            {publicContent.citiesDemo.cities.map((city) => (
              <li key={city} className="text-sm text-white/85">
                {city}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/55">
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
        <PageContainer className="flex flex-col gap-2 py-6 text-caption text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Safe. Reliable. Always.</p>
        </PageContainer>
      </div>
    </footer>
  );
}
