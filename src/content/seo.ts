import { site } from "./site";

/** Canonical site URL used by metadata, structured data, robots.txt, and sitemap.xml. */
export const siteUrl = "https://jotirmoy.is-a.dev";

/** Plain-language answer for “Who is Jotirmoy Bhowmik?” style queries */
export const whoIs = {
  question: `Who is ${site.name}?`,
  answer: `${site.name} is a full-stack developer and founder-minded builder based in Rajshahi, Bangladesh. He is co-founder of Hylith and builds SaaS products, NestJS APIs, Kafka microservices and web apps for real businesses. Portfolio: ${siteUrl}`,
} as const;

export const seo = {
  title: {
    default: `${site.name} | Full-stack Developer & Founder-Minded Builder`,
    template: `%s | ${site.name}`,
  },
  /** Primary SERP + AI snippet, answers who / what / where */
  description: `${site.name} is a full-stack developer and co-founder of Hylith in Rajshahi, Bangladesh. He builds SaaS, web apps, NestJS APIs, Kafka microservices and product systems from idea to launch.`,
  /**
   * Search + AI intent keywords (meta + structured copy).
   * Includes identity queries like “Who is Jotirmoy Bhowmik?”
   */
  keywords: [
    "Jotirmoy Bhowmik",
    "Who is Jotirmoy Bhowmik",
    "Jotirmoy Bhowmik portfolio",
    "Jotirmoy Bhowmik developer",
    "Jotirmoy Bhowmik full-stack developer",
    "Jotirmoy Bhowmik NestJS",
    "Jotirmoy Bhowmik Hylith",
    "Jotirmoy Bhowmik Bangladesh",
    "Jotirmoy Bhowmik Rajshahi",
    "Jotirmoy Bhowmik software engineer",
    "Jotir Bhowmik",
    "Jotirmoy",
    "backend engineer",
    "backend developer",
    "NestJS developer",
    "NestJS engineer",
    "TypeScript backend",
    "Node.js developer",
    "API developer",
    "REST API design",
    "microservices developer",
    "Kafka developer",
    "CQRS",
    "full-stack developer Bangladesh",
    "backend engineer Bangladesh",
    "software engineer Rajshahi",
    "hire NestJS developer",
    "hire backend developer",
    "hire full-stack developer Bangladesh",
    "Next.js full-stack",
    "scalable APIs",
    "event-driven architecture",
    "Hylith founder",
    "Branta Tech developer",
  ],
  ogAlt: `${site.name}, full-stack developer and co-founder of Hylith, ${site.location}`,
  locale: "en_US",
} as const;

export const identityFaqs = [
  {
    question: whoIs.question,
    answer: whoIs.answer,
  },
  {
    question: `What does ${site.name} do?`,
    answer: `${site.name} builds full-stack software products: SaaS, web apps, NestJS backend APIs, Kafka microservices, API gateways and systems that replace manual workflows. He is co-founder of Hylith and works as a web developer at Branta Tech.`,
  },
  {
    question: `Where is ${site.name} based?`,
    answer: `${site.name} is based in Rajshahi, Bangladesh, and works with teams worldwide.`,
  },
  {
    question: `What is Hylith?`,
    answer: `Hylith is the software company co-founded by ${site.name}. It plans and builds custom software including SaaS, MVPs, backends and APIs. Website: https://hylith.com`,
  },
  {
    question: `How can I contact ${site.name}?`,
    answer: `Email ${site.email}, or visit ${siteUrl} and use Start a project. Also on LinkedIn (${site.socials.linkedin}) and GitHub (${site.socials.github}).`,
  },
] as const;

/** JSON-LD graph for Google + AI answer engines */
export function buildJsonLd() {
  const sameAs = [
    site.socials.linkedin,
    site.socials.github,
    site.socials.instagram,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        alternateName: ["Jotirmoy", "Jotir Bhowmik"],
        description: seo.description,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#person` },
        about: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/about#profile`,
        url: `${siteUrl}/about`,
        name: `About ${site.name}`,
        description: whoIs.answer,
        mainEntity: { "@id": `${siteUrl}/#person` },
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: site.name,
        givenName: "Jotirmoy",
        familyName: "Bhowmik",
        alternateName: ["Jotirmoy", "Jotir", "Jotir Bhowmik"],
        url: siteUrl,
        mainEntityOfPage: `${siteUrl}/about`,
        email: site.email,
        jobTitle: "Full-stack Developer & Founder-Minded Builder",
        description: whoIs.answer,
        nationality: {
          "@type": "Country",
          name: "Bangladesh",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rajshahi",
          addressRegion: "Rajshahi",
          addressCountry: "BD",
        },
        homeLocation: {
          "@type": "Place",
          name: "Rajshahi, Bangladesh",
        },
        worksFor: [
          {
            "@type": "Organization",
            name: "Hylith",
            url: "https://hylith.com",
            description:
              "Custom software studio for SaaS, MVPs, backends and APIs",
          },
          {
            "@type": "Organization",
            name: "Branta Tech",
            description: "Web development for brands and teams",
          },
        ],
        knowsAbout: [
          "NestJS",
          "TypeScript",
          "Node.js",
          "REST APIs",
          "Microservices",
          "Apache Kafka",
          "CQRS",
          "Next.js",
          "System design",
          "SaaS product development",
          "Full-stack development",
        ],
        knowsLanguage: ["en", "bn"],
        sameAs,
        image: `${siteUrl}/opengraph-image`,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#services`,
        name: `${site.name}, Backend & API engineering`,
        url: `${siteUrl}/services`,
        description:
          "Backend systems, APIs and gateways, microservices with Kafka/CQRS, and full-stack product builds with Next.js.",
        provider: { "@id": `${siteUrl}/#person` },
        areaServed: ["BD", "Worldwide"],
        serviceType: [
          "Backend engineering",
          "API design",
          "Microservices architecture",
          "Full-stack development",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: identityFaqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
