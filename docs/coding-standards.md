# Coding Standards

## TypeScript
- Use strict TypeScript patterns and avoid `any` unless justified.
- Prefer explicit types at public boundaries and complex return shapes.
- Use `type` imports when importing types only.

## React and Next.js
- Keep components focused and composable.
- Prefer semantic HTML and accessible structure.
- Use `next/link` for internal navigation.
- External links opened in a new tab must include `rel="noopener noreferrer"`.

## Styling
- Use Tailwind utility classes consistently.
- Keep global CSS minimal and intentional.

## Quality Rules
- Avoid unresolved promises and misused async handlers.
- Keep console noise out of committed code (`console.warn`/`console.error` are acceptable when intentional).
- Treat lint warnings as failures in CI/local verification.

## Documentation Discipline
- If behavior or conventions change, update the relevant docs in `docs/` in the same change set.
