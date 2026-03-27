# Architecture

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Markdown content for the native blog under `content/blog`

## Routing and UI Structure

- Route files live under `app/**/page.tsx`.
- Shared shell and metadata live in `app/layout.tsx`.
- Keep root layout concerns global; route-specific width and content containers should live in the route tree so sections like photography can opt into wider layouts without affecting the rest of the site.
- Route content should remain simple and readable; shared abstractions should be introduced only when duplication is material.
- First-party blog content lives under `/blog`, with source files in `content/blog` and supporting loaders/helpers in `lib/**`.

## Boundaries

- Keep route-level rendering logic in route files.
- Keep reusable UI logic in dedicated modules once reused across multiple routes.
- Keep global styling in `app/globals.css`; avoid scattered global overrides.

## Config Ownership

- Linting: `eslint.config.mjs`
- TypeScript: `tsconfig.json`
- Runtime/build: `next.config.ts`
- Verification scripts and dependencies: `package.json`

## Change Policy

- Prefer incremental changes over broad rewrites.
- Any architectural change must update this document and `docs/coding-standards.md` in the same PR.
