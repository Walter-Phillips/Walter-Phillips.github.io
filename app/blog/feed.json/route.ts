import { getPublishedPosts } from "@/lib/blog";
import { getAbsoluteUrl, siteConfig, siteUrl } from "@/lib/seo";

export async function GET() {
  const posts = await getPublishedPosts();

  return Response.json(
    {
      version: "https://jsonfeed.org/version/1.1",
      title: `${siteConfig.name} Blog`,
      home_page_url: getAbsoluteUrl("/blog"),
      feed_url: `${siteUrl}/blog/feed.json`,
      description: "Essays, notes, and longer-form writing from Walter Phillips.",
      authors: [{ name: siteConfig.author.name, url: siteUrl }],
      items: posts.map((post) => ({
        id: getAbsoluteUrl(post.canonicalPath),
        url: getAbsoluteUrl(post.canonicalPath),
        title: post.title,
        summary: post.summary,
        content_html: post.html,
        date_published: new Date(post.publishedAt).toISOString(),
        date_modified: new Date(post.updatedAt ?? post.publishedAt).toISOString(),
        tags: post.tags,
      })),
    },
    {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=3600",
      },
    },
  );
}
