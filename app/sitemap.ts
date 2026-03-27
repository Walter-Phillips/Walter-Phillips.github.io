import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { getAbsoluteUrl } from "@/lib/seo";

const routes = ["/", "/blog", "/projects", "/photography", "/writing"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const lastModified = new Date();

  return [
    ...routes.map((route, index) => ({
      url: getAbsoluteUrl(route),
      lastModified,
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: index === 0 ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: getAbsoluteUrl(post.canonicalPath),
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
