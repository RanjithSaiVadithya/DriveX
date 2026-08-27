import { test, expect } from "@playwright/test";

async function fillOtp(page: import("@playwright/test").Page) {
  for (const [i, d] of ["1", "2", "3", "4", "5", "6"].entries()) {
    await page.getByLabel(`Digit ${i + 1}`).fill(d);
  }
}

async function loginAsUser(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Phone number").fill("+919800000001");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/verify-otp/);
  await fillOtp(page);
  await expect(page).toHaveURL(/select-role|\/user/, { timeout: 15000 });
  if (page.url().includes("select-role")) {
    await page.getByRole("button", { name: /Book a Driver/i }).click();
  }
  await expect(page).toHaveURL(/\/user/, { timeout: 15000 });
}

async function loginAsDriverTwo(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Phone number").fill("+919800000102");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/verify-otp/);
  await fillOtp(page);
  await expect(page).toHaveURL(/select-role|\/driver/, { timeout: 15000 });
  if (page.url().includes("select-role")) {
    await page.getByRole("button", { name: /Drive With Us/i }).click();
  }
  await expect(page).toHaveURL(/\/driver/, { timeout: 15000 });
}

async function completeBookingWizard(
  page: import("@playwright/test").Page,
  opts: { pickup: RegExp; destination: RegExp; service: RegExp; scheduleLater?: boolean },
) {
  await page.goto("/user/book");
  await page.getByRole("button", { name: opts.pickup }).first().click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: opts.destination }).first().click();
  await page.getByRole("button", { name: "Continue" }).click();

  if (opts.scheduleLater) {
    await page.getByRole("button", { name: /Schedule for later/i }).click();
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    await page.getByLabel("Date").fill(tomorrow);
    await page.getByLabel("Time").fill("15:30");
  } else {
    await page.getByRole("button", { name: /Now/i }).click();
  }
  await page.getByRole("button", { name: "Continue" }).click();

  // Select user's vehicle
  await expect(page.getByText(/Which vehicle will you use/i)).toBeVisible();
  await page.getByRole("button", { name: /Select|Selected/i }).first().click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Select driving service
  await page.getByRole("button", { name: opts.service }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Estimated total")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Confirm Driver Booking" }).click();
  await expect(page).toHaveURL(/\/user\/bookings\//, { timeout: 20000 });
}

test.describe("user booking flows", () => {
  test("Scenario 1 — create booking end to end", async ({ page }) => {
    await loginAsUser(page);
    await completeBookingWizard(page, {
      pickup: /MG Road/i,
      destination: /Indiranagar|Koramangala|Airport/i,
      service: /Point-to-point/i,
    });
    await expect(
      page.getByText(/Driver assigned|Finding|Requested|Status|Your vehicle/i).first(),
    ).toBeVisible();
  });

  test("Scenario 2 — cancel booking", async ({ page }) => {
    await loginAsUser(page);
    await completeBookingWizard(page, {
      pickup: /MG Road/i,
      destination: /Whitefield|Jayanagar|Phoenix/i,
      service: /Hourly/i,
      scheduleLater: true,
    });
    await page.getByRole("button", { name: "Cancel booking" }).click();
    await page.getByRole("button", { name: "Cancel booking" }).last().click();
    await expect(page.getByText(/CANCELLED|Cancelled/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("Scenario 3–5 — trip lifecycle, payment, notification", async ({ page }) => {
    await loginAsUser(page);
    await completeBookingWizard(page, {
      pickup: /Koramangala/i,
      destination: /Airport/i,
      service: /Airport/i,
    });

    for (let i = 0; i < 4; i++) {
      const advance = page.getByRole("button", { name: /Advance trip/i });
      if (await advance.isVisible().catch(() => false)) {
        await advance.click();
        await page.waitForTimeout(400);
      }
    }
    await expect(page.getByText(/Trip completed|COMPLETED|Payment/i).first()).toBeVisible({
      timeout: 15000,
    });

    await page.goto("/user/payments");
    await expect(page.getByText(/Paid|PAID/i).first()).toBeVisible({ timeout: 10000 });

    await page.goto("/user/notifications");
    await expect(page.getByText(/Driver assigned|Trip|Payment|Booking/i).first()).toBeVisible();
    const markAll = page.getByRole("button", { name: /Mark all read/i });
    if (await markAll.isVisible().catch(() => false)) {
      await markAll.click();
    }
  });

  test("authorization — user cannot open driver app", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("/driver");
    await expect(page).not.toHaveURL(/\/driver$/, { timeout: 10000 });
  });

  test("user can open My Vehicles", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("/user/vehicles");
    await expect(page.getByRole("heading", { name: /My Vehicles/i })).toBeVisible();
    await expect(page.getByText(/Book a Driver|Register the vehicles|Add vehicle/i).first()).toBeVisible();
  });
});

test.describe("Phase 3.1 cross-domain driver booking", () => {
  test("user vehicle + driver service + driver sees customer vehicle + lifecycle", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    // Ensure driver-2 is online before the user books (dispatch prefers driver-2)
    await loginAsDriverTwo(page);
    const goOnlineFirst = page.getByRole("button", { name: /Go online/i });
    if (await goOnlineFirst.isEnabled().catch(() => false)) {
      await goOnlineFirst.click();
      await expect(page.getByText(/ONLINE/i).first()).toBeVisible({ timeout: 5000 });
    }

    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);

    const reg = `KA99ZZ${Date.now().toString().slice(-4)}`;
    await page.goto("/user/vehicles");
    await page.getByLabel("Make").fill("Toyota");
    await page.getByLabel("Model").fill("Fortuner");
    await page.getByLabel("Year").fill("2024");
    await page.getByLabel("Registration").fill(reg);
    await page.getByLabel("Color").fill("White");
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.getByText(reg).first()).toBeVisible({
      timeout: 10000,
    });

    await page.goto("/user/book");
    await page.getByRole("button", { name: /MG Road/i }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Airport/i }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Now/i }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText(/Which vehicle will you use/i)).toBeVisible();
    await page.locator("button").filter({ hasText: reg }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Point-to-point/i }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Confirm Driver Booking" }).click();
    await expect(page).toHaveURL(/\/user\/bookings\//, { timeout: 20000 });
    const bookingUrl = page.url();
    await expect(
      page.getByText(new RegExp(`${reg}|Toyota Fortuner|Your vehicle`, "i")).first(),
    ).toBeVisible();

    await page.evaluate(() => localStorage.clear());
    await loginAsDriverTwo(page);
    await page.goto("/driver/trips");
    const requestCard = page.locator("li").filter({ hasText: reg });
    await expect(requestCard.getByText(/Customer Vehicle/i)).toBeVisible({
      timeout: 15000,
    });
    await expect(requestCard.getByText(/Toyota Fortuner/i)).toBeVisible();
    const href = await requestCard
      .getByRole("link", { name: /Review request/i })
      .getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!);
    await expect(page).toHaveURL(/\/driver\/trips\//, { timeout: 10000 });
    await expect(page.getByText(/Customer Vehicle/i).first()).toBeVisible();
    await expect(page.getByText(reg).first()).toBeVisible();
    await page.getByRole("main").getByRole("button", { name: "Accept" }).click();
    await expect(
      page.getByRole("main").getByRole("button", {
        name: /I.?m Arriving|I.?ve Arrived|Start Navigation/i,
      }).first(),
    ).toBeVisible({ timeout: 10000 });

    const arriving = page.getByRole("button", { name: /I.?m Arriving/i });
    if (await arriving.isVisible().catch(() => false)) {
      await arriving.click();
    }
    await expect(page.getByText(/on the way|Arriving|DRIVER_ARRIVING/i).first()).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole("button", { name: /I.?ve Arrived/i }).click();
    await page.getByRole("button", { name: "Start Trip" }).click();
    await expect(page.getByText(/in progress|STARTED|Trip started/i).first()).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole("button", { name: "Complete Trip" }).click();
    await page.getByRole("button", { name: "Complete Trip" }).last().click();
    await expect(page.getByText(/COMPLETED|completed/i).first()).toBeVisible({
      timeout: 10000,
    });

    await page.goto("/driver/earnings");
    await expect(page.getByText(/Today|Earnings|₹/i).first()).toBeVisible();
    await page.goto("/driver/wallet");
    await expect(page.getByText(/Balance|Trip earning|₹/i).first()).toBeVisible();

    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);
    await page.goto(bookingUrl);
    await expect(
      page.getByText(/Trip completed|COMPLETED|Payment|Driving your vehicle/i).first(),
    ).toBeVisible({ timeout: 15000 });
    await page.goto("/user/payments");
    await expect(page.getByText(/Paid|PAID/i).first()).toBeVisible({ timeout: 10000 });
    await page.goto("/user/notifications");
    await expect(
      page.getByText(/Driver assigned|Trip|Payment|arriving|completed/i).first(),
    ).toBeVisible();
  });
});
