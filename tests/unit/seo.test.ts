import { describe, expect, it } from "vitest";
import { buildPageMetadata, privatePageMetadata } from "@/lib/seo";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("SEO foundation", () => {
  it("builds unique homepage metadata with index", () => {
    const meta = buildPageMetadata({
      title: { absolute: "DriverDosth — Safe, Reliable Rides" },
      description: "Safe rides",
      path: "/",
      index: true,
    });
    expect(meta.title).toEqual({ absolute: "DriverDosth — Safe, Reliable Rides" });
    expect(meta.robots).toMatchObject({ index: true, follow: true });
    expect(meta.alternates?.canonical).toBeTruthy();
  });

  it("marks private pages noindex", () => {
    const meta = privatePageMetadata("User app");
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("exposes robots disallow for private areas", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules?.disallow).toEqual(
      expect.arrayContaining(["/user/", "/driver/", "/login"]),
    );
  });

  it("sitemap includes only public indexable paths", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/about"))).toBe(true);
    expect(urls.some((u) => u.includes("/user"))).toBe(false);
    expect(urls.some((u) => u.includes("/login"))).toBe(false);
  });
});
