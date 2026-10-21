export const site = {
  name: "Jotirmoy Bhowmik",
  shortName: "Jotirmoy",
  wordmark: { before: "Jotir", highlight: "moy", after: " Bhowmik" },
  /** Intro / header lockup: first + accent letter + italic rest (MW structure) */
  lockup: { first: "Jotirmoy", box: "B", rest: "howmik" },
  /** Matches LinkedIn headline */
  role: "Full-stack developer",
  roleDetail: "Founder-minded · products",
  location: "Rajshahi, BD",
  year: "2026",
  email: "jotirmoybhowmik1976@gmail.com",
  /** Shown in the contact popup when set */
  phone: "" as string,
  socials: {
    linkedin: "https://www.linkedin.com/in/jotirmoy-bhowmik/",
    github: "https://github.com/Jotirmoy69",
    instagram: "https://www.instagram.com/wizard.spell_/",
  },
  hero: {
    line1: "Jotirmoy",
    line2: "Bhowmik",
    intro:
      "I build full-stack products from SaaS and web apps to backend APIs and distributed systems that replace manual workflows with software built to grow with your business.",
    scrollHint: "↓ Scroll, gently",
  },
  skills: [
    "NestJS",
    "APIs",
    "Kafka",
    "Microservices",
    "CQRS",
    "TypeScript",
    "Next.js",
  ],
  /** Full /about page, MW layout, copy from LinkedIn + site voice */
  about: {
    title: "About",
    image: "/about.jpg",
    imageAlt:
      "Jotirmoy Bhowmik, full-stack developer and co-founder of Hylith",
    lead: "Hi, I'm Jotirmoy. I'm a full-stack developer and founder-minded builder based in Rajshahi, Bangladesh.",
    paragraphs: [
      "I build software products from the ground up, not just features, the full thing. Idea, architecture and launch. SaaS, web apps, backend APIs and systems for online businesses that have outgrown manual workflows.",
      "I'm co-founder at Hylith, where we plan and build custom software: SaaS, MVPs, backends and APIs. I also work as a web developer at Branta Tech, shipping real products for brands and teams from Bogura / Rajshahi.",
      "Day to day that means NestJS, TypeScript, Kafka and microservices when systems need to scale, and practical full-stack work when something needs to ship. I'm happiest where product sense and engineering craft overlap: understand the workflow, define the smallest useful version, then build something that can keep improving after launch.",
    ],
    toolkitLabel: "Toolkit",
    toolkit: [
      "NestJS",
      "TypeScript",
      "Next.js",
      "React",
      "Kafka",
      "Microservices",
      "CQRS",
      "PostgreSQL",
    ],
  },
  /** Homepage scroll-lit teaser (optional / legacy) */
  statement: {
    label: "(Hello)",
    text: "I'm Jotirmoy, a full-stack developer and co-founder of Hylith. For the past three years, I've been building software from idea to launch from shaping the product to designing the backend and bringing it to life. I work mainly with NestJS and enjoy solving the problems behind the features. Made in Bangladesh.",
    words: [
      { text: "I'm" },
      { text: "Jotirmoy," },
      { text: "a" },
      { text: "full-stack" },
      { text: "developer" },
      { text: "and" },
      { text: "co-founder" },
      { text: "of" },
      {
        text: "Hylith.",
        href: "https://hylith.com",
        highlight: true,
      },
      { text: "For" },
      { text: "the" },
      { text: "past" },
      { text: "three" },
      { text: "years," },
      { text: "I've" },
      { text: "been" },
      { text: "building" },
      { text: "software" },
      { text: "from" },
      { text: "idea", italic: true },
      { text: "to" },
      { text: "launch", italic: true },
      { text: "from" },
      { text: "shaping" },
      { text: "the" },
      { text: "product" },
      { text: "to" },
      { text: "designing" },
      { text: "the" },
      { text: "backend" },
      { text: "and" },
      { text: "bringing" },
      { text: "it" },
      { text: "to" },
      { text: "life." },
      { text: "I" },
      { text: "work" },
      { text: "mainly" },
      { text: "with" },
      { text: "NestJS" },
      { text: "and" },
      { text: "enjoy" },
      { text: "solving" },
      { text: "the" },
      { text: "problems" },
      { text: "behind" },
      { text: "the" },
      { text: "features." },
      { text: "Made" },
      { text: "in" },
      { text: "Bangladesh.", accent: true },
    ],
  },
  accents: ["#7FA8FF", "#FF8B6A", "#7AD4A8", "#F0C75E", "#C9A0FF"],
} as const;

export type Project = {
  id: string;
  index: string;
  title: string;
  year: string;
  kind: string;
  /** Role shown on /work list (MW Role column) */
  role?: string;
  note?: string;
  platforms?: string;
  href?: string;
  /** Private / under wraps, click opens a notice instead of a public link */
  locked?: boolean;
  lockedTitle?: string;
  lockedBody?: string;
  color: string;
  /** Desktop / wide stage + hover card */
  cover: string;
  /** Narrow / mobile stage (falls back to cover) */
  coverMobile?: string;
  closeups: string[];
};

export const projects: Project[] = [
  {
    id: "hylith",
    index: "01",
    title: "Hylith",
    year: "2025",
    kind: "SaaS & product systems",
    role: "Full-stack / Founder",
    note: "Full-stack",
    platforms: "Web",
    href: "https://hylith.com",
    color: "#1A1F36",
    cover: "/hylith_mockup.jpg",
    coverMobile: "/hylith_horizontal.jpg",
    closeups: ["/hylith_mockup.jpg"],
  },
  {
    id: "please",
    index: "02",
    title: "Please CLI",
    year: "2025",
    kind: "AI Git tooling",
    role: "Open source",
    note: "Open source",
    platforms: "CLI",
    href: "https://github.com/HylithLabs/please",
    color: "#3D2C29",
    cover: "/please_mockup.jpg",
    coverMobile: "/please_horizontal.jpg",
    closeups: ["/please_mockup.jpg"],
  },
  {
    id: "hylith-telemedicine",
    index: "03",
    title: "Hylith Telemedicine",
    year: "2026",
    kind: "Distributed health system",
    role: "Backend / Private",
    note: "Private SaaS",
    platforms: "Backend",
    locked: true,
    lockedTitle: "Under wraps",
    lockedBody:
      "Shh, this one's secret. Don't tell anyone. Hylith Telemedicine is a private SaaS we're building in-house: a large distributed health platform that isn't open source and isn't public yet. If you need something at this scale, start a project and we'll talk.",
    color: "#15261F",
    cover:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    closeups: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "bus-sorting",
    index: "04",
    title: "Bus Sorting System",
    year: "2025",
    kind: "Ops tooling · scheduling",
    role: "Desktop app",
    note: "Desktop",
    platforms: "App",
    href: "https://github.com/Jotirmoy69/BusSortingSystem",
    color: "#2A2438",
    cover: "/busSorting_mockup.jpg",
    coverMobile: "/busSorting_horizontal.jpg",
    closeups: ["/busSorting_mockup.jpg"],
  },
];

/** Homepage teaser tiles + /services index */
export const services = [
  {
    index: "01",
    title: "Backend systems",
    body: "Services, data flow and production foundations. NestJS, messaging and architectures that scale without drama.",
    tags: ["NestJS", "Messaging", "Architecture", "Production"],
  },
  {
    index: "02",
    title: "APIs & gateways",
    body: "Clear HTTP surfaces, Kong-style gateways, load balancing and integrations teams can extend.",
    tags: ["REST APIs", "Gateways", "Load balancing", "Integrations"],
  },
  {
    index: "03",
    title: "Microservices",
    body: "Kafka, CQRS and mono/micro setups with caching, boundaries and operational clarity.",
    tags: ["Kafka", "CQRS", "Caching", "Boundaries"],
  },
  {
    index: "04",
    title: "Full-stack products",
    body: "When the interface matters too. Next.js front ends wired cleanly to the systems underneath.",
    tags: ["Next.js", "SaaS", "Product builds", "Launch"],
  },
] as const;

/** Full /services page, MW layout */
export const servicesPage = {
  title: "Services",
  intro: "Four things I do a lot of. Most projects end up being a mix.",
  stepsLabel: "How it usually goes",
  steps: [
    {
      title: "Chat",
      body: "A call to talk through what you need, who it is for and when.",
    },
    {
      title: "Plan",
      body: "A clear scope, timeline and quote, so nothing is a surprise.",
    },
    {
      title: "Build",
      body: "Architecture, APIs and product work, shared early and often.",
    },
    {
      title: "Launch",
      body: "Built, tested, shipped, and handed over cleanly.",
    },
  ],
  plansLabel: "Ways to work together",
  plans: [
    {
      title: "Fixed project",
      body: "A defined scope with a fixed price. Best for new products, APIs and systems.",
      price: "Quote on enquiry",
    },
    {
      title: "Ongoing support",
      body: "A monthly block of time for features, fixes and improvements.",
      price: "Monthly, on enquiry",
    },
  ],
} as const;
