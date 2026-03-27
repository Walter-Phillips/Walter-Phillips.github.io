import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { allowIndexing, buildSiteJsonLd, siteConfig, siteUrl } from "@/lib/seo";
import { resume } from "@/lib/resume";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: "%s | Walter Phillips",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  authors: [
    {
      name: resume.name,
      url: siteUrl,
    },
  ],
  creator: resume.name,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.ogImagePath,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} site preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImagePath],
  },
  robots: {
    index: allowIndexing,
    follow: true,
    googleBot: {
      index: allowIndexing,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const siteJsonLd = buildSiteJsonLd();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark antialiased", geist.variable, geistMono.variable)}>
      <body className="min-h-screen w-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
