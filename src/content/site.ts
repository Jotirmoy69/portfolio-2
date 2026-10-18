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
  /** Scroll-lit about — from Jotirmoy’s own copy */
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
      { text: "Hylith." },
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
  note?: string;
  platforms?: string;
  href?: string;
  color: string;
  cover: string;
  closeups: string[];
};

export const projects: Project[] = [
  {
    id: "hylith",
    index: "01",
    title: "Hylith",
    year: "2025",
    kind: "SaaS & product systems",
    note: "Full-stack",
    platforms: "Web",
    href: "https://hylith.com",
    color: "#1A1F36",
    cover: "/hylith_mockup.jpg",
    closeups: ["/hylith_mockup.jpg"],
  },
  {
    id: "please",
    index: "02",
    title: "Please CLI",
    year: "2025",
    kind: "AI Git tooling",
    note: "Open source",
    platforms: "CLI",
    href: "https://github.com/HylithLabs/please",
    color: "#3D2C29",
    cover: "/please_mockup.jpg",
    closeups: ["/please_mockup.jpg"],
  },
  {
    id: "kafka-cqrs",
    index: "03",
    title: "Kafka CQRS",
    year: "2025",
    kind: "NestJS · event architecture",
    note: "Microservices",
    platforms: "Backend",
    href: "https://github.com/Jotirmoy69/nestjs-kafka-and-cqrs-implementation",
    color: "#1A2332",
    cover:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    closeups: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "kong-gateway",
    index: "04",
    title: "Kong Gateway",
    year: "2025",
    kind: "API gateway · load balancing",
    platforms: "Backend",
    href: "https://github.com/Jotirmoy69/nestjs-kong-api-gateway-and-load-balancing",
    color: "#243044",
    cover:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    closeups: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

export const services = [
  {
    index: "01",
    title: "Backend systems",
    body: "Services, data flow and production foundations — NestJS, messaging and architectures that scale without drama.",
  },
  {
    index: "02",
    title: "APIs & gateways",
    body: "Clear HTTP surfaces, Kong-style gateways, load balancing and integrations teams can extend.",
  },
  {
    index: "03",
    title: "Microservices",
    body: "Kafka, CQRS and mono/micro setups with caching, boundaries and operational clarity.",
  },
  {
    index: "04",
    title: "Full-stack products",
    body: "When the interface matters too — Next.js front ends wired cleanly to the systems underneath.",
  },
] as const;
