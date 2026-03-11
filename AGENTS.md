# AGENTS.md

## Purpose

This repo is a personal site built with Next.js App Router. Keep this file short and use `docs/` as the source of truth for architecture, coding standards, and verification rules.

## Project Map

- `app/`: Routes, layout, and page components.
- `components/`: Reusable UI components.
- `lib/`: Shared utilities, data modules, and helpers.
- `public/`: Static assets.
- `docs/`: Agent-facing engineering standards and verification policy.
- `eslint.config.mjs`, `tsconfig.json`, `next.config.ts`: Core platform configuration.

## Allowed Edit Zones

- Safe default: `app/**`, `components/**`, `lib/**`, `docs/**`, tests, and configuration files for linting, typing, and verification.
- Be explicit in PR notes when modifying build/runtime config (`next.config.ts`, lint/TS configs, package scripts).
- Avoid broad refactors or dependency churn unless required for the task.

## Required Verification Commands

- Quick gate: `npm run verify:quick`
- Full gate: `npm run verify:full`
- CI runs `verify:quick` + `build` on every push to `main` and on all PRs (`.github/workflows/ci.yml`).

## Commit Convention

This repo enforces [Conventional Commits](https://www.conventionalcommits.org/) via commitlint.

Allowed prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `ci:`, `style:`, `perf:`, `build:`.

Example: `feat: add dark-mode toggle to settings page`

## PR Checklist

Use the repo's PR template (`.github/PULL_REQUEST_TEMPLATE.md`). Every PR should include:

- **Summary** -- what and why.
- **Changes** -- key modifications.
- **Verification** -- which gate(s) passed.
- **Docs Updated** -- confirm relevant docs are current.

## Subagent-First Policy

- Default behavior: for any task with unknowns, planning needs, or likely multi-file impact, spawn subagents for research and planning before editing code.
- Minimum expectation on non-trivial tasks:
  - One research subagent to gather codebase/context findings.
  - One planning subagent to propose an execution plan from those findings.
- Before code edits, produce a short "Findings" and "Plan" summary based on subagent output.
- Keep implementation local to the primary agent after the plan is accepted, unless delegated execution is explicitly needed.

### Exceptions

- Trivial, low-risk one-file edits with clear requirements may proceed without subagents.
- If subagent use is skipped, document the reason in the task/PR notes.

## Do

- Follow `docs/architecture.md` and `docs/coding-standards.md`.
- Prefer small, focused diffs.
- Add or update docs when behavior or conventions change.

## Do Not

- Bypass lint/type/test checks.
- Introduce architectural patterns that conflict with `docs/architecture.md` without updating docs first.
- Mix unrelated changes in the same PR.
