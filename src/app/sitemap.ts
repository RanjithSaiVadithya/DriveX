import type { MetadataRoute } from "next";
import { indexablePaths } from "@/config/routes";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return indexablePaths.map((path) => ({
    url: new URL(path, env.appUrl).toString(),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
