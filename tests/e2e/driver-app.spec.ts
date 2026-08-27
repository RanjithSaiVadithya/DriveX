import { test, expect, type Page, type Browser } from "@playwright/test";

async function fillOtp(page: Page) {
  for (const [i, d] of ["1", "2", "3", "4", "5", "6"].entries()) {
    await page.getByLabel(`Digit ${i + 1}`).fill(d);
  }
}

async function loginAsDriver(page: Page, phone = "+919800000102") {
  await page.goto("/login");
  await page.getByLabel("Phone number").fill(phone);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/verify-otp/);
  await fillOtp(page);
  await expect(page).toHaveURL(/select-role|\/driver/, { timeout: 15000 });
  if (page.url().includes("select-role")) {
    await page.getByRole("button", { name: /Drive With Us/i }).click();
  }
  await expect(page).toHaveURL(/\/driver/, { timeout: 15000 });
}

async function loginAsUser(page: Page) {
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

async function ensureDriverOnline(page: Page) {
  await page.goto("/driver");
  const goOnline = page.getByRole("button", { name: /Go online/i });
  if (await goOnline.isVisible().catch(() => false)) {
    if (await goOnline.isEnabled()) {
      await goOnline.click();
      await expect(page.getByText(/Online/i).first()).toBeVisible({
        timeout: 8000,
      });
    }
  }
}

async function openTripRequest(page: Page, reg: string) {
  await page.goto("/driver/trips");
  const requestCard = page.locator("li").filter({ hasText: reg });
  await expect(requestCard.getByText(/Customer Vehicle/i)).toBeVisible({
    timeout: 20000,
  });
  const href = await requestCard
    .getByRole("link", { name: /Review request/i })
    .getAttribute("href");
  expect(href).toBeTruthy();
  await page.goto(href!);
  await expect(page).toHaveURL(/\/driver\/trips\//);
  await expect(page.getByText(reg).first()).toBeVisible();
  return page.getByRole("main");
}

async function progressDriverTrip(main: ReturnType<Page["getByRole"]>, page: Page) {
  const accept = main.getByRole("button", { name: "Accept" });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }

  const arriving = main.getByRole("button", { name: /I.?m Arriving/i });
  await expect(arriving).toBeVisible({ timeout: 10000 });
  await arriving.click();

  const arrived = main.getByRole("button", { name: /I.?ve Arrived/i });
  await expect(arrived).toBeVisible({ timeout: 10000 });
  await arrived.click();

  await expect(main.getByRole("button", { name: "Start Trip" })).toBeVisible({
    timeout: 10000,
  });
  await main.getByRole("button", { name: "Start Trip" }).click();
  await expect(page.getByText(/in progress|STARTED/i).first()).toBeVisible({
    timeout: 10000,
  });

  await main.getByRole("button", { name: "Complete Trip" }).click();
  await page.getByRole("button", { name: "Complete Trip" }).last().click();
  await expect(page.getByText(/Completed|COMPLETED/i).first()).toBeVisible({
    timeout: 15000,
  });
}

test.describe("Phase 4 driver application", () => {
  test("TEST 1 — driver login → dashboard", async ({ page }) => {
    await loginAsDriver(page);
    await expect(
      page.getByRole("heading", { name: /Good (morning|afternoon|evening)/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Today's Earnings|Today's Trips|Rating/i).first(),
    ).toBeVisible();
  });

  test("TEST 2 — driver goes online / offline", async ({ page }) => {
    await loginAsDriver(page);
    await ensureDriverOnline(page);
    const goOffline = page.getByRole("button", { name: /Go offline/i });
    if (!(await goOffline.isVisible().catch(() => false))) {
      return;
    }
    if (!(await goOffline.isEnabled())) {
      await expect(
        page.getByText(/can't go offline|active trip/i).first(),
      ).toBeVisible();
      return;
    }
    await goOffline.click();
    await expect(page.getByText(/Offline/i).first()).toBeVisible({
      timeout: 8000,
    });
    await page.getByRole("button", { name: /Go online/i }).click();
    await expect(page.getByText(/Online/i).first()).toBeVisible({
      timeout: 8000,
    });
  });

  test("TEST 11 — profile update", async ({ page }) => {
    await loginAsDriver(page);
    await page.goto("/driver/profile");
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    const name = page.getByLabel("Name");
    const current = await name.inputValue();
    await name.fill(current || "Driver Two");
    await page.getByRole("button", { name: /Save changes/i }).click();
    await expect(page.getByText(/Profile updated/i).first()).toBeVisible({
      timeout: 8000,
    });
  });

  test("TEST 12 — document UI", async ({ page }) => {
    await loginAsDriver(page);
    await page.goto("/driver/documents");
    await expect(page.getByRole("heading", { name: "Documents" })).toBeVisible();
    await expect(
      page.getByText(/verification|Driving licence|Identity|No documents/i).first(),
    ).toBeVisible();
  });

  test("TEST 13 — mock withdrawal", async ({ page }) => {
    await loginAsDriver(page);
    await page.goto("/driver/wallet");
    await expect(page.getByRole("heading", { name: /Wallet/i })).toBeVisible();
    const withdraw = page.getByRole("button", { name: /^Withdraw$/i });
    await withdraw.click();
    await page.getByLabel(/Amount/i).fill("1");
    await page.getByRole("button", { name: /Confirm Withdrawal/i }).click();
    await expect(page.getByText(/Mock withdrawal|Withdrawal/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("TEST 14 — driver blocked from user app", async ({ page }) => {
    await loginAsDriver(page);
    await page.goto("/user");
    await expect(page).not.toHaveURL(/\/user$/, { timeout: 10000 });
  });

  test("TEST 10 — notifications list", async ({ page }) => {
    await loginAsDriver(page);
    await page.goto("/driver/notifications");
    await expect(
      page.getByRole("heading", { name: /Notifications/i }),
    ).toBeVisible();
  });

  test("mobile shell — bottom navigation at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAsDriver(page);
    const mobileNav = page.getByRole("navigation", { name: /Driver mobile/i });
    await expect(mobileNav).toBeVisible();
    await mobileNav.getByRole("link", { name: "Trips" }).click();
    await expect(page).toHaveURL(/\/driver\/trips/);
    await mobileNav.getByRole("link", { name: "Earnings" }).click();
    await expect(page).toHaveURL(/\/driver\/earnings/);
    await mobileNav.getByRole("link", { name: "More" }).click();
    await expect(page).toHaveURL(/\/driver\/settings/);
  });
});

test.describe("Phase 4 driver request lifecycle", () => {
  test("TEST 3–9 — request, accept, progress, complete, earning, wallet", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    await loginAsDriver(page);
    await ensureDriverOnline(page);

    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);

    const reg = `KA88DY${Date.now().toString().slice(-4)}`;
    await page.goto("/user/vehicles");
    await page.getByLabel("Make").fill("Honda");
    await page.getByLabel("Model").fill("City");
    await page.getByLabel("Year").fill("2023");
    await page.getByLabel("Registration").fill(reg);
    await page.getByLabel("Color").fill("Silver");
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.getByText(reg).first()).toBeVisible({ timeout: 10000 });

    await page.goto("/user/book");
    await page.getByRole("button", { name: /MG Road/i }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Airport/i }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Now/i }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.locator("button").filter({ hasText: reg }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Point-to-point/i }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Confirm Driver Booking" }).click();
    await expect(page).toHaveURL(/\/user\/bookings\//, { timeout: 20000 });

    await page.evaluate(() => localStorage.clear());
    await loginAsDriver(page);
    const main = await openTripRequest(page, reg);
    await progressDriverTrip(main, page);

    await page.goto("/driver/earnings");
    await expect(page.getByText(/₹|Earning|Today/i).first()).toBeVisible();
    await page.goto("/driver/wallet");
    await expect(page.getByText(/Trip earning|Balance|₹/i).first()).toBeVisible();
    await page.goto("/driver/notifications");
    await expect(
      page.getByText(/Trip|Booking|Earning|Notification/i).first(),
    ).toBeVisible();
  });

  test("TEST 5 — reject request returns booking to search", async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsDriver(page);
    await ensureDriverOnline(page);

    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);
    const reg = `KA77RJ${Date.now().toString().slice(-4)}`;
    await page.goto("/user/vehicles");
    await page.getByLabel("Make").fill("Hyundai");
    await page.getByLabel("Model").fill("Creta");
    await page.getByLabel("Year").fill("2022");
    await page.getByLabel("Registration").fill(reg);
    await page.getByLabel("Color").fill("Black");
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.getByText(reg).first()).toBeVisible({ timeout: 10000 });

    await page.goto("/user/book");
    await page.getByRole("button", { name: /Indiranagar/i }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Whitefield/i }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Now/i }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.locator("button").filter({ hasText: reg }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Hourly/i }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Confirm Driver Booking" }).click();
    await expect(page).toHaveURL(/\/user\/bookings\//, { timeout: 20000 });

    await page.evaluate(() => localStorage.clear());
    await loginAsDriver(page);
    const main = await openTripRequest(page, reg);
    await main.getByRole("button", { name: "Reject" }).click();
    await page.getByRole("button", { name: "Reject" }).last().click();
    await expect(
      page.getByText(/rejected|Cancelled|SEARCHING|Looking for another/i).first(),
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Phase 4 mandatory cross-role (two contexts)", () => {
  test("user and driver share one booking/trip lifecycle", async ({
    browser,
  }: {
    browser: Browser;
  }) => {
    test.setTimeout(180_000);

    const userCtx = await browser.newContext();
    const driverCtx = await browser.newContext();
    const userPage = await userCtx.newPage();
    const driverPage = await driverCtx.newPage();

    await loginAsDriver(driverPage);
    await ensureDriverOnline(driverPage);

    await loginAsUser(userPage);
    const reg = `KA66XR${Date.now().toString().slice(-4)}`;
    await userPage.goto("/user/vehicles");
    await userPage.getByLabel("Make").fill("Toyota");
    await userPage.getByLabel("Model").fill("Innova");
    await userPage.getByLabel("Year").fill("2024");
    await userPage.getByLabel("Registration").fill(reg);
    await userPage.getByLabel("Color").fill("White");
    await userPage.getByRole("button", { name: "Add vehicle" }).click();
    await expect(userPage.getByText(reg).first()).toBeVisible({ timeout: 10000 });

    await userPage.goto("/user/book");
    await userPage.getByRole("button", { name: /MG Road/i }).first().click();
    await userPage.getByRole("button", { name: "Continue" }).click();
    await userPage.getByRole("button", { name: /Airport/i }).first().click();
    await userPage.getByRole("button", { name: "Continue" }).click();
    await userPage.getByRole("button", { name: /Now/i }).click();
    await userPage.getByRole("button", { name: "Continue" }).click();
    await userPage.locator("button").filter({ hasText: reg }).first().click();
    await userPage.getByRole("button", { name: "Continue" }).click();
    await userPage.getByRole("button", { name: /Point-to-point/i }).click();
    await userPage.getByRole("button", { name: "Continue" }).click();
    await userPage.getByRole("button", { name: "Continue" }).click();
    await userPage.getByRole("button", { name: "Confirm Driver Booking" }).click();
    await expect(userPage).toHaveURL(/\/user\/bookings\//, { timeout: 20000 });
    const bookingUrl = userPage.url();

    const main = await openTripRequest(driverPage, reg);
    await main.getByRole("button", { name: "Accept" }).click();

    await userPage.goto(bookingUrl);
    await expect(
      userPage.getByText(/Driver assigned|Confirmed|accepted/i).first(),
    ).toBeVisible({ timeout: 15000 });

    await main.getByRole("button", { name: /I.?m Arriving/i }).click();
    await userPage.reload();
    await expect(userPage.getByText(/arriving|on the way/i).first()).toBeVisible({
      timeout: 15000,
    });

    await main.getByRole("button", { name: /I.?ve Arrived/i }).click();
    await userPage.reload();
    await expect(userPage.getByText(/arrived/i).first()).toBeVisible({
      timeout: 15000,
    });

    await main.getByRole("button", { name: "Start Trip" }).click();
    await userPage.reload();
    await expect(
      userPage.getByText(/in progress|started|STARTED/i).first(),
    ).toBeVisible({ timeout: 15000 });

    await main.getByRole("button", { name: "Complete Trip" }).click();
    await driverPage.getByRole("button", { name: "Complete Trip" }).last().click();
    await expect(
      driverPage.getByText(/Completed|COMPLETED/i).first(),
    ).toBeVisible({ timeout: 15000 });

    await userPage.reload();
    await expect(
      userPage.getByText(/completed|Payment|COMPLETED/i).first(),
    ).toBeVisible({ timeout: 15000 });
    await userPage.goto("/user/payments");
    await expect(userPage.getByText(/Paid|PAID/i).first()).toBeVisible({
      timeout: 10000,
    });
    await userPage.goto("/user/notifications");
    await expect(
      userPage.getByText(/Trip|Payment|Driver|arriving|completed/i).first(),
    ).toBeVisible();

    await driverPage.goto("/driver/earnings");
    await expect(driverPage.getByText(/₹|Earning/i).first()).toBeVisible();
    await driverPage.goto("/driver/wallet");
    await expect(
      driverPage.getByText(/Trip earning|Balance|₹/i).first(),
    ).toBeVisible();

    await userCtx.close();
    await driverCtx.close();
  });
});
