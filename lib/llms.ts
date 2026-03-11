import { projects, writing } from "@/lib/data";
import { resume } from "@/lib/resume";

const site = {
  name: "Walter Phillips",
  url: "https://walter-phillips.github.io",
  description: "Walter Phillips personal website.",
  about: [
    "Currently working on Meridian.",
    "Interests include football (soccer), photography, physics, and climbing.",
    "Current climbing goal: V12 by the end of 2026.",
    "Long-term goal: open a school.",
  ],
  beliefs: [
    "Social norms are a safety mechanism; they should not be the boundary of human experience.",
    "Progress is not linear; things can get worse if we let them.",
    "Better and good are not the same thing.",
  ],
  links: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Writing", href: "/writing" },
    { label: "GitHub", href: resume.github ?? "https://github.com/Walter-Phillips" },
    { label: "Twitter", href: "https://twitter.com/@_Lalter" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/walter-phillips-1922741a5/",
    },
    { label: "Email", href: `mailto:${resume.email ?? "phillips.walter.n@gmail.com"}` },
  ],
} as const;

function section(title: string, lines: string[]) {
  return [title, ...lines, ""].join("\n");
}

export function buildLlmsText() {
  const projectLines = projects.map((project) =>
    [
      `- ${project.title}`,
      `  Label: ${project.label}`,
      `  Description: ${project.description}`,
      `  URL: ${project.href}`,
    ].join("\n"),
  );

  const writingLines = writing.map((entry) =>
    [
      `- ${entry.title}`,
      `  Venue: ${entry.venue}`,
      `  Date: ${entry.date}`,
      `  URL: ${entry.href}`,
    ].join("\n"),
  );

  const experienceLines =
    resume.experience.length > 0
      ? resume.experience.flatMap((entry) => {
          const lines = [
            `- ${entry.title} at ${entry.organization}`,
            ...(entry.location ? [`  Location: ${entry.location}`] : []),
            `  Dates: ${entry.start} - ${entry.end}`,
            `  Summary: ${entry.summary}`,
          ];

          if (entry.highlights?.length) {
            lines.push(...entry.highlights.map((item) => `  Highlight: ${item}`));
          }

          return lines;
        })
      : ["- No experience entries have been added yet."];

  const educationLines =
    resume.education.length > 0
      ? resume.education.flatMap((entry) => {
          const lines = [
            `- ${entry.credential} at ${entry.institution}`,
          ];

          if (entry.start || entry.end) {
            lines.push(`  Dates: ${entry.start ?? "Unknown"} - ${entry.end ?? "Unknown"}`);
          }

          if (entry.summary) {
            lines.push(`  Summary: ${entry.summary}`);
          }

          return lines;
        })
      : ["- No education entries have been added yet."];

  const skillLines =
    resume.skills.length > 0
      ? resume.skills.map((skill) => `- ${skill}`)
      : ["- No skills have been added yet."];

  return [
    section("LLMS.txt", [
      `Site: ${site.name}`,
      `Canonical URL: ${site.url}`,
      `Description: ${site.description}`,
      "Purpose: Personal website with profile, projects, and writing links.",
    ]),
    section("About", site.about.map((item) => `- ${item}`)),
    section("Beliefs", site.beliefs.map((item) => `- ${item}`)),
    section(
      "Pages",
      site.links
        .filter((link) => link.href.startsWith("/"))
        .map((link) => `- ${link.label}: ${new URL(link.href, site.url).toString()}`),
    ),
    section(
      "Profiles and Contact",
      site.links
        .filter((link) => !link.href.startsWith("/"))
        .map((link) => `- ${link.label}: ${link.href}`),
    ),
    section("Projects", projectLines),
    section("Writing", writingLines),
    section("Resume", [
      `Name: ${resume.name}`,
      `Headline: ${resume.headline}`,
      ...(resume.location ? [`Location: ${resume.location}`] : []),
      ...(resume.email ? [`Email: ${resume.email}`] : []),
      ...(resume.github ? [`GitHub: ${resume.github}`] : []),
      `Summary: ${resume.summary}`,
    ]),
    section("Resume Skills", skillLines),
    section(
      "Resume Qualifications",
      resume.qualifications.length > 0
        ? resume.qualifications.map((item) => `- ${item}`)
        : ["- No qualifications have been added yet."],
    ),
    section(
      "Resume Hobbies",
      resume.hobbies.length > 0
        ? resume.hobbies.map((item) => `- ${item}`)
        : ["- No hobbies have been added yet."],
    ),
    section("Resume Experience", experienceLines),
    section("Resume Education", educationLines),
    section("Resume Notes", resume.notes.map((note) => `- ${note}`)),
  ].join("\n");
}
