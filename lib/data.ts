export type WritingEntry = {
  title: string;
  venue: string;
  date: string;
  publishedAt: string;
  href: string;
};

export const projects = [
  {
    title: "Meridian Research",
    description: "Meridian is a platform for interacting with financial agents.",
    href: "https://www.meridian.app/",
    label: "Work",
    shader: "meridian",
  },
  {
    title: "Sail",
    description: "Sail is a decentralized order book exchange built on Fuel.",
    href: "https://www.sail.exchange/",
    label: "Work",
    shader: "sail",
  },
  {
    title: "Zage",
    description: "Zage is closed loop payments infrastructure, giving merchants no fees.",
    href: "https://www.ycombinator.com/companies/zage",
    label: "Work",
    shader: "zage",
  },
];

export const writing: WritingEntry[] = [];
