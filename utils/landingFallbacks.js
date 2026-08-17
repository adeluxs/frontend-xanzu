const landingSectionDefaults = {
  hero: {
    hero_title: "Pay Your Way. On Your Terms",
    hero_description:
      "Get what you love today and split the cost into simple, predictable installments — no surprises, no stress.",
    qr_text: "Get the MozaPay app",
    background_image: "/assets/landing-page/hero-section/hero-bg.png",
    hero_image: "/assets/landing-page/hero-section/hero-img.png",
    qr_image: "/assets/landing-page/hero-section/QR-Code.png",
  },
  "how-it-works": {
    title: "How It Works",
    background_image:
      "/assets/landing-page/how-its-works/how-its-works-bg.png",
    right_image: "/assets/landing-page/how-its-works/how-it-works.png",
  },
  stats: {
    background_image: "/assets/landing-page/stats/stats-bg.png",
  },
  "why-choose-us": {
    title: "Why Choose Us",
  },
  "about-us": {
    title: "Redefining How People Pay",
    description:
      "We help shoppers buy what they love today and pay over time — without interest, hidden fees, or complicated approvals.",
    background_image: "/assets/landing-page/about-us/about-us-bg.png",
    left_image: "/assets/landing-page/about-us/about-us.png",
  },
  "pay-in-4": {
    title: "4 Payments. Zero Stress.",
    description:
      "Pay over time anywhere VISA is accepted with your MozaPay Card.",
    bullet_one: "No upfront stress",
    bullet_two: "Auto payments enabled",
    bullet_three: "Flexible due dates",
    bullet_four: "Track payments anytime",
    right_image: "/assets/landing-page/how-to-do/how-to-do.png",
  },
  faq: {
    title: "Frequently Asked Questions",
    background_image: "/assets/landing-page/faq/faq-bg.png",
  },
  testimonials: {
    testimonial_title: "Trusted by Thousands of Smart Shoppers",
  },
  "app-link": {
    title: "Smarter Shopping Starts in Your Pocket",
    description:
      "Split payments, stay organized, and never miss a due date again.",
    background_image: "/assets/landing-page/app-link/app-link-bg.png",
    right_image: "/assets/landing-page/app-link/app-img.png",
    app_store_icon: "/assets/landing-page/app-link/app-store-icon.png",
    app_store_url: "/",
    play_store_icon: "/assets/landing-page/app-link/play-store-icon.png",
    play_store_url: "/",
  },
};

const landingSectionCodes = [
  "hero",
  "how-it-works",
  "stats",
  "why-choose-us",
  "about-us",
  "pay-in-4",
  "faq",
  "testimonials",
  "app-link",
];

const landingContentDefaults = {
  "how-it-works": [
    {
      title: "Choose MozaPay at Checkout",
      description: "Select MozaPay when shopping.",
      icon: "/assets/landing-page/how-its-works/step-1.svg",
    },
    {
      title: "Get Instant Approval",
      description: "Complete the simple approval process in seconds.",
      icon: "/assets/landing-page/how-its-works/step-2.svg",
    },
    {
      title: "Pay in Installments",
      description: "Split your purchase into predictable payments.",
      icon: "/assets/landing-page/how-its-works/step-3.svg",
    },
  ],
  stats: [
    {
      title: "Fast",
      description: "Simple Payments",
      icon: "/assets/landing-page/stats/stats-1.png",
    },
    {
      title: "Secure",
      description: "Protected Transactions",
      icon: "/assets/landing-page/stats/stats-2.png",
    },
    {
      title: "Flexible",
      description: "Payment Options",
      icon: "/assets/landing-page/stats/stats-3.png",
    },
    {
      title: "24/7",
      description: "Account Access",
      icon: "/assets/landing-page/stats/stats-4.png",
    },
  ],
  "why-choose-us": [
    {
      title: "Instant Approval",
      description: "No paperwork. No waiting.",
      icon: "/assets/landing-page/why-choose-us/why-choose-us-1.svg",
    },
    {
      title: "Bank-Level Security",
      description: "Your data is fully encrypted.",
      icon: "/assets/landing-page/why-choose-us/why-choose-us-2.svg",
    },
    {
      title: "Zero Hidden Fees",
      description: "What you see is what you pay.",
      icon: "/assets/landing-page/why-choose-us/why-choose-us-3.svg",
    },
    {
      title: "Manage in One App",
      description: "Track payments anytime.",
      icon: "/assets/landing-page/why-choose-us/why-choose-us-4.svg",
    },
  ],
  "about-us": [
    { title: "Transparency", description: "No hidden charges. Ever." },
    { title: "Simplicity", description: "Fast onboarding. Easy payments." },
    {
      title: "Security",
      description: "Strong protection for every transaction.",
    },
    { title: "Inclusion", description: "Designed for all shoppers." },
  ],
  testimonials: [
    {
      id: "fallback-testimonial-1",
      name: "MozaPay Shopper",
      designation: "Verified customer",
      description:
        "MozaPay made it simple to understand and manage every payment.",
      picture:
        "/assets/landing-page/testimonials-section/testimonial-user-1.svg",
      star: 5,
    },
    {
      id: "fallback-testimonial-2",
      name: "MozaPay Merchant",
      designation: "Verified merchant",
      description:
        "The checkout experience is clear, fast, and easy for customers.",
      picture:
        "/assets/landing-page/testimonials-section/testimonial-user-2.svg",
      star: 5,
    },
    {
      id: "fallback-testimonial-3",
      name: "MozaPay User",
      designation: "Verified user",
      description:
        "Everything I need to track my payments is available in one place.",
      picture:
        "/assets/landing-page/testimonials-section/testimonial-user-3.svg",
      star: 5,
    },
  ],
};

const isPresent = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  !(Array.isArray(value) && value.length === 0);

const mergePresent = (fallback, value) => {
  const configured =
    value && typeof value === "object" && !Array.isArray(value) ? value : {};

  return Object.entries(configured).reduce(
    (merged, [key, fieldValue]) => {
      if (isPresent(fieldValue)) merged[key] = fieldValue;
      return merged;
    },
    { ...fallback },
  );
};

export const landingImageFallback = (code, field) =>
  landingSectionDefaults?.[code]?.[field] || null;

export const landingContentImageFallback = (code, index, field = "icon") =>
  landingContentDefaults?.[code]?.[index]?.[field] || null;

export function withLandingFallbacks(section) {
  const code = section?.code;
  const defaultData = landingSectionDefaults?.[code] || {};
  const defaultContents = landingContentDefaults?.[code] || [];
  const configuredContents = Array.isArray(section?.contents)
    ? section.contents
    : [];

  const contents =
    configuredContents.length > 0
      ? configuredContents.map((item, index) =>
          mergePresent(defaultContents[index] || {}, item),
        )
      : defaultContents;

  return {
    ...section,
    data: mergePresent(defaultData, section?.data),
    contents,
  };
}

export function resolveLandingSections(sections) {
  const configuredSections = Array.isArray(sections) ? sections : [];
  const source =
    configuredSections.length > 0
      ? configuredSections
      : landingSectionCodes.map((code, index) => ({
          id: `fallback-${code}`,
          code,
          short: index + 1,
          status: true,
          data: {},
          contents: [],
        }));

  return source.map(withLandingFallbacks);
}
