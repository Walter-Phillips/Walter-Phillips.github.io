import { generatedPhotographyPhotosSource } from "@/lib/photography.generated";

const photographyDeliveryBaseUrl =
  process.env.NEXT_PUBLIC_PHOTOGRAPHY_DELIVERY_BASE_URL?.replace(/\/+$/, "") ??
  "";
const isR2DevelopmentUrl = photographyDeliveryBaseUrl.includes(".r2.dev");

export type PhotoTag =
  | "architecture"
  | "documentary"
  | "landscape"
  | "night"
  | "portrait"
  | "street"
  | "travel"
  | (string & {});

export interface PhotoItem {
  id: string;
  slug: string;
  alt: string;
  title?: string;
  description?: string;
  location?: string;
  capturedAt?: string;
  width: number;
  height: number;
  blurDataUrl?: string;
  storageKey: string;
  tags: PhotoTag[];
}

export interface PhotoOverride
  extends Partial<Omit<PhotoItem, "id" | "storageKey">> {
  hidden?: boolean;
  sortOrder?: number;
}

export interface RenderablePhoto extends PhotoItem {
  aspectRatio: number;
  images: {
    original: string;
    thumbnail: string;
    medium: string;
    full: string;
  };
}

export const photographyCollection = {
  title: "Photography",
  description:
    "A growing archive of field notes, portraits, and landscapes from Walter Phillips.",
} as const;

export const photographyPhotoOverrides: Record<string, PhotoOverride> = {
  // Example:
  // "007F430C-9DF1-440E-942D-104AF01A4C7B.JPG": {
  //   title: "Evening Train Window",
  //   alt: "Blurred city lights seen through a train window at dusk",
  //   description: "Shot on the way back across the city after rain.",
  //   location: "San Francisco, CA",
  //   tags: ["street", "night"],
  //   sortOrder: 1,
  // },
};

export const photographyPhotosSource = generatedPhotographyPhotosSource
  .flatMap((photo) => {
    const override = photographyPhotoOverrides[photo.storageKey];

    if (override?.hidden) {
      return [];
    }

    return [
      {
        ...photo,
        ...override,
      },
    ];
  })
  .sort((left, right) => {
    const leftOverride = photographyPhotoOverrides[left.storageKey];
    const rightOverride = photographyPhotoOverrides[right.storageKey];
    const leftSortOrder = leftOverride?.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const rightSortOrder = rightOverride?.sortOrder ?? Number.MAX_SAFE_INTEGER;

    if (leftSortOrder !== rightSortOrder) {
      return leftSortOrder - rightSortOrder;
    }

    return left.storageKey.localeCompare(right.storageKey);
  });

export function hasPhotographyDeliveryConfig() {
  return Boolean(photographyDeliveryBaseUrl);
}

export function getPhotographyDeliveryBaseUrl() {
  return photographyDeliveryBaseUrl;
}

function encodeStorageKey(storageKey: string) {
  return storageKey.split("/").map(encodeURIComponent).join("/");
}

function buildPhotographyAssetUrl(storageKey: string) {
  if (!photographyDeliveryBaseUrl) {
    return null;
  }

  return `${photographyDeliveryBaseUrl}/${encodeStorageKey(storageKey)}`;
}

export type PhotographyImageFit = "cover" | "scale-down";

interface BuildPhotographyImageUrlOptions {
  fit: PhotographyImageFit;
  quality?: number;
  width: number;
}

export function buildPhotographyImageUrl(
  src: string,
  { fit, quality, width }: BuildPhotographyImageUrlOptions,
) {
  if (!photographyDeliveryBaseUrl || isR2DevelopmentUrl) {
    return src;
  }

  if (!src.startsWith(photographyDeliveryBaseUrl)) {
    return src;
  }

  const relativePath = src
    .slice(photographyDeliveryBaseUrl.length)
    .replace(/^\/+/, "");
  const transformations = [
    "format=auto",
    "metadata=none",
    `fit=${fit}`,
    `width=${width}`,
  ];

  if (quality) {
    transformations.push(`quality=${quality}`);
  }

  return `${photographyDeliveryBaseUrl}/cdn-cgi/image/${transformations.join(",")}/${relativePath}`;
}

function buildPhotoImages(photo: PhotoItem) {
  const original = buildPhotographyAssetUrl(photo.storageKey);

  if (!original) {
    return null;
  }

  const thumbnail = buildPhotographyImageUrl(original, {
    fit: "cover",
    quality: 85,
    width: 960,
  });
  const medium = buildPhotographyImageUrl(original, {
    fit: "cover",
    quality: 85,
    width: 1800,
  });
  const full = buildPhotographyImageUrl(original, {
    fit: "scale-down",
    quality: 90,
    width: 2800,
  });

  if (!original || !thumbnail || !medium || !full) {
    return null;
  }

  return {
    original,
    thumbnail,
    medium,
    full,
  };
}

export function getPhotographyPhotos(): RenderablePhoto[] {
  if (!photographyDeliveryBaseUrl) {
    return [];
  }

  return photographyPhotosSource.flatMap((photo) => {
    const images = buildPhotoImages(photo);

    if (!images) {
      return [];
    }

    return [
      {
        ...photo,
        aspectRatio: photo.width / photo.height,
        images,
      },
    ];
  });
}
