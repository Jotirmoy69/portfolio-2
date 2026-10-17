import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { seo } from "@/content/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#111010",
    theme_color: "#7FA8FF",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
