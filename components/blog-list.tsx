"use client";

import Link from "next/link";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AnimatedShape, shapes } from "@/components/animated-shape";
import type { BlogPost } from "@/lib/blog";

type BlogListProps = {
  items: BlogPost[];
};

function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function BlogList({ items }: BlogListProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      {items.map((post, i) => (
        <BlogItem
          key={post.slug}
          post={post}
          shape={shapes[i % shapes.length]}
          showShape={!reduceMotion}
        />
      ))}
    </div>
  );
}

function BlogItem({
  post,
  shape,
  showShape,
}: {
  post: BlogPost;
  shape: (typeof shapes)[number];
  showShape: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={post.canonicalPath}
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
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 sm:block sm:shrink-0 sm:pt-0.5 sm:text-[11px]">
            {formatBlogDate(post.publishedAt)}
          </span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 sm:hidden">
          {formatBlogDate(post.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
