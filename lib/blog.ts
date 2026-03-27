import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const blogDirectory = path.join(process.cwd(), "content/blog");
const isProduction = process.env.NODE_ENV === "production";
const INLINE_IMAGE_DIMENSIONS_PATTERN = /^(\d+)\s*x\s*(\d+)$/i;

export type BlogPostCoverImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type BlogFrontmatter = {
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  draft?: boolean;
  coverImage?: BlogPostCoverImage;
};

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  draft: boolean;
  coverImage?: BlogPostCoverImage;
  content: string;
  html: string;
  canonicalPath: string;
};

type BlogQueryOptions = {
  includeDrafts?: boolean;
};

function getPostSlug(fileName: string) {
  return fileName.replace(/\.(md|markdown)$/i, "");
}

function isMarkdownFile(fileName: string) {
  return /\.(md|markdown)$/i.test(fileName);
}

function normalizeDateValue(value: unknown) {
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  return undefined;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isRemoteHttpsUrl(value: string) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function validateInlineImages(slug: string, content: string) {
  const tree = remark().use(remarkGfm).parse(content) as unknown as {
    children?: Array<Record<string, unknown>>;
  };

  function visit(node: Record<string, unknown>) {
    if (node.type === "image") {
      const alt = typeof node.alt === "string" ? node.alt.trim() : "";
      const url = typeof node.url === "string" ? node.url : "";
      const title = typeof node.title === "string" ? node.title.trim() : "";

      if (!alt) {
        throw new Error(`Blog post "${slug}" has an inline image without alt text.`);
      }

      if (!url || !isRemoteHttpsUrl(url)) {
        throw new Error(
          `Blog post "${slug}" has an inline image with an invalid remote https URL.`,
        );
      }

      if (!INLINE_IMAGE_DIMENSIONS_PATTERN.test(title)) {
        throw new Error(
          `Blog post "${slug}" has an inline image without a valid WIDTHxHEIGHT title payload.`,
        );
      }
    }

    const children = Array.isArray(node.children)
      ? (node.children as Array<Record<string, unknown>>)
      : [];

    for (const child of children) {
      visit(child);
    }
  }

  for (const child of tree.children ?? []) {
    visit(child as Record<string, unknown>);
  }
}

async function renderMarkdownToHtml(markdown: string) {
  const rendered = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return rendered.toString();
}

function normalizeCoverImage(slug: string, value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Blog post "${slug}" has an invalid coverImage value.`);
  }

  const coverImage = value as Record<string, unknown>;
  const src = typeof coverImage.src === "string" ? coverImage.src : undefined;
  const alt = typeof coverImage.alt === "string" ? coverImage.alt.trim() : undefined;
  const width = coverImage.width;
  const height = coverImage.height;

  if (!src || !isRemoteHttpsUrl(src)) {
    throw new Error(`Blog post "${slug}" has a coverImage with an invalid remote https URL.`);
  }

  if (!alt) {
    throw new Error(`Blog post "${slug}" coverImage is missing alt text.`);
  }

  if (!isPositiveInteger(width) || !isPositiveInteger(height)) {
    throw new Error(
      `Blog post "${slug}" coverImage must include positive integer width and height.`,
    );
  }

  return {
    src,
    alt,
    width,
    height,
  } satisfies BlogPostCoverImage;
}

function normalizeFrontmatter(slug: string, data: Record<string, unknown>): BlogFrontmatter {
  const { title, summary, publishedAt, updatedAt, tags, draft, coverImage } = data;
  const normalizedPublishedAt = normalizeDateValue(publishedAt);
  const normalizedUpdatedAt = normalizeDateValue(updatedAt);

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error(`Blog post "${slug}" is missing a valid title.`);
  }

  if (typeof summary !== "string" || summary.trim().length === 0) {
    throw new Error(`Blog post "${slug}" is missing a valid summary.`);
  }

  if (!normalizedPublishedAt) {
    throw new Error(`Blog post "${slug}" is missing a valid publishedAt date.`);
  }

  if (updatedAt && !normalizedUpdatedAt) {
    throw new Error(`Blog post "${slug}" has an invalid updatedAt date.`);
  }

  if (tags && (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string"))) {
    throw new Error(`Blog post "${slug}" has invalid tags.`);
  }

  if (draft && typeof draft !== "boolean") {
    throw new Error(`Blog post "${slug}" has an invalid draft flag.`);
  }

  const normalizedTags = Array.isArray(tags) ? tags : [];
  const normalizedDraft = typeof draft === "boolean" ? draft : false;
  const normalizedCoverImage = normalizeCoverImage(slug, coverImage);

  return {
    title,
    summary,
    publishedAt: normalizedPublishedAt,
    updatedAt: normalizedUpdatedAt,
    tags: normalizedTags,
    draft: normalizedDraft,
    coverImage: normalizedCoverImage,
  };
}

async function readBlogPostFromFile(fileName: string): Promise<BlogPost> {
  const slug = getPostSlug(fileName);
  const filePath = path.join(blogDirectory, fileName);
  const source = await readFile(filePath, "utf8");
  const { content, data } = matter(source);
  const frontmatter = normalizeFrontmatter(slug, data);
  validateInlineImages(slug, content);
  const html = await renderMarkdownToHtml(content);

  return {
    slug,
    title: frontmatter.title,
    summary: frontmatter.summary,
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    tags: frontmatter.tags ?? [],
    draft: frontmatter.draft ?? false,
    coverImage: frontmatter.coverImage,
    content,
    html,
    canonicalPath: `/blog/${slug}`,
  };
}

function sortPostsDescending(posts: BlogPost[]) {
  return [...posts].sort(
    (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
  );
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function getAllPosts(options: BlogQueryOptions = {}) {
  const { includeDrafts = !isProduction } = options;
  const fileNames = await readdir(blogDirectory);
  const posts = await Promise.all(
    fileNames.filter(isMarkdownFile).map((fileName) => readBlogPostFromFile(fileName)),
  );

  return sortPostsDescending(posts).filter((post) => includeDrafts || !post.draft);
}

export async function getPublishedPosts() {
  return getAllPosts({ includeDrafts: false });
}

export async function getPostBySlug(slug: string, options: BlogQueryOptions = {}) {
  const posts = await getAllPosts(options);
  return posts.find((post) => post.slug === slug);
}
