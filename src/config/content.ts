import { publicRoutes, authRoutes } from "./routes";

export const publicContent = {
  brandTagline: "Safe. Reliable. Always.",
  safetyFlow: {
    eyebrow: "Safety",
    title: "Safety you can see in the flow",
    description:
      "Trust is built through visible product steps — from driver verification to a complete, shared trip record.",
    clarityTitle: "Built for clarity.",
    clarityDescription: "See what has happened, what is happening, and what comes next.",
    steps: [
      {
        number: "01",
        icon: "FileCheck2",
        title: "Driver verification",
        description:
          "Drivers submit required identity and licence documents during onboarding, with verification status tracked before trips begin.",
        status: "Verification status tracked",
        previewFocus: "Driver verification",
        previewDetail: "Documents and status checked before trips begin",
      },
      {
        number: "02",
        icon: "Route",
        title: "One shared trip record",
        description:
          "Pickup, destination, User vehicle, fare estimate, and Driver assignment stay connected to one booking and Trip.",
        status: "Booking → Trip → Payment",
        previewFocus: "One shared trip record",
        previewDetail: "Booking, vehicle, Driver, and fare stay connected",
      },
      {
        number: "03",
        icon: "BellRing",
        title: "Status you can follow",
        description:
          "Both sides can follow the trip from assigned to arriving, arrived, started, and completed.",
        status: "Live status transitions",
        previewFocus: "Live trip status",
        previewDetail: "Follow each transition as the Trip progresses",
      },
      {
        number: "04",
        icon: "CheckCircle2",
        title: "Clear closeout",
        description:
          "The final fare, payment record, driver earning, and notifications stay tied back to the completed trip.",
        status: "Completion recorded",
        previewFocus: "Clear closeout",
        previewDetail: "Completion, payment, and earning records are connected",
      },
    ],
    preview: {
      eyebrow: "Product preview",
      title: "Trip in progress",
      completedTitle: "Trip completed",
      vehicleLabel: "Your vehicle",
      vehicleRegistration: "KA 01 AB 1234",
      vehicleName: "Toyota Fortuner",
      statusLabel: "Driver status",
      statuses: ["Assigned", "Arriving", "Started", "Completed"],
      fareLabel: "Trip fare",
      fare: "₹750",
      detailsCta: "View trip details",
      demoLabel: "Demo product view",
    },
    ctaTitle: "One trip. One shared record. Clear from start to finish.",
    ctaLabel: "Explore safety",
  },
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
      eyebrow: "Ownership",
      title: "Your vehicle, your booking",
      description:
        "Book a Driver for the vehicle you own, with pickup, destination, and timing in one clear flow.",
    },
    {
      icon: "ShieldCheck",
      eyebrow: "Trust",
      title: "Verified Drivers",
      description:
        "Drivers complete onboarding and document checks before accepting Trip requests.",
    },
    {
      icon: "Route",
      eyebrow: "Clarity",
      title: "One shared Trip record",
      description:
        "Users and Drivers stay aligned on the same booking, status updates, vehicle details, and completion history.",
    },
    {
      icon: "Wallet",
      eyebrow: "Transparency",
      title: "Clear fares upfront",
      description:
        "Review the driving-service fare estimate before you confirm the Trip.",
    },
  ],
  journeys: {
    user: [
      {
        step: "01",
        title: "Add your vehicle",
        description: "Register the car you own so a Driver can operate it for your Trip.",
      },
      {
        step: "02",
        title: "Book a Driver",
        description: "Set pickup, destination, timing, and the driving service you need.",
      },
      {
        step: "03",
        title: "Meet your Driver",
        description: "Your Driver arrives and operates your vehicle to the destination.",
      },
      {
        step: "04",
        title: "Complete the Trip",
        description:
          "Pay for the driving service, and both sides keep a shared Trip record.",
      },
    ],
    driver: [
      {
        step: "01",
        title: "Register as a Driver",
        description:
          "Create your profile and submit the documents needed for verification.",
      },
      {
        step: "02",
        title: "Go online",
        description: "Choose when you are available to receive Trip requests.",
      },
      {
        step: "03",
        title: "Review the request",
        description:
          "See pickup, destination, User vehicle, and fare details before accepting.",
      },
      {
        step: "04",
        title: "Complete the Trip",
        description:
          "Meet the User, operate their vehicle, and close out the shared Trip.",
      },
    ],
  },
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
      "Join DriverDosth as a Driver. Provide driving services for Users who bring their own vehicles — flexible hours and clear earnings.",
    points: ["Flexible hours", "Clear earnings records", "Driver support"],
    cta: "Join as a Driver",
  },
  popularCities: {
    note: "Explore the places, landmarks, and everyday journeys that shape the DriverDosth experience.",
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
  experienceHighlights: {
    note: "A clearer experience for every part of the Trip.",
    items: [
      {
        title: "Your vehicle stays yours",
        description:
          "Book a Driver to operate the vehicle you own, with the Trip details you expect in one place.",
      },
      {
        title: "One shared Trip record",
        description:
          "Users and Drivers see the same booking, status updates, fare details, and completion history.",
      },
      {
        title: "Clarity from start to finish",
        description:
          "Clear steps and visible status changes help everyone know what has happened and what comes next.",
      },
    ],
  },
  faq: [
    {
      question: "What does DriverDosth book?",
      answer:
        "DriverDosth books a driving service. You bring and register your own vehicle; a Driver operates it for your Trip.",
    },
    {
      question: "How do I book a driver?",
      answer:
        "Create an account, choose User, add your vehicle, then open Book a Driver to set pickup, destination, timing, and driving service. Confirm to start the search for a Driver.",
    },
    {
      question: "Do I need my own vehicle?",
      answer:
        "Yes. DriverDosth is a driver-booking platform. You register your vehicle; the Driver provides the driving service.",
    },
    {
      question: "How do I cancel a booking?",
      answer:
        "Open your booking and cancel while the status still allows cancellation. Cancelled bookings cannot be restarted.",
    },
    {
      question: "How do I become a driver?",
      answer:
        "Sign up, verify your phone, select Driver, then complete onboarding and verification documents. You do not need to register a vehicle to drive with DriverDosth.",
    },
    {
      question: "What can a Driver see before accepting?",
      answer:
        "A Driver can review the pickup, destination, User vehicle details, fare estimate, and Trip information before accepting a request.",
    },
    {
      question: "How does payment work?",
      answer:
        "Review the fare estimate before confirming. When the Trip is complete, the final fare and payment record are tied to that Trip.",
    },
    {
      question: "Can I schedule a driver?",
      answer:
        "Yes. Choose Schedule for later during booking and pick a future date and time.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Use the Contact page for product and partnership questions. Our team usually responds within one business day.",
    },
  ],
  about: {
    heroTitle: "About DriverDosth",
    intro:
      "DriverDosth is a driver-booking platform. Users own the vehicle; drivers provide the driving service. Bookings and trips are shared domain records — not duplicated silos. We build for clarity, reliability, and safer everyday trips.",
    mission:
      "Build a reliable platform that makes booking a driver simple for users who bring their own vehicles.",
    vision:
      "Make every journey easier and more reliable through clear product design and trustworthy operations.",
  },
  contact: {
    intro:
      "Questions about DriverDosth or partnerships? Send us a message and we usually respond within one business day.",
  },
  driveWithUs: {
    heroTitle: "Earn by providing driving services",
    heroDescription:
      "Drive with DriverDosth. Complete verification, go online, accept requests to drive Users' vehicles, and grow with shared Trip and earnings records.",
    why: [
      { title: "Flexible hours", description: "Go online when it works for you." },
      {
        title: "Clear trip history",
        description:
          "The same Trip Users see — one shared record, including vehicle details.",
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
      "DriverDosth connects users with drivers who drive the user's own vehicle — safe, reliable driving service with clear trip records.",
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
