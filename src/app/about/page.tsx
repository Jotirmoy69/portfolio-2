import type { Metadata } from "next";
import { site } from "@/content/site";
import { AboutPageView } from "@/components/sections/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description: site.about.lead,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${site.name}`,
    description: site.about.lead,
    images: [{ url: site.about.image }],
  },
};

export default function AboutPage() {
  return <AboutPageView />;
}
