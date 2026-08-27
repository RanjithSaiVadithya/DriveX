import { test, expect } from "@playwright/test";

test("homepage is crawlable with DriveX branding", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "DriveX" }).first()).toBeVisible();
  const icons = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
  await expect(icons.first()).toBeAttached();
});

test("robots and sitemap are available", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  const robotsText = await robots.text();
  expect(robotsText).toContain("Disallow: /user/");
  expect(robotsText).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  expect(xml).toContain("/about");
  expect(xml).not.toContain("/login");
});
