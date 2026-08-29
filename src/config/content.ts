import { publicRoutes, authRoutes } from "./routes";

export const publicContent = {
  brandTagline: "Safe. Reliable. Always.",
  hero: {
    eyebrow: "Safe. Reliable. Always.",
    titleLine1: "Your Driver,",
    titleLine2: "Your Way",
    description:
      "Book verified drivers who drive your own vehicle — instantly for today, or schedule for later. Clear fares, live trip updates, and support when you need it.",
    primaryCta: "Book a Driver",
    secondaryCta: "Drive With Us",
  },
  features: [
    {
      icon: "Zap",
      title: "Quick Bookings",
      description:
        "Request a driving service in a few steps and get matched with an available driver.",
    },
    {
      icon: "ShieldCheck",
      title: "Trusted Drivers",
      description: "Drivers complete onboarding and document checks before going online.",
    },
    {
      icon: "Wallet",
      title: "Affordable Pricing",
      description:
        "See driver-service fare estimates before you confirm so you know what to expect.",
    },
    {
      icon: "Headphones",
      title: "24/7 Support",
      description:
        "Reach support through in-app channels when you need help with a trip.",
    },
  ],
  howItWorksSteps: [
    {
      step: "01",
      title: "Add your vehicle",
      description: "Register the car you own so a driver can operate it for your trip.",
    },
    {
      step: "02",
      title: "Book a driver",
      description: "Set pickup, destination, timing, and the driving service you need.",
    },
    {
      step: "03",
      title: "Meet your driver",
      description: "Your driver arrives and drives your vehicle to the destination.",
    },
    {
      step: "04",
      title: "Complete the trip",
      description:
        "Pay for the driving service, and both sides keep a shared trip record.",
    },
  ],
  userBenefits: [
    {
      title: "Easy driver booking",
      description: "A clear flow from pickup to confirmation.",
    },
    {
      title: "Your vehicle, your trip",
      description: "Drivers provide the service — you provide the vehicle.",
    },
    {
      title: "Reliable drivers",
      description: "Verified profiles and document status before trips.",
    },
    {
      title: "Transparent pricing",
      description: "Driver-service estimates up front with final fare on completion.",
    },
    {
      title: "Live trip updates",
      description: "Status changes as your driver arrives and the trip progresses.",
    },
    {
      title: "Support when needed",
      description: "Contact options for trip and account questions.",
    },
  ],
  driverRecruit: {
    title: "Drive, Earn, Grow",
    description:
      "Join DriveX as a driver. Provide driving services for customers who bring their own vehicles — flexible hours and clear earnings.",
    points: [
      "Flexible hours",
      "Weekly payouts (planned)",
      "Bonuses & incentives (planned)",
      "Driver support",
    ],
    cta: "Join as a Driver",
  },
  safetyHighlights: [
    {
      title: "Verified drivers",
      description: "Identity and licence checks are part of driver onboarding.",
    },
    {
      title: "Trip information",
      description: "Shared booking and trip records for users and drivers.",
    },
    {
      title: "User controls",
      description: "Cancel and status flows designed to keep both sides informed.",
    },
    {
      title: "Support channels",
      description: "Contact and help pathways for issues during or after a trip.",
    },
  ],
  popularCities: {
    note: "Explore the places, landmarks, and everyday journeys that shape the DriveX experience.",
    cities: [
      {
        name: "Bengaluru",
        region: "Karnataka",
        description: "India’s technology and startup hub.",
        image: "/images/bengaluru-city.webp",
        alt: "Bengaluru skyline and Bangalore Palace",
      },
      {
        name: "Mumbai",
        region: "Maharashtra",
        description: "India’s financial capital by the Arabian Sea.",
        image: "/images/mumbai-city.webp",
        alt: "Mumbai coastline and city skyline",
      },
      {
        name: "Hyderabad",
        region: "Telangana",
        description: "A city of heritage, technology, and culture.",
        image: "/images/hyderabad-city.webp",
        alt: "Charminar in Hyderabad at sunset",
      },
      {
        name: "Chennai",
        region: "Tamil Nadu",
        description: "A coastal city known for Marina Beach and mobility.",
        image: "/images/chennai-city.webp",
        alt: "Chennai coastline and Marina Beach",
      },
      {
        name: "New Delhi",
        region: "Delhi",
        description: "India’s capital with broad, historic avenues.",
        image: "/images/delhi-city.webp",
        alt: "India Gate in New Delhi",
      },
    ],
  },
  testimonialsDemo: {
    note: "Demo quotes for layout only — not verified customer reviews.",
    items: [
      {
        quote: "Booking a driver for my own car was straightforward and easy to follow.",
        name: "Demo User",
        role: "Sample feedback",
      },
      {
        quote:
          "I see the customer's vehicle details before I accept — that makes trips clear.",
        name: "Demo Driver",
        role: "Sample feedback",
      },
    ],
  },
  faq: [
    {
      question: "How do I book a driver?",
      answer:
        "Create an account, choose User, add your vehicle, then open Book a Driver to set pickup, destination, timing, and driving service. Confirm to start the search for a driver.",
    },
    {
      question: "Do I need my own vehicle?",
      answer:
        "Yes. DriveX is a driver-booking platform. You register your vehicle; the driver provides the driving service.",
    },
    {
      question: "How do I cancel a booking?",
      answer:
        "Open your booking and cancel while the status still allows cancellation. Cancelled bookings cannot be restarted.",
    },
    {
      question: "How do I become a driver?",
      answer:
        "Sign up, verify with OTP, select Driver, then complete onboarding and verification documents. You do not need to register a vehicle to drive with DriveX.",
    },
    {
      question: "How does payment work?",
      answer:
        "Phase 1–3 use mock payments for the driving service only. Real payment providers will be integrated in a later phase.",
    },
    {
      question: "Can I schedule a driver?",
      answer:
        "Yes. Choose Schedule for later during booking and pick a future date and time.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Use the Contact page for product and partnership questions. In-app support expands with later releases.",
    },
  ],
  about: {
    heroTitle: "About DriveX",
    intro:
      "DriveX is a driver-booking platform. Users own the vehicle; drivers provide the driving service. Bookings and trips are shared domain records — not duplicated silos. We build for clarity, reliability, and safer everyday trips.",
    mission:
      "Build a reliable platform that makes booking a driver simple for users who bring their own vehicles.",
    vision:
      "Make every journey easier and more reliable through clear product design and trustworthy operations.",
    stats: [
      { value: "10K+", label: "Happy Riders" },
      { value: "5K+", label: "Trusted Drivers" },
      { value: "50K+", label: "Rides Completed" },
      { value: "20+", label: "Cities" },
    ],
    statsNote:
      "Illustrative targets for the product roadmap — not live production metrics.",
  },
  contact: {
    intro:
      "Questions about DriveX, partnerships, or the product roadmap? Reach out — we usually respond within one business day.",
    placeholders: {
      phone: "+91 1800 000 000",
      email: "hello@drivex.example",
      address: "Bengaluru, India",
      support: "Mon–Sun · 8:00 AM – 10:00 PM IST",
    },
  },
  driveWithUs: {
    heroTitle: "Earn by providing driving services",
    heroDescription:
      "Drive with DriveX. Complete verification, go online, accept driver requests for customers' vehicles, and grow with shared trip and earnings records.",
    why: [
      { title: "Flexible hours", description: "Go online when it works for you." },
      {
        title: "Clear trip history",
        description:
          "The same trip users see — one shared record, including customer vehicle details.",
      },
      {
        title: "Earnings visibility",
        description: "Track earnings for driving services in the driver app.",
      },
      {
        title: "Document workflow",
        description:
          "Upload and track verification status for required driver documents.",
      },
    ],
    onboarding: [
      "Create your account",
      "Verify with OTP",
      "Select Driver role",
      "Complete profile & verification documents",
      "Go online and accept driver requests",
    ],
    requirements: [
      "Valid driving licence",
      "Identity document",
      "Background verification",
      "Profile photo",
    ],
    cta: "Start Driver Registration",
  },
  footer: {
    description:
      "DriveX connects users with drivers who drive the user's own vehicle — safe, reliable driving service with clear trip records.",
  },
} as const;

export const publicNavItems = [
  { label: "Home", href: publicRoutes.home },
  { label: "About Us", href: publicRoutes.about },
  { label: "How It Works", href: publicRoutes.howItWorks },
  { label: "Safety", href: publicRoutes.safety },
  { label: "Contact", href: publicRoutes.contact },
] as const;

export const footerCompanyLinks = [
  { label: "About Us", href: publicRoutes.about },
  { label: "How It Works", href: publicRoutes.howItWorks },
  { label: "Safety", href: publicRoutes.safety },
  { label: "Drive With Us", href: publicRoutes.driveWithUs },
] as const;

export const footerSupportLinks = [
  { label: "Contact Us", href: publicRoutes.contact },
  { label: "FAQ", href: `${publicRoutes.home}#faq` },
  { label: "Log in", href: authRoutes.login },
] as const;
