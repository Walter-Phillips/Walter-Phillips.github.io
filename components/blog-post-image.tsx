import Image from "next/image";
import { cn } from "@/lib/utils";

export type BlogPostImageVariant = "cover" | "inline";

export type BlogPostImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  variant?: BlogPostImageVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

const defaultSizesByVariant: Record<BlogPostImageVariant, string> = {
  cover: "(min-width: 1280px) 44rem, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 2rem)",
  inline: "(min-width: 1280px) 44rem, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 2rem)",
};

const defaultClassNameByVariant: Record<BlogPostImageVariant, string> = {
  cover: "my-8 h-auto w-full rounded-2xl border border-border/60",
  inline: "my-8 h-auto w-full rounded-2xl border border-border/60",
};

function getAllowedBlogImageBaseUrls() {
  return (process.env.NEXT_PUBLIC_BLOG_IMAGE_DELIVERY_BASE_URLS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function assertRemoteHttpsUrl(src: string) {
  const url = new URL(src);

  if (url.protocol !== "https:") {
    throw new Error(`Blog image sources must use https URLs: ${src}`);
  }

  const allowedBaseUrls = getAllowedBlogImageBaseUrls();

  if (allowedBaseUrls.length === 0) {
    throw new Error(
      "Blog image rendering requires NEXT_PUBLIC_BLOG_IMAGE_DELIVERY_BASE_URLS to be configured.",
    );
  }

  if (!allowedBaseUrls.some((baseUrl) => url.toString().startsWith(baseUrl))) {
    throw new Error(
      `Blog image source is not allowed by NEXT_PUBLIC_BLOG_IMAGE_DELIVERY_BASE_URLS: ${src}`,
    );
  }

  return url.toString();
}

function assertPositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Blog image ${label} must be a positive integer.`);
  }
}

export function BlogPostImage({
  alt,
  className,
  height,
  variant = "inline",
  priority = variant === "cover",
  sizes,
  src,
  width,
}: BlogPostImageProps) {
  let normalizedSrc: string;

  try {
    normalizedSrc = assertRemoteHttpsUrl(src);
  } catch {
    throw new Error(`Blog image sources must be valid https URLs: ${src}`);
  }

  assertPositiveInteger(width, "width");
  assertPositiveInteger(height, "height");

  if (typeof alt !== "string" || alt.trim().length === 0) {
    throw new Error("Blog image alt text is required.");
  }

  return (
    <Image
      alt={alt}
      className={cn(defaultClassNameByVariant[variant], className)}
      height={height}
      priority={priority}
      sizes={sizes ?? defaultSizesByVariant[variant]}
      src={normalizedSrc}
      width={width}
    />
  );
}
