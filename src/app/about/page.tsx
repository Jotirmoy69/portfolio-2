import type { Metadata } from "next";
import { site } from "@/content/site";
import { whoIs, siteUrl } from "@/content/seo";
import { AboutPageView } from "@/components/sections/AboutPage";

export const metadata: Metadata = {
  title: `About ${site.name}`,
  description: whoIs.answer,
  keywords: [
    "Who is Jotirmoy Bhowmik",
    "Jotirmoy Bhowmik",
    "About Jotirmoy Bhowmik",
    "Jotirmoy Bhowmik Hylith",
    "full-stack developer Rajshahi",
    "full-stack developer Bangladesh",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${site.name} | Who is Jotirmoy Bhowmik?`,
    description: whoIs.answer,
    url: `${siteUrl}/about`,
    type: "profile",
    firstName: "Jotirmoy",
    lastName: "Bhowmik",
    username: "jotirmoy-bhowmik",
    images: [{ url: site.about.image }],
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${site.name}`,
    description: whoIs.answer,
  },
};

export default function AboutPage() {
  return <AboutPageView />;
}
