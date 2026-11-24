export type ProjectStatus = "active" | "stable" | "maintenance";

export interface Project {
  slug: string;
  name: string;
  summary: string;
  problem: string;
  status: ProjectStatus;
  tags: string[];
  programmingLanguage: string;
  license?: string;
  installSnippet: string;
  installLang: string;
  repoUrl: string;
  docsUrl?: string;
  packageUrl?: string;
  packageLabel?: string;
  role?: string;
}

export interface NowItem {
  label: string;
  detail: string;
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
  skillsSummary: "Go · Python · Bash · Backend · OSS",
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
  knowsAbout: ["Go", "Python", "Backend development", "Open source"],
};

export const nowItems: NowItem[] = [
  {
    label: "Go & CLI Tooling",
    detail:
      "Hardening cross-platform releases and failure diagnostics for waitfor while sharpening concurrency patterns through Boot.dev.",
  },
  {
    label: "is-a.dev Maintenance",
    detail:
      "Reviewing subdomain pull requests, validating DNS records, and keeping community infrastructure reliable for thousands of developers.",
  },
  {
    label: "Building in Public",
    detail:
      "Turning private developer-graveyard experiments into small, zero-bloat open-source utilities and documenting the process in /writing.",
  },
];

export const projects: Project[] = [
  {
    slug: "waitfor",
    name: "waitfor",
    summary: "Blocks until a condition is true, or tells you why it wasn't.",
    problem:
      "Replacing fragile sleep loops in CI and local scripts usually means adopting a polling wrapper that only says 'timed out' when something hangs. waitfor checks TCP ports, HTTP endpoints, files, processes, and shell commands in parallel—and prints the exact failure state and diagnostic hint when a check fails.",
    status: "active",
    tags: ["go", "cli", "devtools"],
    programmingLanguage: "Go",
    license: "https://opensource.org/licenses/MIT",
    installLang: "bash",
    installSnippet: `go install github.com/0xProgress/waitfor@latest

# Wait for Postgres & an HTTP health check at once
waitfor all --timeout 30s port 5432 http localhost:8080/health`,
    repoUrl: "https://github.com/0xProgress/waitfor",
    docsUrl: "https://github.com/0xProgress/waitfor/blob/main/docs/ci-cd.md",
    packageUrl: "https://pkg.go.dev/github.com/0xProgress/waitfor",
    packageLabel: "pkg.go.dev",
  },
  {
    slug: "clippy",
    name: "clippy",
    summary:
      "Copy an entire project to your clipboard as one clean Markdown document.",
    problem:
      "Sharing multi-file context with an AI chat, bug report, or gist usually requires manually copying files one by one or accidentally pasting build artifacts and binaries. clippy walks a directory as a single zero-dependency Bash script, respects nested .gitignore rules, skips binary files, and puts a structured Markdown bundle with a table of contents straight onto your X11 clipboard.",
    status: "active",
    tags: ["bash", "cli", "utility"],
    programmingLanguage: "Bash",
    license: "https://opensource.org/licenses/MIT",
    installLang: "bash",
    installSnippet: `git clone https://github.com/0xProgress/clippy.git
cd clippy && mkdir -p ~/.local/bin
cp clippy ~/.local/bin/clippy && chmod +x ~/.local/bin/clippy

# Copy the current repo to your clipboard
clippy`,
    repoUrl: "https://github.com/0xProgress/clippy",
    docsUrl: "https://github.com/0xProgress/clippy#usage",
    packageUrl: "https://github.com/0xProgress/clippy/releases",
    packageLabel: "GitHub Releases",
  },
  {
    slug: "automatic-dollop",
    name: "automatic-dollop",
    summary:
      "Daily GitHub Actions cron job that renews free KataBump servers before expiry.",
    problem:
      "Free KataBump servers expire every four days unless manually renewed inside a narrow two-day window, and existing automation scripts silently marked crashes and bad credentials as successes. automatic-dollop runs daily via Chrome DevTools Protocol on GitHub Actions, renews every server per account, reports explicit outcomes, and sends Telegram alerts when manual intervention is needed.",
    status: "active",
    tags: ["javascript", "automation", "cron"],
    programmingLanguage: "JavaScript",
    installLang: "bash",
    installSnippet: `# Run locally with Node.js & Chrome CDP
git clone https://github.com/0xProgress/automatic-dollop.git
cd automatic-dollop && npm ci
echo '[{"username":"you@example.com","password":"yourpass"}]' > login.json
node renew.js`,
    repoUrl: "https://github.com/0xProgress/automatic-dollop",
    docsUrl: "https://github.com/0xProgress/automatic-dollop#cloud-recommended",
    packageUrl: "https://github.com/0xProgress/automatic-dollop/actions",
    packageLabel: "GitHub Actions",
  },
  {
    slug: "is-a-dev",
    name: "is-a.dev",
    summary: "Free subdomains for developers. Thousands rely on it.",
    problem:
      "Students and indie builders shipping portfolios, documentation sites, and open-source demos often hit a paywall just to get a clean, recognizable domain name. As a maintainer on is-a.dev, I help review DNS record pull requests and keep the automated Git-backed subdomain service dependable for thousands of developers worldwide.",
    status: "active",
    tags: ["dns", "open-source", "community"],
    programmingLanguage: "JSON",
    license: "https://opensource.org/licenses/MIT",
    installLang: "json",
    installSnippet: `{
  "owner": {
    "username": "0xProgress",
    "email": "progressuwhuseba@gmail.com"
  },
  "records": {
    "CNAME": "0xprogress.github.io"
  }
}`,
    repoUrl: "https://github.com/is-a-dev/register",
    docsUrl: "https://is-a.dev",
    packageUrl: "https://github.com/is-a-dev/register/pulls",
    packageLabel: "Registry PRs",
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
