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

export function PhotographyImage({ alt, photo, sizes, variant, ...props }: PhotographyImageProps) {
  const loader = ({ src, quality, width }: ImageLoaderProps) =>
    buildPhotographyImageUrl(src, {
      fit: defaultFitByVariant[variant],
      quality: quality ?? defaultQualityByVariant[variant],
      width,
    });

  return (
    <Image
      {...props}
      alt={alt}
      loader={loader}
      sizes={sizes ?? defaultSizesByVariant[variant]}
      src={photo.images.original}
    />
  );
}
