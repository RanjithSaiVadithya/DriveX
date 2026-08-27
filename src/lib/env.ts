import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_ANDROID_APP_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_IOS_APP_URL: z.string().url().optional().or(z.literal("")),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_ANDROID_APP_URL: process.env.NEXT_PUBLIC_ANDROID_APP_URL,
  NEXT_PUBLIC_IOS_APP_URL: process.env.NEXT_PUBLIC_IOS_APP_URL,
});

if (!parsed.success && process.env.NODE_ENV === "development") {
  console.warn(
    "[env] Invalid or incomplete environment variables:",
    parsed.error.flatten().fieldErrors,
  );
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "DriveX",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  androidAppUrl: process.env.NEXT_PUBLIC_ANDROID_APP_URL || undefined,
  iosAppUrl: process.env.NEXT_PUBLIC_IOS_APP_URL || undefined,
} as const;
