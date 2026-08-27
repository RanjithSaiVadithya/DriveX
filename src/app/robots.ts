import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/user/",
        "/driver/",
        "/login",
        "/signup",
        "/verify-otp",
        "/select-role",
        "/offline",
      ],
    },
    sitemap: `${env.appUrl}/sitemap.xml`,
  };
}
