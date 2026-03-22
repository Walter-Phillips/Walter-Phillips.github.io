import type { Metadata } from "next";
import Link from "next/link";
import { PhotoGallery } from "@/components/photo-gallery";
import { getPhotographyPhotos, photographyCollection } from "@/lib/photography";
import { buildPageMetadata, buildPhotographyJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: photographyCollection.title,
  description:
    "A photography archive from Walter Phillips with both grid and carousel viewing modes.",
  path: "/photography",
});

const photographyJsonLd = buildPhotographyJsonLd();

const monthOrder: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function getCapturedAtSortValue(capturedAt?: string) {
  if (!capturedAt) {
    return Number.NEGATIVE_INFINITY;
  }

  const [month, year] = capturedAt.split(" ");
  const monthIndex = monthOrder[month];
  const yearNumber = Number(year);

  if (monthIndex === undefined || Number.isNaN(yearNumber)) {
    return Number.NEGATIVE_INFINITY;
  }

  return yearNumber * 12 + monthIndex;
}

export default function PhotographyPage() {
  const photos = getPhotographyPhotos().sort(
    (left, right) =>
      getCapturedAtSortValue(right.capturedAt) - getCapturedAtSortValue(left.capturedAt),
  );

  return (
    <main className="py-12 sm:py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photographyJsonLd) }}
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75 sm:text-[11px]">
              {photographyCollection.title}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              photos from my life
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back
          </Link>
        </div>
        <PhotoGallery photos={photos} />
      </div>
    </main>
  );
}
