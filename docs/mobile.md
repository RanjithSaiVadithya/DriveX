# DriverDosth mobile & Android readiness

## One codebase

DriverDosth remains a single Next.js application with role routes:

- `/user/*`
- `/driver/*`

Responsive UI + PWA install cover desktop browser, mobile browser, and installed PWA.

## Mobile UX

- User bottom nav: Home, Trips, Book, Payments, Profile
- Driver bottom nav: Home, Trips, Earnings, More
- Safe-area insets on sticky headers and bottom nav
- Driver trip primary actions are sticky on small screens
- Touch targets aim for ~44px (`min-h-11`)

## Android wrapper strategy (Phase 5 decision)

Next.js **16** in this repo uses a **Node server** (`next start`), not `output: "export"`.

Therefore **Capacitor static asset embedding is not compatible without changing the deployment model**.

Recommended Android path for DriverDosth:

1. Host the production Next.js app (HTTPS)
2. Wrap that URL in a thin WebView / Trusted Web Activity / Capacitor `server.url` configuration
3. Keep business logic, auth, and API client in the web app

Do **not** invent a Play Store package ID until product decides one.

Package ID decision required later, e.g. `com.driverdosth.app` — not chosen in Phase 5.

## Deep links

App Router already supports direct URLs such as:

- `/user/bookings/:id`
- `/driver/trips/:id`

Future Android App Links can map to the same paths.

## What was not implemented

- Native Capacitor `android/` project
- Play Store listing
- Native push / GPS / Maps SDKs
