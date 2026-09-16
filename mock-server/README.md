# DriverDosth Mock Server

JSON Server–based mock backend.

**Domain note:** DriverDosth is a driver-booking platform. Seed data uses
`userVehicles` owned by Users. Drivers do not own vehicles. Bookings and trips
store `userVehicleId`.

## Installation

Dependencies are installed from the root project (`json-server` is a root
devDependency). No separate `npm install` is required inside `mock-server/`.

## Start

From the repository root:

```bash
npm run mock:server
```

Or run Next.js and the mock API together:

```bash
npm run dev:all
```

## Port

Default: `http://localhost:3001`

Override with `MOCK_API_PORT`.

## Database

Seed data lives in [`db.json`](./db.json). It is part of the development
contract and should be committed.

### Reset seed data

Restore `db.json` from git:

```bash
git checkout -- mock-server/db.json
```

## Routes

Custom contract routes are defined in [`server.js`](./server.js).

Also available for debugging:

```text
GET /api/raw/*
```

(JSON Server default resources)

## Test accounts

| Email | Password | Role |
| --- | --- | --- |
| `user@example.test` | `password123` | USER |
| `driver@example.test` | `password123` | DRIVER |
| `driver2@example.test` | `password123` | DRIVER |

## Mock dispatch behavior (dev only)

`POST /api/bookings/:id/dispatch` simulates assignment for local development.

When multiple drivers are `ONLINE` + `VERIFIED`, the mock prefers seeded
`driver-2` so demos and Playwright e2e stay deterministic.

**This is mock-server behavior only.** It is not DriverDosth product logic and must
not be carried into a real backend. Production dispatch/matching belongs to the
real service layer.

## Mock OTP

Development-only OTP:

```text
123456
```

This is **not** secure production authentication.

## Developer workflow

```text
Terminal 1: npm run dev
Terminal 2: npm run mock:server
```

Or:

```text
npm run dev:all
```
