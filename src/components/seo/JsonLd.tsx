import { buildJsonLd } from "@/content/seo";

export function JsonLd() {
  const data = buildJsonLd();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
