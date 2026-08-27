export const publicRoutes = {
  home: "/",
  about: "/about",
  howItWorks: "/how-it-works",
  safety: "/safety",
  contact: "/contact",
  driveWithUs: "/drive-with-us",
} as const;

export const authRoutes = {
  login: "/login",
  signup: "/signup",
  verifyOtp: "/verify-otp",
  selectRole: "/select-role",
} as const;

export const userRoutes = {
  home: "/user",
  book: "/user/book",
  bookings: "/user/bookings",
  bookingDetail: (id: string) => `/user/bookings/${id}`,
  payments: "/user/payments",
  notifications: "/user/notifications",
  savedPlaces: "/user/saved-places",
  vehicles: "/user/vehicles",
  profile: "/user/profile",
} as const;

export const driverRoutes = {
  home: "/driver",
  trips: "/driver/trips",
  tripDetail: (id: string) => `/driver/trips/${id}`,
  earnings: "/driver/earnings",
  wallet: "/driver/wallet",
  documents: "/driver/documents",
  notifications: "/driver/notifications",
  profile: "/driver/profile",
  settings: "/driver/settings",
} as const;

export const indexablePaths = Object.values(publicRoutes);

export const noIndexPathPrefixes = [
  "/login",
  "/signup",
  "/verify-otp",
  "/select-role",
  "/user",
  "/driver",
] as const;
