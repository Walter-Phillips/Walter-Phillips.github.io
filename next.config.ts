import type { NextConfig } from "next";

const photographyDeliveryBaseUrl = process.env.NEXT_PUBLIC_PHOTOGRAPHY_DELIVERY_BASE_URL;
const blogImageDeliveryBaseUrls = process.env.NEXT_PUBLIC_BLOG_IMAGE_DELIVERY_BASE_URLS;

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const remotePatterns: RemotePattern[] = [];

function addRemotePatternFromBaseUrl(baseUrl: string) {
  const parsedUrl = new URL(baseUrl);

  remotePatterns.push({
    protocol: parsedUrl.protocol.replace(":", "") as "http" | "https",
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || undefined,
    pathname: "/**",
  });
}

function addRemotePatternsFromBaseUrls(baseUrls: string | undefined) {
  if (!baseUrls) {
    return;
  }

  for (const baseUrl of baseUrls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)) {
    addRemotePatternFromBaseUrl(baseUrl);
  }
}

if (photographyDeliveryBaseUrl) {
  addRemotePatternFromBaseUrl(photographyDeliveryBaseUrl);
}

addRemotePatternsFromBaseUrls(blogImageDeliveryBaseUrls);

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920, 2400, 2800],
    imageSizes: [96, 160, 240, 360, 540, 720, 960, 1280, 1600],
    remotePatterns,
  },
};

export default nextConfig;
