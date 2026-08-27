/**
 * Central API endpoint definitions.
 * Map these to the real backend later without rewriting components.
 */
export const endpoints = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    verifyOtp: "/api/auth/verify-otp",
    resendOtp: "/api/auth/resend-otp",
    me: "/api/auth/me",
    logout: "/api/auth/logout",
    selectRole: "/api/auth/select-role",
  },
  contact: {
    submit: "/api/contact",
  },
  users: {
    me: "/api/users/me",
    updateMe: "/api/users/me",
    bookings: "/api/users/me/bookings",
    payments: "/api/users/me/payments",
    notifications: "/api/users/me/notifications",
    savedPlaces: "/api/users/me/saved-places",
  },
  userVehicles: {
    list: "/api/users/me/vehicles",
    detail: (id: string) => `/api/users/me/vehicles/${id}`,
    create: "/api/users/me/vehicles",
    update: (id: string) => `/api/users/me/vehicles/${id}`,
    remove: (id: string) => `/api/users/me/vehicles/${id}`,
  },
  bookings: {
    list: "/api/bookings",
    detail: (id: string) => `/api/bookings/${id}`,
    create: "/api/bookings",
    update: (id: string) => `/api/bookings/${id}`,
    cancel: (id: string) => `/api/bookings/${id}/cancel`,
    dispatch: (id: string) => `/api/bookings/${id}/dispatch`,
    estimate: "/api/bookings/estimate",
    trip: (id: string) => `/api/bookings/${id}/trip`,
    details: (id: string) => `/api/bookings/${id}/details`,
  },
  drivers: {
    me: "/api/drivers/me",
    detail: (id: string) => `/api/drivers/${id}`,
    updateMe: "/api/drivers/me",
    status: "/api/drivers/me/status",
    trips: "/api/drivers/me/trips",
    earnings: "/api/drivers/me/earnings",
    wallet: "/api/drivers/me/wallet",
    documents: "/api/drivers/me/documents",
  },
  trips: {
    detail: (id: string) => `/api/trips/${id}`,
    details: (id: string) => `/api/trips/${id}/details`,
    accept: (id: string) => `/api/trips/${id}/accept`,
    arriving: (id: string) => `/api/trips/${id}/arriving`,
    reject: (id: string) => `/api/trips/${id}/reject`,
    start: (id: string) => `/api/trips/${id}/start`,
    arrived: (id: string) => `/api/trips/${id}/arrived`,
    complete: (id: string) => `/api/trips/${id}/complete`,
    cancel: (id: string) => `/api/trips/${id}/cancel`,
    advance: (id: string) => `/api/trips/${id}/advance`,
  },
  payments: {
    list: "/api/payments",
    detail: (id: string) => `/api/payments/${id}`,
    create: "/api/payments",
  },
  wallet: {
    summary: "/api/wallet",
    transactions: "/api/wallet/transactions",
    withdraw: "/api/wallet/withdraw",
  },
  notifications: {
    list: "/api/notifications",
    read: (id: string) => `/api/notifications/${id}/read`,
    readAll: "/api/notifications/read-all",
  },
  earnings: {
    list: "/api/earnings",
  },
  documents: {
    list: "/api/documents",
    create: "/api/documents",
  },
  ratings: {
    list: "/api/ratings",
    create: "/api/ratings",
  },
  savedPlaces: {
    list: "/api/saved-places",
    create: "/api/saved-places",
    update: (id: string) => `/api/saved-places/${id}`,
    remove: (id: string) => `/api/saved-places/${id}`,
  },
} as const;
