# Verification

## Command Set

- `npm run format`: Prettier write pass across the repo.
- `npm run format:check`: Prettier check mode for CI or pre-PR validation.
- `npm run lint`: ESLint across the repo with `--max-warnings=0`.
- `npm run lint:fix`: ESLint auto-fix pass.
- `npm run typecheck`: TypeScript compile checks with no emit.
- `npm run test`: Unit test gate (Vitest).
- `npm run test:e2e`: E2E test gate (Playwright).

## Aggregated Gates

- `npm run verify:quick`
  - Runs lint, typecheck, and unit tests.
  - Use for fast local iteration and PR readiness.
- `npm run verify:full`
  - Runs quick gate, production build, and E2E tests.
  - Use before merging release-sensitive changes.

## Policy

- Code is not merge-ready unless `verify:quick` passes.
- Run `verify:full` for higher-risk changes (routing, layout, config, dependency changes).
- New verification rules should be added as scripts and documented here.
