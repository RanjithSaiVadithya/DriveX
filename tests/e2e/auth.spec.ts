import { test, expect } from "@playwright/test";

test.describe("authentication flow", () => {
  test("phone login → OTP → role → user app", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Phone number").fill("+919800000001");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/verify-otp/);
    await page.getByLabel("Digit 1").fill("1");
    await page.getByLabel("Digit 2").fill("2");
    await page.getByLabel("Digit 3").fill("3");
    await page.getByLabel("Digit 4").fill("4");
    await page.getByLabel("Digit 5").fill("5");
    await page.getByLabel("Digit 6").fill("6");
    await expect(page).toHaveURL(/select-role/, { timeout: 10000 });
    await page.getByRole("button", { name: /Book a Driver/i }).click();
    await expect(page).toHaveURL(/\/user/, { timeout: 10000 });
  });

  test("invalid OTP shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Phone number").fill("+919800000001");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/verify-otp/);
    for (const [i, d] of ["0", "0", "0", "0", "0", "0"].entries()) {
      await page.getByLabel(`Digit ${i + 1}`).fill(d);
    }
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
  });

  test("unauthorized user route redirects to login", async ({ page }) => {
    await page.goto("/user");
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });
});
