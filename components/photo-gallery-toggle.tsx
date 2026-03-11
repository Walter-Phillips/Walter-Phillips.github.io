"use client";

import { cn } from "@/lib/utils";

export type PhotoGalleryView = "grid" | "carousel";

interface PhotoGalleryToggleProps {
  view: PhotoGalleryView;
  onViewChange: (view: PhotoGalleryView) => void;
  className?: string;
}

const options: Array<{ value: PhotoGalleryView; label: string }> = [
  { value: "carousel", label: "List" },
  { value: "grid", label: "Grid" },
];

export function PhotoGalleryToggle({
  view,
  onViewChange,
  className,
}: PhotoGalleryToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]",
        className,
      )}
      role="tablist"
      aria-label="Photography gallery view"
    >
      {options.map((option, index) => {
        const isActive = option.value === view;

        return (
          <div key={option.value} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="text-muted-foreground/35"
              >
                |
              </span>
            ) : null}
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onViewChange(option.value)}
              className={cn(
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground/60 hover:text-muted-foreground",
              )}
            >
              {option.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
