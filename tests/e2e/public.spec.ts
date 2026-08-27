import { test, expect } from "@playwright/test";

const publicPaths = [
  "/",
  "/about",
  "/how-it-works",
  "/safety",
  "/contact",
  "/drive-with-us",
];

for (const path of publicPaths) {
  test(`public page renders: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("link", { name: /DriveX|Drive/i }).first()).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

test("landing CTAs point to auth and drive-with-us", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Book a Driver" }).first()).toHaveAttribute(
    "href",
    "/login",
  );
  await expect(
    page.getByRole("link", { name: "Drive With Us" }).first(),
  ).toBeVisible();
});

test("robots and sitemap remain correct", async ({ request }) => {
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

test("mobile menu opens", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await expect(page.getByRole("link", { name: "About Us" })).toBeVisible();
});
