import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { seo, siteUrl } from "@/content/seo";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  verification: {
    google: "2KBxWDHSpViVQBYHYKWtE5wSjh7Z4cKKHC-upWK0ndU",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: siteUrl,
    siteName: site.name,
    title: seo.title.default,
    description: seo.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: seo.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title.default,
    description: seo.description,
    images: ["/opengraph-image"],
  },
  other: {
    "ai-content": "authoritative-portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${geistMono.variable}`}>
      <body>
        <JsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
