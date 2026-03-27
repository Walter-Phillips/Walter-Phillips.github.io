# Blog Workflow

## Author a post

1. Create a Markdown file in `content/blog`, for example `content/blog/my-new-post.md`.
2. Add frontmatter:

```md
---
title: My new post
summary: One or two lines that describe the post.
publishedAt: 2026-03-26
tags:
  - notes
  - markets
draft: true
---
```

3. Write the post body in Markdown.
4. Run `npm run dev`.
5. Preview:
   - `http://localhost:3000/blog`
   - `http://localhost:3000/blog/<slug>`

## Add Images

Blog images are remote CDN assets only. Add every blog image host to `NEXT_PUBLIC_BLOG_IMAGE_DELIVERY_BASE_URLS` as a comma-separated list of absolute base URLs, for example:

```bash
NEXT_PUBLIC_BLOG_IMAGE_DELIVERY_BASE_URLS=https://cdn.example.com/blog,https://images.example.com/blog
```

Use this cover-image frontmatter shape:

```md
---
title: My new post
summary: One or two lines that describe the post.
publishedAt: 2026-03-26
coverImage:
  src: https://cdn.example.com/blog/my-new-post/cover.jpg
  alt: A short description of the cover image.
  width: 1600
  height: 900
tags:
  - notes
  - markets
draft: true
---
```

Use this inline image syntax inside the post body:

```md
![Alt text](https://cdn.example.com/blog/my-new-post/chart.png "1600x900")
```

Rules:

- cover images appear only on the post page
- list pages stay text-only
- `alt` text is required for every blog image
- cover image dimensions are required
- inline images must include a `WIDTHxHEIGHT` title payload

## Publish a post

1. Remove `draft: true` or set `draft: false`.
2. Run `npm run verify:quick`.
3. Run `npm run verify:full`.
4. Merge and deploy.

Published posts are automatically included in:

- `/blog`
- `/blog/[slug]`
- `/blog/rss.xml`
- `/blog/feed.json`
- `/sitemap.xml`
