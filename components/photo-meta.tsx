import type { RenderablePhoto } from "@/lib/photography";
import { cn } from "@/lib/utils";

interface PhotoMetaProps {
  photo: RenderablePhoto;
  className?: string;
  compact?: boolean;
}

export function PhotoMeta({
  photo,
  className,
  compact = false,
}: PhotoMetaProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {photo.capturedAt ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 sm:text-[11px]">
            {photo.capturedAt}
          </p>
        ) : null}
      </div>

      {photo.description ? (
        <p
          className={cn(
            "max-w-2xl text-muted-foreground",
            compact ? "text-sm leading-6" : "text-[15px] leading-7 sm:text-base",
          )}
        >
          {photo.description}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {photo.location ? (
          <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] text-muted-foreground">
            {photo.location}
          </span>
        ) : null}
        {photo.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
