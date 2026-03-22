import type { Metadata } from "next";
import Link from "next/link";
import { writing } from "@/lib/data";
import { WritingList } from "@/components/writing-list";
import { buildPageMetadata, buildWritingJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Writing",
  description: "Research writing, essays, and external publications from Walter Phillips.",
  path: "/writing",
});

const writingJsonLd = buildWritingJsonLd();

export default function Writing() {
  return (
    <main className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-8 md:px-10 lg:px-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(writingJsonLd) }}
        />
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Writing</h1>
          <Link
            href="/"
            className="inline-flex items-center py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back
          </Link>
        </div>

        <WritingList items={writing} />
      </div>
    </main>
  );
}
