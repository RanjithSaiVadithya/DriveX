export const siteConfig = {
  name: "DriveX",
  shortName: "DriveX",
  description:
    "Driver booking platform where users book drivers to drive their own vehicles.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/images/og-default.png",
  locale: "en_US",
  twitterHandle: "@drivex",
  defaultTitle: "DriveX — Book a Driver for Your Vehicle",
  titleTemplate: "%s | DriveX",
} as const;

export type SiteConfig = typeof siteConfig;
