export type ResumeEntry = {
  title: string;
  organization: string;
  location?: string;
  start: string;
  end: string;
  summary: string;
  highlights?: string[];
};

export type ResumeEducation = {
  institution: string;
  credential: string;
  start?: string;
  end?: string;
  summary?: string;
};

export type ResumeData = {
  name: string;
  headline: string;
  location?: string;
  email?: string;
  github?: string;
  summary: string;
  skills: string[];
  qualifications: string[];
  hobbies: string[];
  experience: ResumeEntry[];
  education: ResumeEducation[];
  notes: string[];
};

export const resume: ResumeData = {
  name: "Walter Phillips",
  headline: "Software engineer focused on markets, product development, and research",
  location: "San Francisco, CA",
  email: "phillips.walter.n@gmail.com",
  github: "https://github.com/Walter-Phillips",
  summary:
    "Software engineer with experience building data infrastructure, trading systems, developer tooling, and consumer-facing product features. Currently working on Meridian and interested in physics, football, rock climbing, and long-term work toward opening a school.",
  skills: ["TypeScript", "Rust", "Sway", "Python"],
  qualifications: ["Emergency Medical Response Practitioner (2018)"],
  hobbies: ["Football (Soccer)", "Rock Climbing"],
  experience: [
    {
      title: "Software Engineer",
      organization: "Meridian",
      location: "San Francisco, CA",
      start: "May 2025",
      end: "Present",
      summary:
        "Developed and optimized data infrastructure and web-based product features for investing workflows.",
      highlights: [
        "Developed and optimized data infrastructure to enable real-time querying of user prices and portfolios.",
        "Engineered a data pipeline that supports constraining a universe of approximately 1,000,000 assets to approximately 4,000 investable assets.",
        "Led the development of web-based product features, including interactive dashboards for asset order flow, performance tracking, and a chat interface.",
      ],
    },
    {
      title: "Co-founder",
      organization: "Sail",
      location: "San Francisco, CA",
      start: "December 2022",
      end: "March 2025",
      summary:
        "Built core exchange infrastructure, developer tooling, and commercial relationships for an onchain order book.",
      highlights: [
        "Built the first state-minimized onchain order book.",
        "Built a Rust SDK for market makers to provide liquidity on Sail.",
        "Closed deals for market makers to provide approximately $10,000,000 in liquidity on the exchange.",
        "Awarded $200,000 in grant funding for contributions to the Fuel ecosystem.",
      ],
    },
    {
      title: "Software Engineer",
      organization: "Zage",
      location: "San Francisco, CA",
      start: "August 2021",
      end: "October 2022",
      summary:
        "Built customer-facing checkout flows, internal tools, and retention features for a payments product.",
      highlights: [
        "Used React to create a consumer-facing checkout application that served thousands of customers and processed approximately $100,000.",
        "Built tools to support developer experience and allow non-technical team members to make transactions when responding to support tickets.",
        "Built a gamified rewards platform that saw customer retention increase by approximately 300% after launch.",
      ],
    },
  ],
  education: [
    {
      institution: "Bard College",
      credential: "Bachelors of Arts in Physics and Engineering",
      start: "December 2017",
      end: "2021",
      summary:
        "Completed 117 credits toward a BA. Recipient of the W.E.B. Du Bois Scholarship and Simon's Rock Merit Scholarship. Captain of the soccer team and granted the Coach's Award for Most Valuable Player in 2017 and 2019.",
    },
    {
      institution: "Campion College, Kingston, Jamaica",
      credential: "High School Diploma",
      end: "2017",
    },
  ],
  notes: [
    "Education details are recorded as provided and may need normalization if a different final degree description should appear on the site.",
  ],
};
