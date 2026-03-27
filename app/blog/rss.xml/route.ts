import { getPublishedPosts } from "@/lib/blog";
import { getAbsoluteUrl, siteConfig, siteUrl } from "@/lib/seo";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();
  const updatedAt = posts[0]?.updatedAt ?? posts[0]?.publishedAt ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const url = getAbsoluteUrl(post.canonicalPath);
      const description = escapeXml(post.summary);
      const title = escapeXml(post.title);
      const content = post.html;
      const pubDate = new Date(post.publishedAt).toUTCString();

      return [
        "<item>",
        `<title>${title}</title>`,
        `<link>${url}</link>`,
        `<guid>${url}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<description>${description}</description>`,
        `<content:encoded><![CDATA[${content}]]></content:encoded>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(`${siteConfig.name} Blog`)}</title>
    <link>${getAbsoluteUrl("/blog")}</link>
    <description>${escapeXml("Essays, notes, and longer-form writing from Walter Phillips.")}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(updatedAt).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
