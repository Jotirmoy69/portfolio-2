import type { Metadata } from "next";
import { site, servicesPage } from "@/content/site";
import { ServicesPageView } from "@/components/sections/ServicesPage";

export const metadata: Metadata = {
  title: "Services",
  description: `${servicesPage.intro} Backend systems, APIs, microservices and full-stack products by ${site.name}.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesPageView />;
}
