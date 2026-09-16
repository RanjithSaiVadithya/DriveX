/**
 * DriverDosth mock API server (JSON Server + custom contract routes).
 * Development only — not production authentication.
 */
const jsonServer = require("json-server");
const path = require("path");
const fs = require("fs");

const PORT = process.env.MOCK_API_PORT || 3001;
const SOURCE_DB_PATH = path.join(__dirname, "db.json");
const DB_PATH = process.env.VERCEL
  ? path.join("/tmp", "driverdosth-db.json")
  : SOURCE_DB_PATH;
const MOCK_OTP = "123456";

if (process.env.VERCEL && !fs.existsSync(DB_PATH)) {
  fs.copyFileSync(SOURCE_DB_PATH, DB_PATH);
}

const bookingTransitions = {
  REQUESTED: ["SEARCHING", "CANCELLED", "EXPIRED"],
  SEARCHING: ["DRIVER_ASSIGNED", "CANCELLED", "EXPIRED"],
  DRIVER_ASSIGNED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CANCELLED"],
  CANCELLED: [],
  EXPIRED: [],
};

const tripTransitions = {
  ASSIGNED: ["DRIVER_ARRIVING", "CANCELLED"],
  DRIVER_ARRIVING: ["DRIVER_ARRIVED", "CANCELLED"],
  DRIVER_ARRIVED: ["STARTED", "CANCELLED"],
  STARTED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const availabilityTransitions = {
  OFFLINE: ["ONLINE"],
  ONLINE: ["OFFLINE", "BUSY"],
  BUSY: ["ONLINE", "OFFLINE"],
};

const server = jsonServer.create();
const router = jsonServer.router(DB_PATH);
const middlewares = jsonServer.defaults({ noCors: false });

server.use(middlewares);
server.use(jsonServer.bodyParser);

function db() {
  return router.db;
}

function ok(res, data, message = "Success", status = 200) {
  return res.status(status).json({ data, message });
}

function collection(res, data, message = "Success") {
  return res.status(200).json({
    data,
    meta: { total: data.length },
    message,
  });
}

function fail(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

function readAuth(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  return db().get("sessions").find({ token }).value() || null;
}

function requireAuth(req, res) {
  const session = readAuth(req);
  if (!session) {
    fail(res, 401, "UNAUTHORIZED", "Authentication required");
    return null;
  }
  return session;
}

function toSessionUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    avatar: user.avatar ?? null,
    role: user.role,
    status: user.status,
  };
}

function createSession(user) {
  const token = `mock-token-${user.id}-${Date.now()}`;
  const session = {
    id: `session-${Date.now()}`,
    token,
    userId: user.id,
    user: toSessionUser(user),
    createdAt: new Date().toISOString(),
  };
  db().get("sessions").push(session).write();
  return { token, user: session.user };
}

function canTransition(map, from, to) {
  return (map[from] || []).includes(to);
}

function getUserById(id) {
  return db().get("users").find({ id }).value();
}

function stripPassword(user) {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[\s-]/g, "");
}

function findUserByPhone(phone) {
  const normalized = normalizePhone(phone);
  return db()
    .get("users")
    .find((u) => normalizePhone(u.phone) === normalized)
    .value();
}

function queueOtp(email) {
  const now = new Date().toISOString();
  db().get("pendingOtps").remove({ email }).write();
  db().get("pendingOtps").push({ email, otp: MOCK_OTP, createdAt: now }).write();
}

// ——— Auth ———
server.post("/api/auth/login", (req, res) => {
  const { email, password, phone } = req.body || {};

  // Phone OTP challenge (Phase 2 primary UX)
  if (phone && !password) {
    const user = findUserByPhone(phone);
    if (!user) {
      return fail(res, 404, "RESOURCE_NOT_FOUND", "No account found for this phone number");
    }
    if (user.status === "SUSPENDED") {
      return fail(res, 403, "FORBIDDEN", "Account is suspended");
    }
    queueOtp(user.email);
    return ok(
      res,
      {
        email: user.email,
        phone: user.phone,
        message: "OTP sent. Use mock OTP 123456 (development only).",
      },
      "OTP sent",
    );
  }

  // Email + password (dev convenience / Phase 1 compatibility)
  const user = db().get("users").find({ email }).value();
  if (!user || user.password !== password) {
    return fail(res, 401, "UNAUTHORIZED", "Invalid email or password");
  }
  if (user.status === "SUSPENDED") {
    return fail(res, 403, "FORBIDDEN", "Account is suspended");
  }
  return ok(res, createSession(user), "Logged in");
});

server.post("/api/auth/signup", (req, res) => {
  const { name, email, phone, password, preferredRole } = req.body || {};
  if (!name || !email || !phone) {
    return fail(res, 422, "VALIDATION_ERROR", "Missing required fields");
  }
  if (db().get("users").find({ email }).value()) {
    return fail(res, 409, "CONFLICT", "Email already registered");
  }
  if (findUserByPhone(phone)) {
    return fail(res, 409, "CONFLICT", "Phone already registered");
  }
  const now = new Date().toISOString();
  const role = preferredRole === "DRIVER" ? "DRIVER" : "USER";
  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    avatar: null,
    role,
    status: "ACTIVE",
    password: password || `mock-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  db().get("users").push(user).write();
  if (role === "DRIVER") {
    db().get("drivers")
      .push({
        id: `driver-${Date.now()}`,
        userId: user.id,
        status: "ACTIVE",
        availability: "OFFLINE",
        rating: 5,
        totalTrips: 0,
        verificationStatus: "PENDING",
        documents: [],
        createdAt: now,
        updatedAt: now,
      })
      .write();
  }
  queueOtp(email);
  return ok(
    res,
    {
      email,
      phone,
      message: "Account created. Use mock OTP 123456 (development only).",
    },
    "Signup successful",
    201,
  );
});

server.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body || {};
  const pending = db().get("pendingOtps").find({ email }).value();
  const user = db().get("users").find({ email }).value();
  if (!user) return fail(res, 404, "RESOURCE_NOT_FOUND", "User not found");
  if (!pending) {
    return fail(res, 401, "UNAUTHORIZED", "OTP expired or not requested");
  }
  if (otp !== MOCK_OTP && pending.otp !== otp) {
    return fail(res, 401, "UNAUTHORIZED", "Invalid OTP");
  }
  db().get("pendingOtps").remove({ email }).write();
  return ok(res, createSession(user), "OTP verified");
});

server.post("/api/auth/resend-otp", (req, res) => {
  const { email } = req.body || {};
  const user = db().get("users").find({ email }).value();
  if (!user) return fail(res, 404, "RESOURCE_NOT_FOUND", "User not found");
  queueOtp(email);
  return ok(
    res,
    {
      email,
      phone: user.phone,
      message: "OTP resent. Use mock OTP 123456 (development only).",
    },
    "OTP resent",
  );
});

server.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name || !email || !phone || !subject || !message) {
    return fail(res, 422, "VALIDATION_ERROR", "Missing required fields");
  }
  if (!db().has("contactMessages").value()) {
    db().set("contactMessages", []).write();
  }
  const entry = {
    id: `contact-${Date.now()}`,
    name,
    email,
    phone,
    subject,
    message,
    createdAt: new Date().toISOString(),
  };
  db().get("contactMessages").push(entry).write();
  return ok(res, { id: entry.id }, "Message received", 201);
});

server.get("/api/auth/me", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const user = getUserById(session.userId);
  if (!user) return fail(res, 404, "RESOURCE_NOT_FOUND", "User not found");
  return ok(res, stripPassword(user));
});

server.post("/api/auth/logout", (req, res) => {
  const session = readAuth(req);
  if (session) {
    db().get("sessions").remove({ token: session.token }).write();
  }
  return ok(res, null, "Logged out");
});

server.post("/api/auth/select-role", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const { role } = req.body || {};
  if (!["USER", "DRIVER"].includes(role)) {
    return fail(res, 422, "VALIDATION_ERROR", "Role must be USER or DRIVER");
  }
  const user = getUserById(session.userId);
  if (!user) return fail(res, 404, "RESOURCE_NOT_FOUND", "User not found");

  if (role === "DRIVER") {
    let driver = db().get("drivers").find({ userId: user.id }).value();
    if (!driver) {
      const now = new Date().toISOString();
      driver = {
        id: `driver-${Date.now()}`,
        userId: user.id,
        status: "ACTIVE",
        availability: "OFFLINE",
        rating: 5,
        totalTrips: 0,
        verificationStatus: "PENDING",
        documents: [],
        createdAt: now,
        updatedAt: now,
      };
      db().get("drivers").push(driver).write();
    }
  }

  db().get("users").find({ id: user.id }).assign({ role, updatedAt: new Date().toISOString() }).write();
  db().get("sessions").find({ token: session.token }).assign({
    user: { ...toSessionUser(user), role },
  }).write();

  const updated = getUserById(user.id);
  return ok(res, { token: session.token, user: toSessionUser(updated) }, "Role selected");
});

// ——— Users ———
server.patch("/api/users/me", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const user = getUserById(session.userId);
  if (!user) return fail(res, 404, "RESOURCE_NOT_FOUND", "User not found");
  const allowed = ["name", "phone", "email", "avatar"];
  const patch = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) patch[key] = req.body[key];
  }
  const updated = { ...user, ...patch, updatedAt: new Date().toISOString() };
  db().get("users").find({ id: user.id }).assign(updated).write();
  return ok(res, stripPassword(updated));
});

server.get("/api/users/me", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  return ok(res, stripPassword(getUserById(session.userId)));
});

server.get("/api/users/me/bookings", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const data = db().get("bookings").filter({ userId: session.userId }).value();
  return collection(res, data);
});

server.get("/api/users/me/payments", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const data = db().get("payments").filter({ userId: session.userId }).value();
  return collection(res, data);
});

server.get("/api/users/me/notifications", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const data = db()
    .get("notifications")
    .filter({ recipientId: session.userId })
    .value();
  return collection(res, data);
});

server.get("/api/users/me/saved-places", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const data = db().get("savedPlaces").filter({ userId: session.userId }).value();
  return collection(res, data);
});


function pushNotification({ recipientId, recipientRole, type, title, message, data }) {
  const n = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    recipientId,
    recipientRole,
    type,
    title,
    message,
    read: false,
    data: data || null,
    createdAt: new Date().toISOString(),
  };
  db().get("notifications").push(n).write();
  return n;
}

function haversineKm(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.max(1, Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10);
}

/** Driver-service pricing — not vehicle rental / vehicle type */
const FARE_TABLE = {
  POINT_TO_POINT: { base: 180, perKm: 15 },
  HOURLY: { base: 350, perKm: 12 },
  FULL_DAY: { base: 900, perKm: 10 },
  AIRPORT: { base: 280, perKm: 16 },
  OUTSTATION: { base: 500, perKm: 14 },
};
const SERVICE_FEE = 40;

function estimateFare(pickup, destination, serviceType, scheduledAt) {
  const row = FARE_TABLE[serviceType] || FARE_TABLE.POINT_TO_POINT;
  const km = haversineKm(pickup, destination);
  let base = row.base;
  if (scheduledAt) base += 30;
  return base + Math.round(km * row.perKm) + SERVICE_FEE;
}

function fareBreakdown(pickup, destination, serviceType, scheduledAt) {
  const row = FARE_TABLE[serviceType] || FARE_TABLE.POINT_TO_POINT;
  const km = haversineKm(pickup, destination);
  let baseFare = row.base;
  if (scheduledAt) baseFare += 30;
  const distanceFare = Math.round(km * row.perKm);
  return {
    baseFare,
    distanceKm: km,
    distanceFare,
    serviceFee: SERVICE_FEE,
    estimatedTotal: baseFare + distanceFare + SERVICE_FEE,
    currency: "INR",
    isEstimate: true,
    serviceType,
  };
}

function simulateDispatch(bookingId) {
  const booking = db().get("bookings").find({ id: bookingId }).value();
  if (!booking) return { error: "Booking not found", status: 404 };
  if (!["REQUESTED", "SEARCHING"].includes(booking.status)) {
    return { error: `Cannot dispatch from status ${booking.status}`, status: 409 };
  }

  // SEARCHING
  if (booking.status === "REQUESTED") {
    db().get("bookings").find({ id: bookingId }).assign({
      status: "SEARCHING",
      updatedAt: new Date().toISOString(),
    }).write();
  }

  if (!booking.userVehicleId) {
    return { error: "Booking is missing userVehicleId", status: 422 };
  }
  const userVehicle = db()
    .get("userVehicles")
    .find({ id: booking.userVehicleId })
    .value();
  if (!userVehicle || userVehicle.userId !== booking.userId) {
    return { error: "Booking user vehicle is invalid", status: 422 };
  }

  const onlineDrivers = db()
    .get("drivers")
    .filter((d) => d.availability === "ONLINE" && d.verificationStatus === "VERIFIED")
    .value()
    .slice()
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const pool = onlineDrivers.length
    ? onlineDrivers
    : db()
        .get("drivers")
        .filter({ status: "ACTIVE" })
        .value()
        .slice()
        .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  if (!pool.length) {
    return { error: "No drivers available", status: 409 };
  }
  /**
   * MOCK DISPATCH ONLY — not product/business logic.
   * Prefer a stable seeded driver (`driver-2`) when online so local demos and
   * Playwright e2e stay deterministic. A real backend must use its own
   * matching/dispatch rules and must NOT hard-code this preference.
   */
  const preferred = pool.find((d) => d.id === "driver-2");
  const driver = preferred || pool[0];
  const now = new Date().toISOString();

  const updatedBooking = {
    ...db().get("bookings").find({ id: bookingId }).value(),
    driverId: driver.id,
    status: "DRIVER_ASSIGNED",
    updatedAt: now,
  };
  db().get("bookings").find({ id: bookingId }).assign(updatedBooking).write();

  let trip = db().get("trips").find({ bookingId }).value();
  if (!trip) {
    trip = {
      id: `trip-${Date.now()}`,
      bookingId,
      userId: updatedBooking.userId,
      driverId: driver.id,
      userVehicleId: updatedBooking.userVehicleId,
      pickup: updatedBooking.pickup,
      destination: updatedBooking.destination,
      startedAt: null,
      completedAt: null,
      status: "ASSIGNED",
      fare: null,
      createdAt: now,
    };
    db().get("trips").push(trip).write();
  } else {
    trip = {
      ...trip,
      driverId: driver.id,
      userVehicleId: updatedBooking.userVehicleId,
      status: "ASSIGNED",
    };
    db().get("trips").find({ id: trip.id }).assign(trip).write();
  }

  db().get("drivers").find({ id: driver.id }).assign({
    availability: "BUSY",
    updatedAt: now,
  }).write();

  pushNotification({
    recipientId: updatedBooking.userId,
    recipientRole: "USER",
    type: "BOOKING_UPDATE",
    title: "Driver assigned",
    message: "A driver has been assigned to your booking.",
    data: { bookingId, tripId: trip.id, driverId: driver.id },
  });

  const driverUser = db().get("users").find({ id: driver.userId }).value();
  if (driverUser) {
    pushNotification({
      recipientId: driverUser.id,
      recipientRole: "DRIVER",
      type: "TRIP_UPDATE",
      title: "New trip assigned",
      message: "You have a new trip assignment.",
      data: { bookingId, tripId: trip.id },
    });
  }

  return { booking: updatedBooking, trip };
}

function completeTripSideEffects(trip) {
  const now = new Date().toISOString();
  const booking = db().get("bookings").find({ id: trip.bookingId }).value();
  const fare = trip.fare || booking?.estimatedFare || 250;

  if (booking) {
    db().get("bookings").find({ id: booking.id }).assign({
      status: "CONFIRMED",
      finalFare: fare,
      updatedAt: now,
    }).write();
  }

  let payment = db().get("payments").find({ bookingId: trip.bookingId }).value();
  if (!payment) {
    payment = {
      id: `payment-${Date.now()}`,
      bookingId: trip.bookingId,
      userId: trip.userId,
      amount: fare,
      currency: "INR",
      method: "UPI",
      status: "PAID",
      transactionReference: `TXN-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    db().get("payments").push(payment).write();
  } else {
    payment = { ...payment, amount: fare, status: "PAID", updatedAt: now };
    db().get("payments").find({ id: payment.id }).assign(payment).write();
  }

  let earning = db().get("earnings").find({ tripId: trip.id }).value();
  let createdEarning = false;
  if (!earning) {
    const commission = Math.round(fare * 0.2);
    earning = {
      id: `earning-${Date.now()}`,
      driverId: trip.driverId,
      tripId: trip.id,
      grossAmount: fare,
      commission,
      netAmount: fare - commission,
      currency: "INR",
      status: "AVAILABLE",
      earnedAt: now,
      createdAt: now,
    };
    db().get("earnings").push(earning).write();
    createdEarning = true;
  }

  // Idempotent: only create wallet credit when a new earning was created
  if (createdEarning) {
    const txs = db()
      .get("walletTransactions")
      .filter({ driverId: trip.driverId })
      .value()
      .slice()
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
    const balance = txs.length ? txs[txs.length - 1].balanceAfter : 0;
    const net = earning.netAmount;
    db().get("walletTransactions").push({
      id: `wallet-${Date.now()}`,
      driverId: trip.driverId,
      type: "TRIP_EARNING",
      amount: net,
      balanceAfter: balance + net,
      referenceType: "Earning",
      referenceId: earning.id,
      description: "Trip earning",
      createdAt: now,
      status: "COMPLETED",
    }).write();

    const driver = db().get("drivers").find({ id: trip.driverId }).value();
    db().get("drivers").find({ id: trip.driverId }).assign({
      availability: "ONLINE",
      totalTrips: (driver?.totalTrips || 0) + 1,
      updatedAt: now,
    }).write();

    const driverUser = driver
      ? db().get("users").find({ id: driver.userId }).value()
      : null;
    if (driverUser) {
      pushNotification({
        recipientId: driverUser.id,
        recipientRole: "DRIVER",
        type: "EARNING",
        title: "Earning added",
        message: `₹${earning.netAmount} credited for your completed trip.`,
        data: { tripId: trip.id, earningId: earning.id },
      });
    }
  } else {
    db().get("drivers").find({ id: trip.driverId }).assign({
      availability: "ONLINE",
      updatedAt: now,
    }).write();
  }

  pushNotification({
    recipientId: trip.userId,
    recipientRole: "USER",
    type: "PAYMENT",
    title: "Payment successful",
    message: `Payment of ₹${fare} recorded for your completed trip.`,
    data: { bookingId: trip.bookingId, paymentId: payment.id, tripId: trip.id },
  });
  pushNotification({
    recipientId: trip.userId,
    recipientRole: "USER",
    type: "TRIP_UPDATE",
    title: "Trip completed",
    message: "Your trip has been completed. Thank you for booking with DriverDosth.",
    data: { bookingId: trip.bookingId, tripId: trip.id },
  });

  return { payment, earning };
}


// ——— Bookings ———
server.get("/api/bookings", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  let data = db().get("bookings").value();
  if (session.user.role === "USER") {
    data = data.filter((b) => b.userId === session.userId);
  } else if (session.user.role === "DRIVER") {
    const driver = db().get("drivers").find({ userId: session.userId }).value();
    data = data.filter((b) => b.driverId === driver?.id);
  }
  return collection(res, data);
});

server.get("/api/bookings/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const booking = db().get("bookings").find({ id: req.params.id }).value();
  if (!booking) return fail(res, 404, "RESOURCE_NOT_FOUND", "Booking not found");
  return ok(res, booking);
});

server.post("/api/bookings", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (session.user.role !== "USER") {
    return fail(res, 403, "FORBIDDEN", "Only users can create driver bookings");
  }
  const now = new Date().toISOString();
  const pickup = req.body.pickup;
  const destination = req.body.destination;
  const userVehicleId = req.body.userVehicleId;
  const serviceType = req.body.serviceType || "POINT_TO_POINT";
  const scheduledAt = req.body.scheduledAt ?? null;
  if (!pickup || !destination || !userVehicleId || !serviceType) {
    return fail(
      res,
      422,
      "VALIDATION_ERROR",
      "pickup, destination, userVehicleId and serviceType are required",
    );
  }
  if (!FARE_TABLE[serviceType]) {
    return fail(res, 422, "VALIDATION_ERROR", "Invalid serviceType");
  }
  const userVehicle = db().get("userVehicles").find({ id: userVehicleId }).value();
  if (!userVehicle || userVehicle.userId !== session.userId) {
    return fail(
      res,
      403,
      "FORBIDDEN",
      "You can only book a driver for your own vehicle",
    );
  }
  const estimatedFare = estimateFare(pickup, destination, serviceType, scheduledAt);
  const booking = {
    id: `booking-${Date.now()}`,
    userId: session.userId,
    driverId: null,
    userVehicleId,
    pickup,
    destination,
    scheduledAt,
    serviceType,
    estimatedFare,
    finalFare: null,
    status: "REQUESTED",
    createdAt: now,
    updatedAt: now,
  };
  db().get("bookings").push(booking).write();
  pushNotification({
    recipientId: session.userId,
    recipientRole: "USER",
    type: "BOOKING_UPDATE",
    title: "Booking requested",
    message: "Your driver booking was created. Searching for a driver next.",
    data: { bookingId: booking.id },
  });
  return ok(res, booking, "Booking created", 201);
});

server.patch("/api/bookings/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const booking = db().get("bookings").find({ id: req.params.id }).value();
  if (!booking) return fail(res, 404, "RESOURCE_NOT_FOUND", "Booking not found");
  if (req.body.status && !canTransition(bookingTransitions, booking.status, req.body.status)) {
    return fail(
      res,
      409,
      "CONFLICT",
      `Invalid booking transition: ${booking.status} → ${req.body.status}`,
    );
  }
  const updated = {
    ...booking,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  db().get("bookings").find({ id: req.params.id }).assign(updated).write();
  return ok(res, updated);
});

server.post("/api/bookings/:id/cancel", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const booking = db().get("bookings").find({ id: req.params.id }).value();
  if (!booking) return fail(res, 404, "RESOURCE_NOT_FOUND", "Booking not found");
  if (!canTransition(bookingTransitions, booking.status, "CANCELLED")) {
    return fail(res, 409, "CONFLICT", `Cannot cancel booking in status ${booking.status}`);
  }
  const updated = {
    ...booking,
    status: "CANCELLED",
    updatedAt: new Date().toISOString(),
  };
  db().get("bookings").find({ id: req.params.id }).assign(updated).write();
  const trip = db().get("trips").find({ bookingId: booking.id }).value();
  if (trip && canTransition(tripTransitions, trip.status, "CANCELLED")) {
    db().get("trips").find({ id: trip.id }).assign({ status: "CANCELLED" }).write();
  }
  pushNotification({
    recipientId: booking.userId,
    recipientRole: "USER",
    type: "BOOKING_UPDATE",
    title: "Booking cancelled",
    message: "Your booking was cancelled.",
    data: { bookingId: booking.id },
  });
  return ok(res, updated, "Booking cancelled");
});

server.post("/api/bookings/:id/dispatch", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const result = simulateDispatch(req.params.id);
  if (result.error) return fail(res, result.status, result.status === 404 ? "RESOURCE_NOT_FOUND" : "CONFLICT", result.error);
  return ok(res, result, "Driver assigned");
});

server.post("/api/bookings/estimate", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const { pickup, destination, serviceType, scheduledAt } = req.body || {};
  if (!pickup || !destination || !serviceType) {
    return fail(
      res,
      422,
      "VALIDATION_ERROR",
      "pickup, destination and serviceType are required",
    );
  }
  if (!FARE_TABLE[serviceType]) {
    return fail(res, 422, "VALIDATION_ERROR", "Invalid serviceType");
  }
  return ok(res, fareBreakdown(pickup, destination, serviceType, scheduledAt));
});

server.get("/api/bookings/:id/trip", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = db().get("trips").find({ bookingId: req.params.id }).value();
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found for booking");
  return ok(res, trip);
});

server.get("/api/bookings/:id/details", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const booking = db().get("bookings").find({ id: req.params.id }).value();
  if (!booking) return fail(res, 404, "RESOURCE_NOT_FOUND", "Booking not found");
  const trip = db().get("trips").find({ bookingId: booking.id }).value() || null;
  const driver = booking.driverId
    ? db().get("drivers").find({ id: booking.driverId }).value()
    : null;
  const driverUser = driver
    ? stripPassword(db().get("users").find({ id: driver.userId }).value())
    : null;
  const userVehicleId = booking.userVehicleId || trip?.userVehicleId;
  const userVehicle = userVehicleId
    ? db().get("userVehicles").find({ id: userVehicleId }).value()
    : null;
  const payment = db().get("payments").find({ bookingId: booking.id }).value() || null;
  return ok(res, { booking, trip, driver, driverUser, userVehicle, payment });
});

server.get("/api/drivers/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const driver = db().get("drivers").find({ id: req.params.id }).value();
  if (!driver) return fail(res, 404, "RESOURCE_NOT_FOUND", "Driver not found");
  const user = stripPassword(db().get("users").find({ id: driver.userId }).value());
  return ok(res, { ...driver, user });
});

// ——— Drivers ———
function requireDriver(req, res) {
  const session = requireAuth(req, res);
  if (!session) return null;
  const driver = db().get("drivers").find({ userId: session.userId }).value();
  if (!driver) {
    fail(res, 403, "FORBIDDEN", "Driver profile required");
    return null;
  }
  return { session, driver };
}

server.get("/api/drivers/me", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  return ok(res, ctx.driver);
});

server.patch("/api/drivers/me", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  const updated = {
    ...ctx.driver,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  db().get("drivers").find({ id: ctx.driver.id }).assign(updated).write();
  return ok(res, updated);
});

server.post("/api/drivers/me/status", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  const { availability } = req.body || {};
  if (!canTransition(availabilityTransitions, ctx.driver.availability, availability)) {
    return fail(
      res,
      409,
      "CONFLICT",
      `Invalid availability transition: ${ctx.driver.availability} → ${availability}`,
    );
  }
  if (availability === "OFFLINE") {
    const active = db()
      .get("trips")
      .filter(
        (t) =>
          t.driverId === ctx.driver.id &&
          ["ASSIGNED", "DRIVER_ARRIVING", "DRIVER_ARRIVED", "STARTED"].includes(
            t.status,
          ),
      )
      .value();
    if (active.length) {
      return fail(
        res,
        409,
        "CONFLICT",
        "You can't go offline while a trip is active.",
      );
    }
  }
  const updated = {
    ...ctx.driver,
    availability,
    updatedAt: new Date().toISOString(),
  };
  db().get("drivers").find({ id: ctx.driver.id }).assign(updated).write();
  return ok(res, updated);
});

server.get("/api/drivers/me/trips", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  const trips = db().get("trips").filter({ driverId: ctx.driver.id }).value();
  const enriched = trips.map((trip) => {
    const booking = db().get("bookings").find({ id: trip.bookingId }).value() || null;
    const userVehicle = trip.userVehicleId
      ? db().get("userVehicles").find({ id: trip.userVehicleId }).value()
      : null;
    const customer = stripPassword(db().get("users").find({ id: trip.userId }).value());
    return { ...trip, booking, userVehicle, customer };
  });
  return collection(res, enriched);
});

server.get("/api/drivers/me/earnings", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  return collection(
    res,
    db().get("earnings").filter({ driverId: ctx.driver.id }).value(),
  );
});

server.get("/api/drivers/me/wallet", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  return collection(
    res,
    db().get("walletTransactions").filter({ driverId: ctx.driver.id }).value(),
  );
});

server.get("/api/drivers/me/documents", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  return collection(
    res,
    db().get("documents").filter({ driverId: ctx.driver.id }).value(),
  );
});

// ——— Trips ———
function getTrip(id) {
  return db().get("trips").find({ id }).value();
}

function transitionTrip(req, res, nextStatus, extras = {}) {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = getTrip(req.params.id);
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found");
  if (!canTransition(tripTransitions, trip.status, nextStatus)) {
    return fail(
      res,
      409,
      "CONFLICT",
      `Invalid trip transition: ${trip.status} → ${nextStatus}`,
    );
  }
  const updated = { ...trip, status: nextStatus, ...extras };
  db().get("trips").find({ id: trip.id }).assign(updated).write();
  return ok(res, updated);
}

server.get("/api/trips/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = getTrip(req.params.id);
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found");
  return ok(res, trip);
});

server.post("/api/trips/:id/accept", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = getTrip(req.params.id);
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found");
  if (trip.status !== "ASSIGNED") {
    return fail(
      res,
      409,
      "CONFLICT",
      `Cannot accept trip in status ${trip.status}`,
    );
  }
  // Accept keeps trip ASSIGNED; booking becomes CONFIRMED (driver committed)
  const booking = db().get("bookings").find({ id: trip.bookingId }).value();
  if (booking && canTransition(bookingTransitions, booking.status, "CONFIRMED")) {
    db().get("bookings").find({ id: booking.id }).assign({
      status: "CONFIRMED",
      updatedAt: new Date().toISOString(),
    }).write();
  }
  pushNotification({
    recipientId: trip.userId,
    recipientRole: "USER",
    type: "BOOKING_UPDATE",
    title: "Driver assigned",
    message: "Your driver accepted the booking and will arrive soon.",
    data: { tripId: trip.id, bookingId: trip.bookingId },
  });
  return ok(res, trip, "Booking accepted");
});

server.post("/api/trips/:id/arriving", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = getTrip(req.params.id);
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found");
  if (!canTransition(tripTransitions, trip.status, "DRIVER_ARRIVING")) {
    return fail(
      res,
      409,
      "CONFLICT",
      `Invalid trip transition: ${trip.status} → DRIVER_ARRIVING`,
    );
  }
  const updated = { ...trip, status: "DRIVER_ARRIVING" };
  db().get("trips").find({ id: trip.id }).assign(updated).write();
  pushNotification({
    recipientId: trip.userId,
    recipientRole: "USER",
    type: "TRIP_UPDATE",
    title: "Your driver is arriving",
    message: "Your driver is on the way to pickup.",
    data: { tripId: trip.id, bookingId: trip.bookingId },
  });
  return ok(res, updated);
});

server.post("/api/trips/:id/reject", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = getTrip(req.params.id);
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found");
  if (!canTransition(tripTransitions, trip.status, "CANCELLED")) {
    return fail(
      res,
      409,
      "CONFLICT",
      `Cannot reject trip in status ${trip.status}`,
    );
  }
  const now = new Date().toISOString();
  db().get("trips").find({ id: trip.id }).assign({ status: "CANCELLED" }).write();
  const booking = db().get("bookings").find({ id: trip.bookingId }).value();
  // Return booking to SEARCHING so another driver can be assigned (mock)
  if (booking && ["DRIVER_ASSIGNED", "CONFIRMED"].includes(booking.status)) {
    db().get("bookings").find({ id: booking.id }).assign({
      status: "SEARCHING",
      driverId: null,
      updatedAt: now,
    }).write();
  }
  db().get("drivers").find({ id: trip.driverId }).assign({
    availability: "ONLINE",
    updatedAt: now,
  }).write();
  pushNotification({
    recipientId: trip.userId,
    recipientRole: "USER",
    type: "BOOKING_UPDATE",
    title: "Looking for another driver",
    message: "A driver declined. We are searching for another driver.",
    data: { bookingId: trip.bookingId },
  });
  return ok(res, { ...trip, status: "CANCELLED" }, "Trip rejected");
});
server.post("/api/trips/:id/arrived", (req, res) =>
  transitionTrip(req, res, "DRIVER_ARRIVED"),
);
server.post("/api/trips/:id/start", (req, res) =>
  transitionTrip(req, res, "STARTED", {
    startedAt: new Date().toISOString(),
  }),
);
server.post("/api/trips/:id/complete", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = getTrip(req.params.id);
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found");
  if (!canTransition(tripTransitions, trip.status, "COMPLETED")) {
    return fail(res, 409, "CONFLICT", `Invalid trip transition: ${trip.status} → COMPLETED`);
  }
  const booking = db().get("bookings").find({ id: trip.bookingId }).value();
  const fare = trip.fare ?? booking?.estimatedFare ?? 250;
  const updated = {
    ...trip,
    status: "COMPLETED",
    completedAt: new Date().toISOString(),
    fare,
  };
  db().get("trips").find({ id: trip.id }).assign(updated).write();
  completeTripSideEffects(updated);
  return ok(res, updated, "Trip completed");
});
server.post("/api/trips/:id/cancel", (req, res) =>
  transitionTrip(req, res, "CANCELLED"),
);

server.post("/api/trips/:id/advance", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = getTrip(req.params.id);
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found");
  const order = ["ASSIGNED", "DRIVER_ARRIVING", "DRIVER_ARRIVED", "STARTED", "COMPLETED"];
  const idx = order.indexOf(trip.status);
  if (idx < 0 || idx >= order.length - 1) {
    return fail(res, 409, "CONFLICT", `Cannot advance trip from ${trip.status}`);
  }
  const next = order[idx + 1];
  if (next === "COMPLETED") {
    req.url = `/api/trips/${trip.id}/complete`;
    // inline complete
    const booking = db().get("bookings").find({ id: trip.bookingId }).value();
    const fare = trip.fare ?? booking?.estimatedFare ?? 250;
    const updated = {
      ...trip,
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
      fare,
      startedAt: trip.startedAt || new Date().toISOString(),
    };
    db().get("trips").find({ id: trip.id }).assign(updated).write();
    completeTripSideEffects(updated);
    return ok(res, updated, "Trip advanced to COMPLETED");
  }
  const extras = {};
  if (next === "STARTED") extras.startedAt = new Date().toISOString();
  const updated = { ...trip, status: next, ...extras };
  db().get("trips").find({ id: trip.id }).assign(updated).write();
  const titles = {
    DRIVER_ARRIVING: "Your driver is arriving",
    DRIVER_ARRIVED: "Driver has arrived",
    STARTED: "Trip started",
  };
  if (titles[next]) {
    pushNotification({
      recipientId: trip.userId,
      recipientRole: "USER",
      type: "TRIP_UPDATE",
      title: titles[next],
      message: titles[next],
      data: { tripId: trip.id, bookingId: trip.bookingId },
    });
  }
  return ok(res, updated, `Trip advanced to ${next}`);
});

// ——— Payments / wallet / notifications / misc ———
server.get("/api/payments", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  let data = db().get("payments").value();
  if (session.user.role === "USER") {
    data = data.filter((p) => p.userId === session.userId);
  }
  return collection(res, data);
});

server.get("/api/payments/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const payment = db().get("payments").find({ id: req.params.id }).value();
  if (!payment) return fail(res, 404, "RESOURCE_NOT_FOUND", "Payment not found");
  return ok(res, payment);
});

server.post("/api/payments", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const now = new Date().toISOString();
  const payment = {
    id: `payment-${Date.now()}`,
    bookingId: req.body.bookingId,
    userId: session.userId,
    amount: req.body.amount,
    currency: req.body.currency || "INR",
    method: req.body.method,
    status: "PENDING",
    transactionReference: `TXN-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  db().get("payments").push(payment).write();
  return ok(res, payment, "Payment created", 201);
});

server.get("/api/wallet", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  const txs = db()
    .get("walletTransactions")
    .filter({ driverId: ctx.driver.id })
    .value();
  const balance = txs.length ? txs[txs.length - 1].balanceAfter : 0;
  return ok(res, {
    balance,
    currency: "INR",
    driverId: ctx.driver.id,
  });
});

server.get("/api/wallet/transactions", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  return collection(
    res,
    db().get("walletTransactions").filter({ driverId: ctx.driver.id }).value(),
  );
});

/** Mock withdrawal — not a real bank payout */
server.post("/api/wallet/withdraw", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  const amount = Number(req.body?.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return fail(res, 422, "VALIDATION_ERROR", "Amount must be greater than zero");
  }
  const txs = db()
    .get("walletTransactions")
    .filter({ driverId: ctx.driver.id })
    .value()
    .slice()
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const balance = txs.length ? txs[txs.length - 1].balanceAfter : 0;
  if (amount > balance) {
    return fail(res, 422, "VALIDATION_ERROR", "Amount exceeds available balance");
  }
  const now = new Date().toISOString();
  const tx = {
    id: `wallet-${Date.now()}`,
    driverId: ctx.driver.id,
    type: "WITHDRAWAL",
    amount: -amount,
    balanceAfter: balance - amount,
    referenceType: "Withdrawal",
    referenceId: `wd-${Date.now()}`,
    description: "Mock withdrawal",
    createdAt: now,
    status: "COMPLETED",
  };
  db().get("walletTransactions").push(tx).write();
  pushNotification({
    recipientId: ctx.session.userId,
    recipientRole: "DRIVER",
    type: "EARNING",
    title: "Withdrawal processed",
    message: `Mock withdrawal of ₹${amount} completed.`,
    data: { transactionId: tx.id },
  });
  return ok(
    res,
    {
      transaction: tx,
      balance: tx.balanceAfter,
      currency: "INR",
      driverId: ctx.driver.id,
    },
    "Withdrawal recorded",
    201,
  );
});

server.get("/api/notifications", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  return collection(
    res,
    db().get("notifications").filter({ recipientId: session.userId }).value(),
  );
});

server.patch("/api/notifications/:id/read", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const n = db().get("notifications").find({ id: req.params.id }).value();
  if (!n) return fail(res, 404, "RESOURCE_NOT_FOUND", "Notification not found");
  const updated = { ...n, read: true };
  db().get("notifications").find({ id: n.id }).assign(updated).write();
  return ok(res, updated);
});

server.patch("/api/notifications/read-all", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const items = db()
    .get("notifications")
    .filter({ recipientId: session.userId, read: false })
    .value();
  items.forEach((n) => {
    db().get("notifications").find({ id: n.id }).assign({ read: true }).write();
  });
  return ok(res, { updated: items.length });
});

// ——— User vehicles (owned by User — never by Driver) ———
server.get("/api/users/me/vehicles", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (session.user.role !== "USER") {
    return fail(res, 403, "FORBIDDEN", "Only users manage vehicles");
  }
  return collection(
    res,
    db().get("userVehicles").filter({ userId: session.userId }).value(),
  );
});

server.get("/api/users/me/vehicles/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (session.user.role !== "USER") {
    return fail(res, 403, "FORBIDDEN", "Only users manage vehicles");
  }
  const v = db().get("userVehicles").find({ id: req.params.id }).value();
  if (!v || v.userId !== session.userId) {
    return fail(res, 404, "RESOURCE_NOT_FOUND", "Vehicle not found");
  }
  return ok(res, v);
});

server.post("/api/users/me/vehicles", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (session.user.role !== "USER") {
    return fail(res, 403, "FORBIDDEN", "Only users manage vehicles");
  }
  const body = req.body || {};
  if (!body.make || !body.model || !body.registrationNumber) {
    return fail(res, 422, "VALIDATION_ERROR", "make, model and registrationNumber are required");
  }
  const now = new Date().toISOString();
  const vehicle = {
    id: `vehicle-${Date.now()}`,
    userId: session.userId,
    make: body.make,
    model: body.model,
    year: body.year || new Date().getFullYear(),
    registrationNumber: body.registrationNumber,
    color: body.color || "Unknown",
    vehicleType: body.vehicleType || "SEDAN",
    capacity: body.capacity || 4,
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };
  db().get("userVehicles").push(vehicle).write();
  return ok(res, vehicle, "Vehicle added", 201);
});

server.patch("/api/users/me/vehicles/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (session.user.role !== "USER") {
    return fail(res, 403, "FORBIDDEN", "Only users manage vehicles");
  }
  const existing = db().get("userVehicles").find({ id: req.params.id }).value();
  if (!existing || existing.userId !== session.userId) {
    return fail(res, 404, "RESOURCE_NOT_FOUND", "Vehicle not found");
  }
  const { userId: _ignore, id: _id, ...patch } = req.body || {};
  const updated = {
    ...existing,
    ...patch,
    userId: existing.userId,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };
  db().get("userVehicles").find({ id: existing.id }).assign(updated).write();
  return ok(res, updated);
});

server.delete("/api/users/me/vehicles/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (session.user.role !== "USER") {
    return fail(res, 403, "FORBIDDEN", "Only users manage vehicles");
  }
  const existing = db().get("userVehicles").find({ id: req.params.id }).value();
  if (!existing || existing.userId !== session.userId) {
    return fail(res, 404, "RESOURCE_NOT_FOUND", "Vehicle not found");
  }
  db().get("userVehicles").remove({ id: existing.id }).write();
  return ok(res, null, "Vehicle deleted");
});

/** Trip detail with customer vehicle — drivers may view assigned trips only */
server.get("/api/trips/:id/details", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const trip = getTrip(req.params.id);
  if (!trip) return fail(res, 404, "RESOURCE_NOT_FOUND", "Trip not found");
  if (session.user.role === "USER" && trip.userId !== session.userId) {
    return fail(res, 403, "FORBIDDEN", "Not your trip");
  }
  if (session.user.role === "DRIVER") {
    const driver = db().get("drivers").find({ userId: session.userId }).value();
    if (!driver || trip.driverId !== driver.id) {
      return fail(res, 403, "FORBIDDEN", "Not your assigned trip");
    }
  }
  const booking = db().get("bookings").find({ id: trip.bookingId }).value() || null;
  const userVehicle = trip.userVehicleId
    ? db().get("userVehicles").find({ id: trip.userVehicleId }).value()
    : null;
  const customer = stripPassword(db().get("users").find({ id: trip.userId }).value());
  return ok(res, { trip, booking, userVehicle, customer });
});

server.get("/api/earnings", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  return collection(
    res,
    db().get("earnings").filter({ driverId: ctx.driver.id }).value(),
  );
});

server.get("/api/documents", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  return collection(
    res,
    db().get("documents").filter({ driverId: ctx.driver.id }).value(),
  );
});

/** Mock document upload — no real file storage */
server.post("/api/documents", (req, res) => {
  const ctx = requireDriver(req, res);
  if (!ctx) return;
  const type = req.body?.type;
  const allowed = [
    "IDENTITY",
    "DRIVERS_LICENSE",
    "BACKGROUND_CHECK",
    "PROFILE_PHOTO",
  ];
  if (!allowed.includes(type)) {
    return fail(res, 422, "VALIDATION_ERROR", "Invalid document type");
  }
  const fileName = req.body?.fileName || "document.pdf";
  const now = new Date().toISOString();
  const doc = {
    id: `doc-${Date.now()}`,
    driverId: ctx.driver.id,
    type,
    fileUrl: `https://cdn.example.test/mock/${encodeURIComponent(fileName)}`,
    status: "PENDING",
    expiresAt: req.body?.expiresAt || null,
    rejectionReason: null,
    uploadedAt: now,
    reviewedAt: null,
  };
  db().get("documents").push(doc).write();
  const docs = ctx.driver.documents || [];
  if (!docs.includes(doc.id)) {
    db().get("drivers").find({ id: ctx.driver.id }).assign({
      documents: [...docs, doc.id],
      updatedAt: now,
    }).write();
  }
  pushNotification({
    recipientId: ctx.session.userId,
    recipientRole: "DRIVER",
    type: "DOCUMENT",
    title: "Document uploaded",
    message: "Your document was submitted for review (mock).",
    data: { documentId: doc.id },
  });
  return ok(res, doc, "Document uploaded", 201);
});

server.get("/api/ratings", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  return collection(res, db().get("ratings").value());
});

server.post("/api/ratings", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const rating = {
    id: `rating-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db().get("ratings").push(rating).write();
  return ok(res, rating, "Rating created", 201);
});

server.get("/api/saved-places", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  return collection(
    res,
    db().get("savedPlaces").filter({ userId: session.userId }).value(),
  );
});

server.post("/api/saved-places", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const place = {
    id: `place-${Date.now()}`,
    userId: session.userId,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db().get("savedPlaces").push(place).write();
  return ok(res, place, "Saved place created", 201);
});

server.patch("/api/saved-places/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const place = db().get("savedPlaces").find({ id: req.params.id }).value();
  if (!place || place.userId !== session.userId) {
    return fail(res, 404, "RESOURCE_NOT_FOUND", "Saved place not found");
  }
  const updated = { ...place, ...req.body, userId: session.userId };
  db().get("savedPlaces").find({ id: place.id }).assign(updated).write();
  return ok(res, updated);
});

server.delete("/api/saved-places/:id", (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  db().get("savedPlaces").remove({ id: req.params.id }).write();
  return ok(res, null, "Deleted");
});

// Fallback raw resources (debug)
server.use("/api/raw", router);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`DriverDosth mock API running at http://localhost:${PORT}`);
    console.log(`Mock OTP (dev only): ${MOCK_OTP}`);
    console.log(`Test users: user@example.test / driver@example.test (password123)`);
  });
}

module.exports = server;
