# Development

## Prerequisites

- Node.js 20+
- npm

## Environment

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL |
| `NEXT_PUBLIC_API_BASE_URL` | Mock or real API base (UI never hardcodes hosts in components) |
| `NEXT_PUBLIC_APP_NAME` | Product name |
| `NEXT_PUBLIC_ANDROID_APP_URL` | Optional Play Store URL (leave empty until published) |
| `NEXT_PUBLIC_IOS_APP_URL` | Optional App Store URL |
| `MOCK_API_PORT` | JSON Server port (default `3001`) |

`NEXT_PUBLIC_*` values are **public** — never put secrets there.

## Run locally

```bash
npm run dev:all
```

- Web: http://localhost:3000
- Mock API: http://localhost:3001

## Quality gates

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Mock backend

JSON Server (`mock-server/`) is **development/testing only**. Do not package `db.json` into production runtime.

## Auth notes (future production)

Current OTP/session is mock. UI depends on session user + role, not OTP internals.

Future production auth may move tokens to httpOnly cookies; document the migration when replacing the mock API.
