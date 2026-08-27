# DriveX API Contract

Frontend ↔ mock backend contract. Replace JSON Server later without rewriting UI.

**Domain:** DriveX is a driver-booking platform. Users own/register vehicles
(`UserVehicle`). Drivers provide driving service only — they do not own platform
vehicles. `Booking.userVehicleId` and `Trip.userVehicleId` reference the customer's
vehicle.

Base URL: `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:3001`)

## Response shapes

Success:

```json
{ "data": {}, "message": "Success" }
```

Collection:

```json
{ "data": [], "meta": { "total": 0 }, "message": "Success" }
```

Error:

```json
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "Resource not found" } }
```

## Auth

### POST `/api/auth/login`

- Auth: none
- Body: `{ email, password }`
- Response: `{ data: { token, user } }`

### POST `/api/auth/signup`

- Auth: none
- Body: `{ name, email, phone, password }`
- Response: `{ data: { email, message } }`
- Side effect: queues mock OTP `123456`

### POST `/api/auth/verify-otp`

- Auth: none
- Body: `{ email, otp }`
- Response: session

### GET `/api/auth/me`

- Auth: Bearer token
- Response: current user

### POST `/api/auth/logout`

- Auth: Bearer token (optional)
- Clears session

### POST `/api/auth/select-role`

- Auth: Bearer token
- Role: authenticated
- Body: `{ role: "USER" | "DRIVER" }`
- Creates driver profile when selecting DRIVER

## Users

| Method | Path | Auth | Role | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/api/users/me` | yes | USER/DRIVER | Current user |
| PATCH | `/api/users/me` | yes | USER/DRIVER | Update profile |
| GET | `/api/users/me/bookings` | yes | USER | Own bookings |
| GET | `/api/users/me/payments` | yes | USER | Own payments |
| GET | `/api/users/me/notifications` | yes | any | Own notifications |
| GET | `/api/users/me/saved-places` | yes | USER | Saved places |
| GET | `/api/users/me/vehicles` | yes | USER | Own vehicles |
| GET | `/api/users/me/vehicles/:id` | yes | USER | Vehicle detail |
| POST | `/api/users/me/vehicles` | yes | USER | Add vehicle |
| PATCH | `/api/users/me/vehicles/:id` | yes | USER | Update vehicle |
| DELETE | `/api/users/me/vehicles/:id` | yes | USER | Delete vehicle |

A User may only create bookings that reference a `userVehicleId` belonging to that User.

## Bookings

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/bookings` | yes | List (scoped by role) |
| GET | `/api/bookings/:id` | yes | Detail |
| POST | `/api/bookings` | yes | Create (`REQUESTED`) with `userVehicleId` + `serviceType` |
| PATCH | `/api/bookings/:id` | yes | Update / status transition |
| POST | `/api/bookings/:id/cancel` | yes | Cancel |
| POST | `/api/bookings/:id/dispatch` | yes | Mock dispatch → DRIVER_ASSIGNED + Trip |
| POST | `/api/bookings/estimate` | yes | Mock driver-service fare estimate |
| GET | `/api/bookings/:id/details` | yes | Booking + trip + driver + **userVehicle** + payment |

### Booking transitions

```text
REQUESTED → SEARCHING → DRIVER_ASSIGNED → CONFIRMED
Any of the above (except EXPIRED end-state) → CANCELLED where allowed
REQUESTED|SEARCHING → EXPIRED
```

Invalid transitions return `409 CONFLICT`.

### Mock dispatch (dev only)

`POST /api/bookings/:id/dispatch` is a **mock-server** helper. When choosing among
online verified drivers it may prefer seeded `driver-2` for deterministic local
e2e. That preference is **not** product/business logic and must not be copied
into a real backend.

## Drivers

| Method | Path | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/drivers/me` | DRIVER | Profile |
| PATCH | `/api/drivers/me` | DRIVER | Update |
| POST | `/api/drivers/me/status` | DRIVER | Availability |
| GET | `/api/drivers/me/trips` | DRIVER | Trips |
| GET | `/api/drivers/me/earnings` | DRIVER | Earnings |
| GET | `/api/drivers/me/wallet` | DRIVER | Wallet txs |
| GET | `/api/drivers/me/documents` | DRIVER | Documents |

### Availability transitions

```text
OFFLINE → ONLINE
ONLINE → OFFLINE | BUSY
BUSY → ONLINE | OFFLINE
```

## Trips

| Method | Path | Role | Allowed from | Result |
| --- | --- | --- | --- | --- |
| GET | `/api/trips/:id` | USER/DRIVER | — | Trip (`userVehicleId`) |
| GET | `/api/trips/:id/details` | USER/DRIVER | — | Trip + booking + **customer vehicle** |
| POST | `/api/trips/:id/accept` | DRIVER | ASSIGNED | DRIVER_ARRIVING |
| POST | `/api/trips/:id/reject` | DRIVER | ASSIGNED | CANCELLED |
| POST | `/api/trips/:id/arrived` | DRIVER | DRIVER_ARRIVING | DRIVER_ARRIVED |
| POST | `/api/trips/:id/start` | DRIVER | DRIVER_ARRIVED | STARTED |
| POST | `/api/trips/:id/complete` | DRIVER | STARTED | COMPLETED |
| POST | `/api/trips/:id/cancel` | DRIVER | ASSIGNED\|ARRIVING\|ARRIVED | CANCELLED |
| POST | `/api/trips/:id/advance` | any (dev mock) | ordered statuses | Next status |

Example:

```text
POST /api/trips/:id/start
Role: DRIVER
Purpose: Start an assigned trip.
Allowed states: DRIVER_ARRIVED
Result: STARTED
```

## Payments

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/payments` | List |
| GET | `/api/payments/:id` | Detail |
| POST | `/api/payments` | Create mock payment |

## Wallet

| Method | Path | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/wallet` | DRIVER | Balance summary |
| GET | `/api/wallet/transactions` | DRIVER | Transactions |

## Notifications

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/notifications` | List |
| PATCH | `/api/notifications/:id/read` | Mark one read |
| PATCH | `/api/notifications/read-all` | Mark all read |

## Other

- `GET /api/earnings`
- `GET /api/documents` (driver verification docs — not vehicle ownership)
- `GET|POST /api/ratings`
- `GET|POST /api/saved-places`, `PATCH|DELETE /api/saved-places/:id`

Driver APIs do **not** expose driver-owned vehicle management.

## Environment

The API client reads `NEXT_PUBLIC_API_BASE_URL` (`src/lib/env.ts`). Components never hardcode localhost. JSON Server is the development backend; a real API can replace the base URL later without changing the hook/service architecture.
