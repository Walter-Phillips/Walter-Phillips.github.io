import Link from "next/link";

export default function About() {
  return (
    <main className="py-12 sm:py-16 md:py-20">
      <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">About</h1>
        <Link
          href="/"
          className="inline-flex items-center py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back
        </Link>
      </div>

      <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-muted-foreground sm:space-y-5 sm:text-base">
        <p>
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

        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground sm:text-xs">
          Things I believe
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            Social norms are a safety mechanism, they shouldn&apos;t be the
            boundary of human experience.
          </li>
          <li>Progess isn&apos;t linear, things can get worse if we let them.</li>
          <li>Better and good are not the same thing.</li>
        </ul>
      </div>

    </main>
  );
}
