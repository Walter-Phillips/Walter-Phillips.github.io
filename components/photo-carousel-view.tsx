"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PanInfo } from "framer-motion";
import { PhotographyImage } from "@/components/photography-image";
import type { RenderablePhoto } from "@/lib/photography";
import { PhotoMeta } from "@/components/photo-meta";
import { cn } from "@/lib/utils";

interface PhotoCarouselViewProps {
  photos: RenderablePhoto[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpenLightbox: (index: number) => void;
}

const swipeThreshold = 120;

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

export function PhotoCarouselView({
  photos,
  activeIndex,
  onActiveIndexChange,
  onOpenLightbox,
}: PhotoCarouselViewProps) {
  const reduceMotion = useReducedMotion();
  const activePhoto = photos[activeIndex];

  const selectPhoto = (nextIndex: number) => {
    onActiveIndexChange(wrapIndex(nextIndex, photos.length));
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -swipeThreshold) {
      selectPhoto(activeIndex + 1);
      return;
    }

    if (info.offset.x >= swipeThreshold) {
      selectPhoto(activeIndex - 1);
    }
  };

  return (
    <section
      className="space-y-5"
      aria-label="Carousel gallery"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          selectPhoto(activeIndex - 1);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          selectPhoto(activeIndex + 1);
        }
      }}
    >
      <div className="relative overflow-hidden bg-card/60 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => selectPhoto(activeIndex - 1)}
          className="absolute left-5 top-5 z-10 inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Previous photo"
        >
          <ChevronLeft className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => selectPhoto(activeIndex + 1)}
          className="absolute right-5 top-5 z-10 inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Next photo"
        >
          <ChevronRight className="size-4" />
        </button>

        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.button
              key={activePhoto.id}
              type="button"
              drag={reduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onClick={() => onOpenLightbox(activeIndex)}
              initial={reduceMotion ? false : { opacity: 0, x: 32, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -32, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative block w-full overflow-hidden rounded-[24px] bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ aspectRatio: activePhoto.aspectRatio }}
              aria-label={`Open ${activePhoto.alt} in lightbox`}
            >
              <motion.div layoutId={`photo-frame-${activePhoto.id}`} className="absolute inset-0">
                <PhotographyImage
                  photo={activePhoto}
                  variant="carousel"
                  alt={activePhoto.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 72vw, 100vw"
                  className="object-cover"
                  placeholder={activePhoto.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={activePhoto.blurDataUrl}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/0 to-transparent" />
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-left">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary-foreground/75 sm:text-[11px]">
                    Drag or click to open
                  </p>
                  <p className="mt-2 text-lg font-medium text-primary-foreground">
                    {activePhoto.title ?? activePhoto.alt}
                  </p>
                </div>
                <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70 sm:block">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(photos.length).padStart(2, "0")}
                </p>
              </div>
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <PhotoMeta photo={activePhoto} />

        <div className="border border-border/20 bg-card/50 p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75 sm:text-[11px]">
            Slide strip
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {photos.map((photo, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => selectPhoto(index)}
                  className={cn(
                    "relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-24 sm:w-20",
                    isActive && "border-primary/60 ring-1 ring-primary/40",
                  )}
                  aria-label={`View ${photo.alt}`}
                  aria-pressed={isActive}
                >
                  <PhotographyImage
                    photo={photo}
                    variant="thumb"
                    alt={photo.alt}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
