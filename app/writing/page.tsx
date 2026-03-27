import type { Metadata } from "next";
import Link from "next/link";
import { BlogList } from "@/components/blog-list";
import { getPublishedPosts } from "@/lib/blog";
import { writing } from "@/lib/data";
import { WritingList } from "@/components/writing-list";
import { buildPageMetadata, buildWritingJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Writing",
  description: "First-party blog posts, essays, and external publications from Walter Phillips.",
  path: "/writing",
});

export default async function Writing() {
  const posts = await getPublishedPosts();
  const writingJsonLd = buildWritingJsonLd(posts);

  return (
    <main className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-8 md:px-10 lg:px-12">
        <script
          id="writing-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(writingJsonLd) }}
        />
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Writing</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              Writing across both this site and external publications.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back
          </Link>
        </div>

        <section className="mb-12 space-y-5 sm:mb-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75 sm:text-[11px]">
                On This Site
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-[15px]">
                Native blog posts published directly on this site.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Open blog &rarr;
            </Link>
          </div>
          {posts.length > 0 ? (
            <BlogList items={posts} />
          ) : (
            <p className="text-sm text-muted-foreground">The first post is on the way.</p>
          )}
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75 sm:text-[11px]">
              Published Elsewhere
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-[15px]">
              Essays, research, and publications hosted on other sites.
            </p>
          </div>
          {writing.length > 0 ? (
            <WritingList items={writing} />
          ) : (
            <p className="text-sm text-muted-foreground">
              External publications will show up here when they are not mirrored on this site.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
