import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogMarkdown } from "@/components/blog-markdown";
import { BlogPostImage } from "@/components/blog-post-image";
import { formatBlogDate, getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { buildBlogPostJsonLd, buildBlogPostMetadata } from "@/lib/seo";

const includeDrafts = process.env.NODE_ENV !== "production";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { includeDrafts });

  if (!post || (post.draft && !includeDrafts)) {
    return {};
  }

  return buildBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { includeDrafts });

  if (!post || (post.draft && !includeDrafts)) {
    notFound();
  }

  const blogPostJsonLd = buildBlogPostJsonLd(post);

  return (
    <main className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-8 md:px-10 lg:px-12">
        <script
          id={`blog-post-jsonld-${post.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
        />
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:gap-5">
          <Link
            href="/blog"
            className="inline-flex items-center py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Blog
          </Link>
          <header className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
                {formatBlogDate(post.publishedAt)}
              </p>
              {post.updatedAt ? (
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/65">
                  Updated {formatBlogDate(post.updatedAt)}
                </p>
              ) : null}
              {post.draft ? (
                <span className="rounded-full border border-border/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/85">
                  Draft
                </span>
              ) : null}
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              <h1 className="text-[2rem] leading-tight font-semibold tracking-[-0.04em] text-foreground text-balance sm:text-4xl">
                {post.title}
              </h1>
              <p className="max-w-2xl text-[0.98rem] leading-7 text-muted-foreground sm:text-[1.05rem]">
                {post.summary}
              </p>
            </div>
          </header>
        </div>

        {post.coverImage ? (
          <BlogPostImage
            alt={post.coverImage.alt}
            height={post.coverImage.height}
            src={post.coverImage.src}
            variant="cover"
            width={post.coverImage.width}
          />
        ) : null}

        <BlogMarkdown className="pb-2" content={post.content} />
      </div>
    </main>
  );
}
