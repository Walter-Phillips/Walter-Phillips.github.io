import type { Metadata } from "next";
import Link from "next/link";
import { BlogList } from "@/components/blog-list";
import { getPublishedPosts } from "@/lib/blog";
import { buildBlogJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description: "Essays, notes, and longer-form writing from Walter Phillips.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const blogJsonLd = buildBlogJsonLd(posts);

  return (
    <main className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-8 md:px-10 lg:px-12">
        <script
          id="blog-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        />
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Blog</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              Some stuff I&apos;ve written
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back
          </Link>
        </div>

        {posts.length > 0 ? (
          <BlogList items={posts} />
        ) : (
          <p className="text-sm text-muted-foreground">The first post is on the way.</p>
        )}
      </div>
    </main>
  );
}
