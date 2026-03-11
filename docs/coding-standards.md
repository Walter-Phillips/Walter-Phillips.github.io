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

## Design System
- The site uses shadcn/ui v4 with Tailwind CSS 4 CSS variables for theming.
- The site is dark-only (`dark` class on `<html>`). Background is `#0A0A0A`.
- Always use design tokens instead of raw color values:
  - `bg-background` / `text-foreground` for base surfaces and text.
  - `bg-card` / `text-card-foreground` for elevated cards.
  - `bg-primary` / `text-primary-foreground` for primary actions (buttons, CTAs).
  - `text-muted-foreground` for secondary/subdued text.
  - `border-border` for borders and dividers.
  - `bg-accent` / `text-accent-foreground` for hover/active states on surfaces.
- Use the `cn()` utility from `@/lib/utils` for conditional class merging.
- Add shadcn components via `npx shadcn@latest add <component>`.

## Quality Rules
- Avoid unresolved promises and misused async handlers.
- Keep console noise out of committed code (`console.warn`/`console.error` are acceptable when intentional).
- Treat lint warnings as failures in CI/local verification.

## Documentation Discipline
- If behavior or conventions change, update the relevant docs in `docs/` in the same change set.
