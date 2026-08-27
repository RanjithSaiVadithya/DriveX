import { publicRoutes, userRoutes, driverRoutes, authRoutes } from "./routes";

export const publicNav = [
  { label: "About", href: publicRoutes.about },
  { label: "How it works", href: publicRoutes.howItWorks },
  { label: "Safety", href: publicRoutes.safety },
  { label: "Contact", href: publicRoutes.contact },
  { label: "Drive with us", href: publicRoutes.driveWithUs },
] as const;

export const authNav = [
  { label: "Log in", href: authRoutes.login },
  { label: "Sign up", href: authRoutes.signup },
] as const;

export const userNav = [
  { label: "Home", href: userRoutes.home },
  { label: "Book", href: userRoutes.book },
  { label: "Bookings", href: userRoutes.bookings },
  { label: "Payments", href: userRoutes.payments },
  { label: "Notifications", href: userRoutes.notifications },
  { label: "Saved places", href: userRoutes.savedPlaces },
  { label: "Profile", href: userRoutes.profile },
] as const;

export const driverNav = [
  { label: "Home", href: driverRoutes.home },
  { label: "Trips", href: driverRoutes.trips },
  { label: "Earnings", href: driverRoutes.earnings },
  { label: "Wallet", href: driverRoutes.wallet },
  { label: "Documents", href: driverRoutes.documents },
  { label: "Notifications", href: driverRoutes.notifications },
  { label: "Profile", href: driverRoutes.profile },
  { label: "Settings", href: driverRoutes.settings },
] as const;
