import type { Metadata } from "next";
import { projects, writing } from "@/lib/data";
import { getPhotographyPhotos, photographyCollection } from "@/lib/photography";
import { resume } from "@/lib/resume";

export const siteUrl = "https://walter-phillips.github.io";
export const allowIndexing = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : true;

export const siteConfig = {
  name: resume.name,
  title: "Walter Phillips",
  description: "Walter Phillips is a software engineer with a physics and engineering background.",
  ogImagePath: "/opengraph-image",
  author: {
    name: resume.name,
    email: resume.email,
    github: resume.github,
    linkedin: "https://www.linkedin.com/in/walter-phillips-1922741a5/",
    twitter: "https://twitter.com/@_Lalter",
  },
} as const;

const defaultImage = [
  {
    url: siteConfig.ogImagePath,
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} site preview`,
  },
];

export function getAbsoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = getAbsoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: defaultImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: defaultImage,
    },
  };
}

export function buildSiteJsonLd() {
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      name: resume.name,
      url: siteUrl,
      email: resume.email,
      description: resume.summary,
      jobTitle: resume.headline,
      homeLocation: resume.location
        ? {
            "@type": "Place",
            name: resume.location,
          }
        : undefined,
      sameAs: [resume.github, siteConfig.author.linkedin, siteConfig.author.twitter].filter(
        Boolean,
      ),
      alumniOf: resume.education.map((entry) => ({
        "@type": "CollegeOrUniversity",
        name: entry.institution,
      })),
      knowsAbout: resume.skills,
      worksFor: resume.experience[0]
        ? {
            "@type": "Organization",
            name: resume.experience[0].organization,
          }
        : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        "@id": personId,
      },
      inLanguage: "en-US",
    },
  ];
}

export function buildProjectsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects",
    url: getAbsoluteUrl("/projects"),
    description: "Selected projects and products Walter Phillips has built or contributed to.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: project.href,
        description: project.description,
      })),
    },
  };
}

export function buildWritingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Writing",
    url: getAbsoluteUrl("/writing"),
    description: "Selected writing and research links from Walter Phillips.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: writing.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.title,
        url: entry.href,
        datePublished: entry.publishedAt,
      })),
    },
  };
}

export function buildPhotographyJsonLd() {
  const photos = getPhotographyPhotos();

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: photographyCollection.title,
    url: getAbsoluteUrl("/photography"),
    description: photographyCollection.description,
    primaryImageOfPage: photos[0]?.images.full,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: photos.map((photo, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: photo.title ?? photo.alt,
        image: photo.images.full,
        description: photo.description,
      })),
    },
  };
}
