import { test, expect } from "@playwright/test";

test.describe("Phase 5 PWA & responsive", () => {
  test("manifest is available with DriverDosth branding", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.name).toBe("DriverDosth");
    expect(body.display).toBe("standalone");
    expect(body.icons?.length).toBeGreaterThan(0);
  });

  test("PWA icons resolve", async ({ request }) => {
    for (const path of ["/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"]) {
      const res = await request.get(path);
      expect(res.ok(), path).toBeTruthy();
    }
  });

  test("service worker script is served", async ({ request }) => {
    const res = await request.get("/sw.js");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain("Never");
    expect(text).toMatch(/api/i);
  });

  test("offline page renders", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByRole("heading", { name: /offline/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Retry/i })).toBeVisible();
  });

  test("robots still protect private areas", async ({ request }) => {
    const res = await request.get("/robots.txt");
    const text = await res.text();
    expect(text).toContain("Disallow: /user/");
    expect(text).toContain("Disallow: /driver/");
    expect(text).not.toMatch(/Allow: \/user/);
  });

  test("user mobile 375px — no horizontal overflow on home after login path", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
    await expect(page.getByRole("link", { name: /Log in|Book|Drive/i }).first()).toBeVisible();
  });

  test("desktop public layout renders", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });
});
