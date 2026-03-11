"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PhotographyImage } from "@/components/photography-image";
import type { RenderablePhoto } from "@/lib/photography";
import { PhotoMeta } from "@/components/photo-meta";

interface PhotoLightboxProps {
  photos: RenderablePhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onActiveIndexChange: (index: number) => void;
}

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

export function PhotoLightbox({
  photos,
  activeIndex,
  onClose,
  onActiveIndexChange,
}: PhotoLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onActiveIndexChange(wrapIndex(activeIndex - 1, photos.length));
      }

      if (event.key === "ArrowRight") {
        onActiveIndexChange(wrapIndex(activeIndex + 1, photos.length));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, onActiveIndexChange, onClose, photos.length]);

  const activePhoto = activeIndex === null ? null : photos[activeIndex];
  const safeIndex = activeIndex ?? 0;

  return (
    <AnimatePresence>
      {activePhoto ? (
        <motion.div
          className="fixed inset-0 z-50 bg-background/92 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="flex h-full flex-col px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Close lightbox"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative flex min-h-0 items-center justify-center  border border-border/20 bg-card/50 p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => onActiveIndexChange(wrapIndex(safeIndex - 1, photos.length))}
                  className="absolute left-4 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/85 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <motion.div
                  layoutId={`photo-frame-${activePhoto.id}`}
                  className="flex max-h-full max-w-full items-center justify-center overflow-hidden"
                >
                  <PhotographyImage
                    photo={activePhoto}
                    variant="lightbox"
                    alt={activePhoto.alt}
                    width={activePhoto.width}
                    height={activePhoto.height}
                    sizes="100vw"
                    className="h-auto max-h-[calc(100vh-13rem)] w-auto max-w-full object-contain lg:max-h-[calc(100vh-9rem)]"
                    placeholder={activePhoto.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={activePhoto.blurDataUrl}
                  />
                </motion.div>

                <button
                  type="button"
                  onClick={() => onActiveIndexChange(wrapIndex(safeIndex + 1, photos.length))}
                  className="absolute right-4 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center border border-border/70 bg-background/85 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="flex min-h-0 flex-col justify-between border border-border/20 bg-card/50 p-5">
                <div className="space-y-5">
                  <PhotoMeta photo={activePhoto} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    {String(safeIndex + 1).padStart(2, "0")} /{" "}
                    {String(photos.length).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
