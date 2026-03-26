# Home Page Style Snippet

This is a portable version of the home page's visual vibe:

- dark-only editorial layout
- Geist + Geist Mono typography
- near-black background with soft off-white text
- narrow reading column with generous vertical rhythm
- mono uppercase labels for metadata and section headings
- understated cards, borders, and links

It is intentionally lighter than the full site. It keeps the visual language, not the project-specific shader effects.

## 1. `app/layout.tsx`

```tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} dark antialiased`}>
      <body>{children}</body>
    </html>
  );
}
```

If you are not using Next.js, load `Geist` and `Geist Mono` from Google Fonts or another font host and keep the same CSS variable names.

## 2. `app/globals.css`

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);

  --radius-sm: calc(var(--radius) * 0.75);
  --radius-md: calc(var(--radius) * 0.9);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.35);
}

:root {
  --background: oklch(0.098 0 0);
  --foreground: oklch(0.93 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.93 0 0);
  --primary: oklch(0.93 0 0);
  --primary-foreground: oklch(0.098 0 0);
  --muted: oklch(0.205 0 0);
  --muted-foreground: oklch(0.6 0 0);
  --accent: oklch(0.205 0 0);
  --accent-foreground: oklch(0.93 0 0);
  --border: oklch(1 0 0 / 10%);
  --ring: oklch(0.5 0 0);
  --radius: 0.85rem;
}

@layer base {
  html {
    @apply overflow-x-clip font-sans;
  }

  body {
    @apply min-h-screen overflow-x-clip bg-background text-foreground;
  }

  * {
    @apply border-border outline-ring/50;
  }
}

@layer components {
  .page-shell {
    @apply mx-auto w-full max-w-3xl px-4 sm:px-8 md:px-10 lg:px-12;
  }

  .section-label {
    @apply font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75 sm:text-[11px];
  }

  .subtle-link {
    @apply underline underline-offset-4 transition-colors hover:text-primary;
  }

  .editorial-card {
    @apply rounded-xl border border-border/80 bg-card/70 p-4 transition-colors;
  }
}
```

## 3. `components/home-vibe.tsx`

```tsx
import Link from "next/link";

const projects = [
  {
    title: "Project One",
    description: "A short sentence about what this is and why it matters.",
    label: "Product",
    href: "#",
  },
  {
    title: "Project Two",
    description: "Another concise description with a calm, confident tone.",
    label: "Research",
    href: "#",
  },
  {
    title: "Project Three",
    description: "Keep the copy compact so the layout stays airy and readable.",
    label: "Writing",
    href: "#",
  },
];

export function HomeVibe() {
  return (
    <main className="py-12 sm:py-16 md:py-20">
      <div className="page-shell">
        <header className="mb-12 space-y-5 sm:mb-16 sm:space-y-6">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl md:text-4xl">
            Your Name
          </h1>

          <p className="max-w-[42rem] text-base leading-7 text-muted-foreground sm:text-[1.075rem] sm:leading-8">
            I build software, write, and work on long-horizon ideas. Currently focused on{" "}
            <a href="#" className="subtle-link">
              an interesting company
            </a>
            . I care about craft, patience, and making things that feel quietly inevitable.
          </p>

          <p className="section-label pt-1">Some things I believe</p>

          <ul className="max-w-[40rem] space-y-1.5 text-[15px] text-muted-foreground sm:text-base">
            {[
              "Taste is often just sustained attention.",
              "Clear writing usually reflects clear thinking.",
              "Good work should feel calm before it feels loud.",
            ].map((item) => (
              <li key={item} className="relative pl-3 leading-6 sm:leading-7">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.8em] h-1 w-1 -translate-y-1/2 rounded-full bg-muted-foreground/80"
                />
                {item}
              </li>
            ))}
          </ul>
        </header>

        <section className="mb-12 sm:mb-14">
          <h2 className="section-label mb-5">Projects</h2>

          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <a
                key={project.title}
                href={project.href}
                className="editorial-card group block hover:bg-card"
              >
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                  <div className="min-w-0">
                    <p className="text-[15px] leading-6 font-medium text-foreground transition-colors group-hover:text-primary sm:text-base">
                      {project.title}
                    </p>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                      {project.description}
                    </p>
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 sm:ml-4 sm:shrink-0 sm:pt-0.5 sm:text-[11px]">
                    {project.label}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <Link
            href="#"
            className="mt-5 inline-flex items-center py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            See more &rarr;
          </Link>
        </section>

        <hr className="mb-6 border-border sm:mb-8" />

        <footer className="flex flex-wrap gap-x-4 gap-y-2 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/80 sm:gap-x-5 sm:text-[11px]">
          {["Github", "LinkedIn", "Writing", "Email"].map((item) => (
            <a
              key={item}
              href="#"
              className="inline-flex items-center py-1 transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </footer>
      </div>
    </main>
  );
}
```

## 4. Why this feels like the original home page

- Keep the content width narrow. The restraint is part of the aesthetic.
- Use `text-muted-foreground` for most body copy and reserve `text-foreground` for titles and emphasis.
- Use `font-mono` only for labels, metadata, and small navigation.
- Prefer space and typography over heavy decoration.
- Keep hover states subtle: mostly color shifts, not big transforms.
- If you add cards, keep them dark, slightly translucent, and softly bordered.

## 5. Optional extras

If you want to push it a little closer to the original site:

- Add `framer-motion` for gentle hover reveal and expansion.
- Add one visually rich accent area only, such as a shader, image, or animated canvas.
- Avoid turning every section into a card. The home page works because most of it is still just text and whitespace.
