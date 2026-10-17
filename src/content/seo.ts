import { site } from "./site";

/** Canonical site URL — set NEXT_PUBLIC_SITE_URL in Vercel for custom domains. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://jotirmoy.vercel.app";

export const seo = {
  title: {
    default: `${site.name} | Backend Engineer in Bangladesh`,
    template: `%s | ${site.name}`,
  },
  /** Primary SERP + AI snippet — answers who / what / where */
  description:
    "Jotirmoy Bhowmik is a backend engineer and full-stack developer in Rajshahi, Bangladesh. NestJS, TypeScript, APIs, Kafka microservices, CQRS and production systems — available for hire.",
  /**
   * Search + AI intent keywords (used in meta + structured copy, not stuffed in body).
   * Sourced from common queries around NestJS / backend hire / BD talent.
   */
  keywords: [
    "Jotirmoy Bhowmik",
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
    "hire NestJS developer",
    "hire backend developer",
    "software engineer Rajshahi",
    "Next.js full-stack",
    "scalable APIs",
    "event-driven architecture",
  ],
  ogAlt: `${site.name} — backend engineer, NestJS & APIs, ${site.location}`,
  locale: "en_US",
} as const;

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
        description: seo.description,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: site.name,
        url: siteUrl,
        email: site.email,
        jobTitle: site.role,
        description: site.statement.text,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rajshahi",
          addressCountry: "BD",
        },
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
        ],
        sameAs,
        image: `${siteUrl}/opengraph-image`,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#services`,
        name: `${site.name} — Backend & API engineering`,
        url: siteUrl,
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
    ],
  };
}
