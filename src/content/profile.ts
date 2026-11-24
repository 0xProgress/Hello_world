export type ProjectStatus = "active" | "stable" | "maintenance";

export interface Project {
  slug: string;
  name: string;
  summary: string;
  status: ProjectStatus;
  tags: string[];
  repoUrl: string;
  docsUrl?: string;
  packageUrl?: string;
  role?: string;
}

export interface Sponsor {
  name: string;
  url?: string;
  message: string;
  icon: "family" | "github";
}

export interface ProfileLinks {
  github: string;
  x: string;
  discord: string;
  email: string;
  sponsor: string;
  website: string;
}

export interface PersonProfile {
  name: string;
  handle: string;
  location: string;
  tagline: string;
  shortBio: string;
  metaDescription: string;
  skillsSummary: string;
  terminalLines: string[];
  educationNote: string;
  alumniOf: {
    name: string;
    alternateName: string;
  };
  knowsAbout: string[];
}

export const links: ProfileLinks = {
  github: "https://github.com/0xProgress",
  x: "https://x.com/0xProgress",
  discord: "https://discord.com/users/1214231706698252320",
  email: "progressuwhuseba@gmail.com",
  sponsor: "https://github.com/sponsors/0xProgress",
  website: "https://0xprogress.is-a.dev",
};

export const person: PersonProfile = {
  name: "Progress O. Uwhuseba",
  handle: "0xProgress",
  location: "Lagos, Nigeria",
  tagline: "I build small tools that punch above their weight.",
  shortBio:
    "CS student in Lagos. No internships, no employer, just 4+ years of studying and shipping. Behind the scenes is a classic developer graveyard of half-built ideas, but everything I actually ship is open source.",
  metaDescription:
    "CS student in Lagos building small tools that punch above their weight. Open source CLI tools, backend development, and developer utilities. Creator of waitfor, clippy, and is-a.dev maintainer.",
  skillsSummary: "Go · Python · Backend · OSS",
  terminalLines: [
    "self-taught. ships real things.",
    "Boot.dev → Go mastery in progress.",
    "GitHub Education Dev Pack holder.",
  ],
  educationNote:
    "This work is supported in part by the GitHub Education Developer Pack.",
  alumniOf: {
    name: "Lagos State University of Education",
    alternateName: "LASUED",
  },
  knowsAbout: [
    "Go",
    "Python",
    "Backend Development",
    "CLI Tools",
    "Open Source",
    "DevOps",
  ],
};

export const projects: Project[] = [
  {
    slug: "waitfor",
    name: "waitfor",
    summary: "Blocks until a condition is true. Tells you why it failed.",
    status: "active",
    tags: ["go", "cli", "devtools"],
    repoUrl: "https://github.com/0xProgress/waitfor",
    docsUrl: "https://github.com/0xProgress/waitfor#install",
  },
  {
    slug: "clippy",
    name: "clippy",
    summary: "Lightweight clipboard utility for the terminal.",
    status: "active",
    tags: ["go", "cli", "utility"],
    repoUrl: "https://github.com/0xProgress/clippy",
  },
  {
    slug: "automatic-dollop",
    name: "automatic-dollop",
    summary: "Automation and developer workflow utilities.",
    status: "active",
    tags: ["go", "automation", "devtools"],
    repoUrl: "https://github.com/0xProgress/automatic-dollop",
  },
  {
    slug: "is-a-dev",
    name: "is-a.dev",
    summary: "Free subdomains for developers. Thousands rely on it.",
    status: "active",
    tags: ["dns", "open-source", "community"],
    repoUrl: "https://github.com/is-a-dev/register",
    docsUrl: "https://is-a.dev",
    role: "maintainer",
  },
];

export const sponsors: Sponsor[] = [
  {
    name: "My Family",
    message:
      "To my family, who believed in me before I believed in myself. Your patience, your sacrifices, your quiet encouragement through every late night and every failed attempt. You gave me the space to fail forward, to keep building when it would have been easier to quit. Everything I ship carries a piece of your support. This is for you.",
    icon: "family",
  },
  {
    name: "GitHub Education",
    url: "https://education.github.com",
    message:
      "A massive shoutout to GitHub Education. The GitHub Student Developer Pack has been an absolute game-changer for my journey as a student building in public. Providing tools of this caliber for free to thousands of developers worldwide is nothing short of incredible. Thank you for backing builders before they even make it.",
    icon: "github",
  },
];
