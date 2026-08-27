# DriveX

DriveX is a **driver-booking platform**. Users provide their own vehicles.
Drivers provide the driving service.

```text
USER OWNS VEHICLE
        +
USER BOOKS DRIVER
        +
DRIVER PROVIDES DRIVING SERVICE
        =
TRIP
```

DriveX is one platform with three experiences (Public, User, Driver) sharing a
single domain model and API contract. A booking/trip is never duplicated into
separate unrelated User and Driver records.

There is **no** driver-owned vehicle inventory and **no** vehicle rental.

## Architecture

```text
                         DriveX
                           |
          +----------------+----------------+
          |                |                |
        Public            User           Driver
          |                |                |
       SEO/SSR          App UI           App UI
                           |
                    Feature Services
                           |
                    Business/Domain
                           |
                       API Client
                           |
                     JSON Server
                           |
                         db.json
```

Critical rule: UI ≠ business logic ≠ API ≠ mock data ≠ validation.

## Technology stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + Lucide
- TanStack Query + Zustand
- React Hook Form + Zod
- JSON Server (mock backend)
- ESLint + Prettier
- Vitest + Testing Library + Playwright

## Folder structure

```text
src/app/(public|auth)|user|driver   route architecture
src/components                      ui / shared / public / user / driver
src/features                        feature modules
src/services/api                    API client + endpoint modules
src/services/domain                 state machines & permissions
src/schemas                         Zod validation
src/types                           domain types
src/hooks / stores / lib / config
mock-server/                        JSON Server + db.json
docs/api-contract.md                API contract
tests/                              unit + e2e
```

## Install

```bash
npm install
cp .env.example .env.local
```

## Start Next.js

```bash
npm run dev
```

## Start JSON Server

```bash
npm run mock:server
```

## Start both

```bash
npm run dev:all
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL (SEO, sitemap, OG) |
| `NEXT_PUBLIC_API_BASE_URL` | Mock / real API base URL |
| `NEXT_PUBLIC_APP_NAME` | App display name |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification |
| `NEXT_PUBLIC_ANDROID_APP_URL` | Optional Play Store URL (empty until published) |
| `NEXT_PUBLIC_IOS_APP_URL` | Optional App Store URL |

Never hardcode `http://localhost:3001` in components.

## Test accounts

| Email | Password | Notes |
| --- | --- | --- |
| `user@example.test` | `password123` | USER |
| `driver@example.test` | `password123` | DRIVER |

Mock OTP (development only): `123456`

## Testing

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## SEO implementation

- Centralized site config + Metadata API
- Unique public page titles/descriptions
- Canonical URLs from `NEXT_PUBLIC_APP_URL`
- `/robots.txt` and `/sitemap.xml`
- Open Graph + Twitter cards
- JSON-LD Organization / WebSite foundation
- Private routes use `noindex`
- Google Search Console verification via env

## Favicon / PWA

- Manifest: `/manifest.webmanifest` (`src/app/manifest.ts`)
- Service worker: `public/sw.js` (static shell only; no private API cache)
- Icons: `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`
- Docs: `docs/pwa.md`, `docs/mobile.md`, `docs/development.md`

## Future backend replacement

Keep this chain stable:

```text
Component → Hook → Feature/service → API client → Endpoint
```

Only transport / mock implementation should change when the real backend arrives.

JSON Server remains the development backend. Set `NEXT_PUBLIC_API_BASE_URL` to point at a real API later.

## Phase boundaries

Not included: real auth, payments, SMS, maps, GPS, push, file storage, KYC,
production Play Store / App Store release. Android packaging strategy is documented in `docs/mobile.md`.
