export type Person = {
  name: string;
  handle: string;
  location: string;
  city: string;
  country: string;
  tagline: string;
  shortBio: string;
  focus: string;
  copyrightName: string;
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  status: "active" | "stable" | "maintenance";
  tags: string[];
  repoUrl?: string;
  docsUrl?: string;
  packageUrl?: string;
  role?: string;
};

export type Sponsor = {
  name: string;
  url: string;
  message: string;
  isGithub?: boolean;
  isFamily?: boolean;
};

export type Links = {
  github: string;
  x: string;
  discord: string;
  email: string;
  sponsor: string;
};

export const person: Person = {
  name: "Progress O. Uwhuseba",
  handle: "0xProgress",
  location: "Lagos, Nigeria",
  city: "Lagos",
  country: "Nigeria",
  tagline: "I build small tools that punch above their weight.",
  shortBio:
    "CS student in Lagos. No internships, no employer, just 4 years of building things because I couldn't stop. Everything I ship is open source.",
  focus: "Rust · Go · Python · Backend · OSS",
  copyrightName: "Progress Uwhuseba",
};

export const projects: Project[] = [
  {
    slug: "envdiff",
    name: "envdiff",
    summary: "Compare .env files. Zero config. CI-native.",
    status: "stable",
    tags: ["python", "cli", "security"],
    packageUrl: "https://pypi.org/project/envdiff/",
    repoUrl: "https://github.com/0xProgress/envdiff",
  },
  {
    slug: "waitfor",
    name: "waitfor",
    summary: "Blocks until a condition is true. Tells you why it failed.",
    status: "active",
    tags: ["go", "cli", "devtools"],
    repoUrl: "https://github.com/0xProgress/waitfor",
  },
  {
    slug: "retry",
    name: "retry",
    summary: "Retry any command with exponential backoff.",
    status: "active",
    tags: ["cli", "devtools", "bash"],
    repoUrl: "https://github.com/0xProgress/retry",
  },
  {
    slug: "is-a-dev",
    name: "is-a.dev",
    summary: "Free subdomains for developers. Thousands rely on it.",
    status: "stable",
    tags: ["dns", "open-source", "community"],
    repoUrl: "https://github.com/is-a-dev/register",
    role: "maintainer",
  },
];

export const sponsors: Sponsor[] = [
  {
    name: "My Family",
    url: "#sponsor",
    message:
      "To my family, who believed in me before I believed in myself. Your patience, your sacrifices, your quiet encouragement through every late night and every failed attempt. You gave me the space to fail forward, to keep building when it would have been easier to quit. Everything I ship carries a piece of your support. This is for you.",
    isFamily: true,
  },
  {
    name: "GitHub Education",
    url: "https://education.github.com",
    message:
      "A massive shoutout to GitHub Education. The GitHub Student Developer Pack has been an absolute game-changer for my journey as a student building in public. Providing tools of this caliber for free to thousands of developers worldwide is nothing short of incredible. Thank you for backing builders before they even make it.",
    isGithub: true,
  },
];

export const links: Links = {
  github: "https://github.com/0xProgress",
  x: "https://x.com/0xProgress",
  discord: "https://discord.com/users/1214231706698252320",
  email: "mailto:progressuwhuseba@gmail.com",
  sponsor: "https://github.com/sponsors/0xProgress",
};
