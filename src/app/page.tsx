import HeroTelemetry from "@/components/HeroTelemetry";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import ProjectGrid from "@/components/ProjectGrid";
import SiteHeader from "@/components/SiteHeader";
import SponsorGrid from "@/components/SponsorGrid";
import StatCard from "@/components/StatCard";
import { links, person, projects } from "@/content/profile";
import { getAllPostsMeta } from "@/lib/posts";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const GithubMark = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="shrink-0 text-(--text-subtle)"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Page() {
  const city = person.location.split(",")[0]?.trim() ?? person.location;
  const visiblePosts = getAllPostsMeta().slice(0, 3);
  const stackPills = person.skillsSummary.split("·").map((item) => item.trim());

  return (
    <>
      <SiteHeader handle={person.handle} />

      <main id="main-content" className="container-main">
        {/* 1. Hero */}
        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="pt-10 pb-12 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Editorial Pitch Column */}
            <div className="lg:col-span-7">
              <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-1 font-mono text-xs text-(--text-muted)">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-(--status-active)"
                  />
                  <span>{person.location}</span>
                </span>
                <span className="font-mono text-xs text-(--text-subtle)">
                  {person.name}
                </span>
              </div>

              <h1
                id="hero-heading"
                className="font-serif text-(length:--text-hero) text-(--text) hover-wonk mb-4 sm:mb-5 leading-[1.08] tracking-tight"
              >
                &ldquo;{person.tagline}&rdquo;
              </h1>

              <p className="max-w-xl text-sm sm:text-lg leading-relaxed text-(--text-muted) mb-5 sm:mb-7">
                Open-source CLI tools, resilient developer utilities, and DNS
                infrastructure built in public from {city}.
              </p>

              <div
                aria-label="Core technologies"
                className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8"
              >
                {stackPills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-md border border-(--border) bg-(--surface) px-2.5 py-1 font-mono text-xs text-(--text-muted)"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <a
                  href="#work"
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-(--accent) px-4 py-2 font-mono text-xs font-medium text-(--accent-contrast) transition-opacity hover:opacity-90"
                >
                  <span>Explore work</span>
                  <span aria-hidden="true">↓</span>
                </a>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-(--border) bg-(--surface) px-4 py-2 font-mono text-xs text-(--text) transition-colors hover:border-(--accent)"
                >
                  <span>GitHub</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Precision Telemetry Spec Card (collapsible on mobile, expanded on desktop) */}
            <div className="lg:col-span-5">
              <HeroTelemetry
                handle={person.handle}
                location={person.location}
                projectCount={projects.length}
              />
            </div>
          </div>
        </section>

        {/* 2. Work */}
        <section
          id="work"
          aria-labelledby="work-heading"
          className="section-block border-t border-(--border)"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6 sm:mb-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-1">
                01 {"//"} Selected Systems
              </p>
              <h2
                id="work-heading"
                className="font-serif text-(length:--text-2xl) text-(--text)"
              >
                Work &amp; Open Source
              </h2>
            </div>
            <span className="font-mono text-xs text-(--text-subtle)">
              0{projects.length} repositories
            </span>
          </div>

          <ProjectGrid projects={projects} />
        </section>

        {/* 3. Writing (Renders nothing until posts exist) */}
        {visiblePosts.length > 0 && (
          <section
            id="writing"
            aria-labelledby="writing-heading"
            className="section-block border-t border-(--border)"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-1">
                  02 {"//"} Notes &amp; Logs
                </p>
                <h2
                  id="writing-heading"
                  className="font-serif text-(length:--text-2xl) text-(--text)"
                >
                  Latest Writing
                </h2>
              </div>
              <Link
                href="/writing"
                className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs text-(--text-muted) hover:text-(--accent) transition-colors"
              >
                <span>All posts</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {visiblePosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className="surface-card group block p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-mono text-base font-medium text-(--text) group-hover:text-(--accent) transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 font-mono text-xs text-(--text-subtle)">
                      <time dateTime={post.date}>{post.date}</time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                  <p className="text-sm text-(--text-muted)">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. About */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="section-block border-t border-(--border)"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-1">
            03 {"//"} Background
          </p>
          <h2
            id="about-heading"
            className="font-serif text-(length:--text-2xl) text-(--text) mb-4 sm:mb-6"
          >
            Self-taught &amp; shipping in public
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-(--text-muted) max-w-2xl mb-6 sm:mb-8">
            {person.shortBio}
          </p>

          <div className="mb-6 sm:mb-8">
            <StatCard projectCount={projects.length} />
          </div>

          <InteractiveTerminal
            handle={person.handle}
            terminalLines={person.terminalLines}
            projects={projects}
          />

          <p className="font-mono text-xs text-(--text-subtle) flex items-center gap-2">
            <GithubMark />
            <span>{person.educationNote}</span>
          </p>
        </section>

        {/* 5. Support */}
        <section
          id="support"
          aria-labelledby="support-heading"
          className="section-block border-t border-(--border)"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-1">
            04 {"//"} Sponsorship
          </p>
          <h2
            id="support-heading"
            className="font-serif text-(length:--text-2xl) italic text-(--text) mb-3 sm:mb-4"
          >
            &ldquo;Support the work.&rdquo;
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-(--text-muted) max-w-2xl mb-6 sm:mb-8">
            Everything here is free and open source. If a tool saved you time or
            unblocked a deploy, sponsoring on GitHub helps sustain the work and
            supports future releases.
          </p>

          <a
            href={links.sponsor}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-(--accent) px-5 py-2.5 font-mono text-sm font-medium text-(--accent-contrast) transition-opacity hover:opacity-90"
          >
            <span aria-hidden="true">♥</span>
            <span>Sponsor on GitHub</span>
          </a>

          <div className="mt-8 sm:mt-12">
            <p className="font-mono text-xs uppercase tracking-wider text-(--text-subtle) mb-3 sm:mb-4">
              Backed by
            </p>
            <SponsorGrid />
          </div>
        </section>

        {/* 6. Contact */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="section-block border-t border-(--border)"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-1">
            05 {"//"} Connect
          </p>
          <h2
            id="contact-heading"
            className="font-serif text-(length:--text-2xl) text-(--text) mb-5 sm:mb-6"
          >
            &ldquo;Let&apos;s talk.&rdquo;
          </h2>

          <div className="font-mono text-sm flex flex-wrap gap-2">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card inline-flex min-h-11 items-center gap-2 px-4 text-(--text-muted) hover:text-(--text)"
            >
              <span>github</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              href={links.x}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card inline-flex min-h-11 items-center gap-2 px-4 text-(--text-muted) hover:text-(--text)"
            >
              <span>x</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              href={links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card inline-flex min-h-11 items-center gap-2 px-4 text-(--text-muted) hover:text-(--text)"
            >
              <span>discord</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              href={`mailto:${links.email}`}
              className="surface-card inline-flex min-h-11 items-center gap-2 px-4 text-(--text-muted) hover:text-(--text) break-all"
            >
              <span>{links.email}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-(--border) py-8 sm:py-10">
        <div className="container-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-xs text-(--text-subtle)">
            © 2026 {person.name} · built in {city}
          </p>
          <p className="font-mono text-xs text-(--text-subtle)">
            {person.handle} {"//"} open source
          </p>
        </div>
      </footer>
    </>
  );
}
