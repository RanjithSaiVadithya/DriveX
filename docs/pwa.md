# DriverDosth PWA

DriverDosth is an installable Progressive Web App on top of the existing Next.js App Router application.

## Manifest

- Source: `src/app/manifest.ts`
- Served at `/manifest.webmanifest`
- `display: standalone`
- Theme: olive `#5c6b3a`
- Background: cream `#f7f3eb`
- Icons: `/icon-192.png`, `/icon-512.png` (also used as maskable)

## Service worker

- File: `public/sw.js`
- Registers in **production** only (`useServiceWorker`)
- Caches **static shell / assets only**
- **Never** caches `/api/*`, wallet, bookings, trips, payments, or notifications

## Offline behavior

- Offline banner: “You're offline…”
- `/offline` fallback page
- Mutations (accept, start, complete, withdraw, etc.) are blocked via `assertOnlineForMutation`
- Recovery toast: “Back online”

## Install

- `beforeinstallprompt` → Install CTA (home / settings / public section)
- Suppressed during booking, payment, auth, and active trip routes
- iOS: manual “Add to Home Screen” instructions
- Already-installed standalone mode hides the CTA

## Local verification

```bash
npm run build && npm run start
# separate terminal
npm run mock:server
```

Open Chrome → Application → Manifest / Service Workers.

Install requires HTTPS (or localhost).
