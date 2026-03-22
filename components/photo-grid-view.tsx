"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PhotographyImage } from "@/components/photography-image";
import type { RenderablePhoto } from "@/lib/photography";
import { PhotoMeta } from "@/components/photo-meta";
import { cn } from "@/lib/utils";

interface PhotoGridViewProps {
  photos: RenderablePhoto[];
  onSelect: (index: number) => void;
}

const INITIAL_VISIBLE_COUNT = 12;
const VISIBLE_INCREMENT = 12;
const SENTINEL_ROOT_MARGIN = "900px 0px";

export function PhotoGridView({ photos, onSelect }: PhotoGridViewProps) {
  const reduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(INITIAL_VISIBLE_COUNT, photos.length),
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || visibleCount >= photos.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setVisibleCount((currentCount) =>
          Math.min(currentCount + VISIBLE_INCREMENT, photos.length),
        );
      },
      {
        rootMargin: SENTINEL_ROOT_MARGIN,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [photos.length, visibleCount]);

  const visiblePhotos = photos.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {visiblePhotos.map((photo, index) => {
          return (
            <motion.button
              key={photo.id}
              type="button"
              layout
              onClick={() => onSelect(index)}
              className={cn(
                "group overflow-hidden border border-border/70 bg-card/60 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -4,
                      transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                    }
              }
            >
              <motion.div
                layoutId={`photo-frame-${photo.id}`}
                className="relative overflow-hidden"
                style={{ aspectRatio: photo.aspectRatio }}
              >
                <PhotographyImage
                  photo={photo}
                  variant="grid"
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1536px) 30vw, (min-width: 640px) 46vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  placeholder={photo.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={photo.blurDataUrl}
                  preload={index === 0}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/65 via-background/5 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>

              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75 sm:text-[11px]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
                <PhotoMeta photo={photo} compact />
              </div>
            </motion.button>
          );
        })}
      </div>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
    </>
  );
}
