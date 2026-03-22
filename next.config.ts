import type { NextConfig } from "next";

const photographyDeliveryBaseUrl = process.env.NEXT_PUBLIC_PHOTOGRAPHY_DELIVERY_BASE_URL;

const remotePatterns = [];

if (photographyDeliveryBaseUrl) {
  const parsedUrl = new URL(photographyDeliveryBaseUrl);

  remotePatterns.push({
    protocol: parsedUrl.protocol.replace(":", "") as "http" | "https",
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || undefined,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920, 2400, 2800],
    imageSizes: [96, 160, 240, 360, 540, 720, 960, 1280, 1600],
    remotePatterns,
  },
};

export default nextConfig;
