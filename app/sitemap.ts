import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/seo";

const routes = ["/", "/about", "/projects", "/writing"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route, index) => ({
    url: getAbsoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
