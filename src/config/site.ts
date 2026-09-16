export const siteConfig = {
  name: "DriverDosth",
  shortName: "DriverDosth",
  description:
    "Driver booking platform where users book drivers to drive their own vehicles.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/images/og-default.png",
  locale: "en_US",
  twitterHandle: "@driverdosth",
  defaultTitle: "DriverDosth — Book a Driver for Your Vehicle",
  titleTemplate: "%s | DriverDosth",
} as const;

export type SiteConfig = typeof siteConfig;
