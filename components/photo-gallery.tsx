"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { RenderablePhoto } from "@/lib/photography";
import { PhotoGalleryToggle, type PhotoGalleryView } from "@/components/photo-gallery-toggle";
import { PhotoGridView } from "@/components/photo-grid-view";
import { PhotoCarouselView } from "@/components/photo-carousel-view";
import { PhotoLightbox } from "@/components/photo-lightbox";

interface PhotoGalleryProps {
  photos: RenderablePhoto[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [view, setView] = useState<PhotoGalleryView>("grid");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <section className="space-y-6">
        <div className="p-3 sm:p-4">
          <AnimatePresence initial={false} mode="wait">
            {view === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <PhotoGridView
                  key={photos.length}
                  photos={photos}
                  onSelect={(index) => {
                    setActiveIndex(index);
                    setLightboxIndex(index);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="carousel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <PhotoCarouselView
                  photos={photos}
                  activeIndex={activeIndex}
                  onActiveIndexChange={setActiveIndex}
                  onOpenLightbox={(index) => {
                    setActiveIndex(index);
                    setLightboxIndex(index);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <PhotoLightbox
        photos={photos}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onActiveIndexChange={(index) => {
          setActiveIndex(index);
          setLightboxIndex(index);
        }}
      />
      <PhotoGalleryToggle
        view={view}
        onViewChange={setView}
        className="text-[12px] tracking-[0.24em]"
      />
    </>
  );
}
