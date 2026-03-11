import Link from "next/link";
import { projects } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";

export default function Projects() {
  return (
    <main className="py-12 sm:py-16 md:py-20">
      <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Projects</h1>
        <Link
          href="/"
          className="inline-flex items-center py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            id={`projects-${i}`}
            title={project.title}
            description={project.description}
            href={project.href}
            label={project.label}
            shader={project.shader}
          />
        ))}
      </div>
    </main>
  );
}
