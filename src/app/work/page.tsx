import type { Metadata } from "next";
import { site } from "@/content/site";
import { WorkPageView } from "@/components/sections/WorkPage";

export const metadata: Metadata = {
  title: "Work",
  description: `Selected work by ${site.name}, SaaS, APIs, tooling, and product systems.`,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <WorkPageView />;
}
