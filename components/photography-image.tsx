"use client";

import { useState } from "react";
import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import {
  buildPhotographyImageUrl,
  type PhotographyImageFit,
  type RenderablePhoto,
} from "@/lib/photography";

export type PhotographyImageVariant = "grid" | "carousel" | "thumb" | "lightbox";

type PhotographyImageProps = Omit<ImageProps, "alt" | "loader" | "src"> & {
  alt: string;
  photo: RenderablePhoto;
  variant: PhotographyImageVariant;
};

const defaultFitByVariant: Record<PhotographyImageVariant, PhotographyImageFit> = {
  grid: "contain",
  carousel: "contain",
  thumb: "contain",
  lightbox: "scale-down",
};

const defaultQualityByVariant: Record<PhotographyImageVariant, number> = {
  grid: 82,
  carousel: 85,
  thumb: 76,
  lightbox: 90,
};

const defaultSizesByVariant: Record<PhotographyImageVariant, string> = {
  grid: "(min-width: 1536px) 30vw, (min-width: 640px) 46vw, 100vw",
  carousel: "(min-width: 1024px) 72vw, 100vw",
  thumb: "96px",
  lightbox: "100vw",
};

const MAX_RETRY_ATTEMPTS = 2;
const RETRY_BACKOFF_MS = 300;

export function PhotographyImage({ alt, photo, sizes, variant, ...props }: PhotographyImageProps) {
  return (
    <RetryingPhotographyImage
      key={`${photo.images.original}:${variant}`}
      alt={alt}
      photo={photo}
      sizes={sizes}
      variant={variant}
      {...props}
    />
  );
}

function RetryingPhotographyImage({ alt, photo, sizes, variant, ...props }: PhotographyImageProps) {
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isFailed, setIsFailed] = useState(false);

  const loader = ({ src, quality, width }: ImageLoaderProps) => {
    const imageUrl = buildPhotographyImageUrl(src, {
      fit: defaultFitByVariant[variant],
      quality: quality ?? defaultQualityByVariant[variant],
      width,
    });
    const separator = imageUrl.includes("?") ? "&" : "?";

    return `${imageUrl}${separator}retry=${retryAttempt}`;
  };

  const fallbackStyle = props.fill
    ? {
        position: "absolute" as const,
        inset: 0,
      }
    : {
        width: props.width,
        height: props.height,
      };

  if (isFailed) {
    return photo.blurDataUrl ? (
      <div
        aria-label={alt}
        role="img"
        className={props.className}
        style={{
          ...fallbackStyle,
          backgroundImage: `url("${photo.blurDataUrl}")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: defaultFitByVariant[variant] === "scale-down" ? "contain" : "cover",
        }}
      />
    ) : (
      <div aria-label={alt} role="img" className={props.className} style={fallbackStyle} />
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      loader={loader}
      onError={(event) => {
        props.onError?.(event);

        if (retryAttempt >= MAX_RETRY_ATTEMPTS) {
          setIsFailed(true);
          return;
        }

        window.setTimeout(
          () => {
            setRetryAttempt((currentAttempt) => currentAttempt + 1);
          },
          RETRY_BACKOFF_MS * (retryAttempt + 1),
        );
      }}
      sizes={sizes ?? defaultSizesByVariant[variant]}
      src={photo.images.original}
    />
  );
}
