# AGENTS.md

## Purpose
This repo is a personal site built with Next.js App Router. Keep this file short and use `docs/` as the source of truth for architecture, coding standards, and verification rules.

## Project Map
- `app/`: Routes, layout, and page components.
- `public/`: Static assets.
- `docs/`: Agent-facing engineering standards and verification policy.
- `eslint.config.mjs`, `tsconfig.json`, `next.config.ts`: Core platform configuration.

## Allowed Edit Zones
- Safe default: `app/**`, `docs/**`, tests, and configuration files for linting, typing, and verification.
- Be explicit in PR notes when modifying build/runtime config (`next.config.ts`, lint/TS configs, package scripts).
- Avoid broad refactors or dependency churn unless required for the task.

## Required Verification Commands
- Quick gate: `npm run verify:quick`
- Full gate: `npm run verify:full`

## Do
- Follow `docs/architecture.md` and `docs/coding-standards.md`.
- Prefer small, focused diffs.
- Add or update docs when behavior or conventions change.

## Do Not
- Bypass lint/type/test checks.
- Introduce architectural patterns that conflict with `docs/architecture.md` without updating docs first.
- Mix unrelated changes in the same PR.
