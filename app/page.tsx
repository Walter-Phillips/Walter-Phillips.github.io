import Link from "next/link";
import { projects, writing } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { WritingList } from "@/components/writing-list";

const PREVIEW_COUNT = 3;

const footerLinks = [
  {
    label: "Github",
    href: "https://github.com/Walter-Phillips",
    kind: "external",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/@_Lalter",
    kind: "external",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/walter-phillips-1922741a5/",
    kind: "external",
  },
  {
    label: "About",
    href: "/about",
    kind: "internal",
  },
  {
    label: "Email",
    href: "mailto:walter@example.com",
    kind: "mailto",
  },

] as const;

export default function Home() {
  return (
    <main className="py-12 sm:py-16 md:py-20">
      <header className="mb-12 space-y-5 sm:mb-16 sm:space-y-6">
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl md:text-4xl">
          Walter Phillips
        </h1>
        <p className="max-w-156 text-base leading-7 text-muted-foreground sm:text-[1.075rem] sm:leading-8">
          Currently working on{" "}
          <a
            href="https://www.meridian.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Meridian
          </a>
          .
        I enjoy football (soccer), photography, physics, and climbing. I&apos;m trying to climb V12 by the end of 2026. My only goal in life is
          to open a school. Everything else is in service of that.
        </p>

        <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 sm:text-[11px]">
          Some things I believe:
        </p>
        <ul className="max-w-152 space-y-1.5 text-[15px] text-muted-foreground sm:text-base">
          <li className="relative pl-3 leading-6 sm:leading-7">
            <span
              aria-hidden="true"
              className="absolute left-0 top-[0.8em] h-1 w-1 -translate-y-1/2 rounded-full bg-muted-foreground/80"
            />
            Social norms are a safety mechanism, they shouldn&apos;t be the
            boundary of human experience.
          </li>
          <li className="relative pl-3 leading-6 sm:leading-7">
            <span
              aria-hidden="true"
              className="absolute left-0 top-[0.8em] h-1 w-1 -translate-y-1/2 rounded-full bg-muted-foreground/80"
            />
            Progess isn&apos;t linear, things can get worse if  let them.
          </li>
          <li className="relative pl-3 leading-6 sm:leading-7">
            <span
              aria-hidden="true"
              className="absolute left-0 top-[0.8em] h-1 w-1 -translate-y-1/2 rounded-full bg-muted-foreground/80"
            />
            Better and good are not the same thing.
          </li>
        </ul>
      </header>

      <section className="mb-12 sm:mb-14">
        <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75 sm:text-[11px]">
          Projects
        </h2>
        <div className="flex flex-col gap-3">
          {projects.slice(0, PREVIEW_COUNT).map((project, i) => (
            <ProjectCard
              key={project.title}
              id={`home-${i}`}
              title={project.title}
              description={project.description}
              href={project.href}
              label={project.label}
              shader={project.shader}
            />
          ))}
        </div>
        <Link
          href="/projects"
          className="mt-5 inline-flex items-center py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          See more &rarr;
        </Link>
      </section>

      <section className="mb-12 sm:mb-14">
        <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75 sm:text-[11px]">
          Writing
        </h2>
        {writing.length > 0 ? (
          <WritingList items={writing.slice(0, PREVIEW_COUNT)} />
        ) : (
          <p className="text-sm text-muted-foreground">Coming soon.</p>
        )}
        <Link
          href="/writing"
          className="mt-5 inline-flex items-center py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          See more &rarr;
        </Link>
      </section>

      <hr className="mb-6 border-border sm:mb-8" />

      <footer className="flex flex-wrap gap-x-4 gap-y-2 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/80 sm:gap-x-5 sm:text-[11px]">
        {footerLinks.map((link) => {
          if (link.kind === "internal") {
            return (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center py-1 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            );
          }

          return (
            <a
              key={link.label}
              href={link.href}
              {...(link.kind === "external"
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center py-1 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          );
        })}
      </footer>
    </main>
  );
}
