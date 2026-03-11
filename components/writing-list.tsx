"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AnimatedShape, shapes } from "@/components/animated-shape";
import type { writing as writingData } from "@/lib/data";

type WritingEntry = (typeof writingData)[number];

export function WritingList({ items }: { items: WritingEntry[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      {items.map((post, i) => (
        <WritingItem
          key={post.title}
          post={post}
          shape={shapes[i % shapes.length]}
          showShape={!reduceMotion}
        />
      ))}
    </div>
  );
}

function WritingItem({
  post,
  shape,
  showShape,
}: {
  post: WritingEntry;
  shape: (typeof shapes)[number];
  showShape: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-3 rounded-xl border border-transparent py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-row sm:items-start sm:justify-between sm:gap-4 md:-ml-10 md:w-[calc(100%+2.5rem)] md:pl-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {showShape ? (
        <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 md:block">
          <AnimatedShape shape={shape} isHovered={isHovered} size={40} />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
          <div className="min-w-0">
            <p className="text-[15px] leading-6 font-medium text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary break-words sm:text-base">
              {post.title}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">{post.venue}</p>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 sm:block sm:shrink-0 sm:pt-0.5 sm:text-[11px]">
            {post.date}
          </span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 sm:hidden">
          {post.date}
        </p>
      </div>
    </a>
  );
}
