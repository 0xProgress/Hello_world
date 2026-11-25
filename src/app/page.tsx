import InteractiveTerminal from "@/components/InteractiveTerminal";
import ProjectGrid from "@/components/ProjectGrid";
import SiteHeader from "@/components/SiteHeader";
import SponsorGrid from "@/components/SponsorGrid";
import StatCard from "@/components/StatCard";
import { links, nowItems, person, projects } from "@/content/profile";
import { getAllPostsMeta } from "@/lib/posts";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const GithubMark = () => (
  <svg
    width={15}
    height={15}
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
  const allPosts = getAllPostsMeta();
  const visiblePosts = allPosts.slice(0, 3);

  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2026-01-01T00:00:00Z",
    dateModified: visiblePosts[0]?.date ?? "2026-11-24",
    mainEntity: {
      "@type": "Person",
      name: person.name,
      alternateName: person.handle,
      url: links.website,
      image: `${links.website.replace(/\/$/, "")}/og-image.png`,
      jobTitle: "Software developer",
      description: person.metaDescription,
      knowsAbout: ["Go", "Python", "Backend development", "Open source"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lagos",
        addressCountry: "NG",
      },
      sameAs: [links.github, links.x, links.discord],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <SiteHeader handle={person.handle} posts={allPosts} />

      <main id="main-content" className="container-main">
        {/* 1. Editorial Hero */}
        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="pt-20 pb-24 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44"
        >
          <div className="max-w-4xl">
            <div className="mb-8 sm:mb-10 flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm text-(--text-muted)">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-(--status-active)"
                />
                <span>{person.location}</span>
              </span>
              <span aria-hidden="true" className="text-(--text-subtle)">
                ·
              </span>
              <span className="text-(--text-subtle)">{person.name}</span>
            </div>

            <h1
              id="hero-heading"
              className="font-serif text-[length:var(--text-hero)] text-(--text) hover-wonk mb-8 sm:mb-10 leading-[1.06] tracking-[-0.025em]"
            >
              {person.tagline}
            </h1>

            <p className="max-w-2xl text-lg sm:text-xl leading-[1.7] text-(--text-muted) mb-10 sm:mb-12">
              Open-source CLI tools, resilient developer utilities, and DNS
              infrastructure built in public from {city}.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-md bg-(--accent) px-6 py-3 font-mono text-xs sm:text-sm font-medium text-(--accent-contrast) transition-opacity hover:opacity-90"
              >
                <span>Explore work</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-md border border-(--border) bg-(--surface-elevated) px-6 py-3 font-mono text-xs sm:text-sm text-(--text) transition-colors hover:border-(--accent)"
              >
                <span>GitHub</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* 2. Work */}
        <section
          id="work"
          aria-labelledby="work-heading"
          className="section-block border-t border-(--border)"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-12 sm:mb-16">
            <div>
              <h2
                id="work-heading"
                className="font-serif text-[length:var(--text-2xl)] text-(--text) tracking-[-0.02em]"
              >
                Selected Work
              </h2>
            </div>
            <span className="font-mono text-xs text-(--text-subtle)">
              {projects.length} open-source projects
            </span>
          </div>

          <ProjectGrid projects={projects} />
        </section>

        {/* 3. Writing */}
        {visiblePosts.length > 0 && (
          <section
            id="writing"
            aria-labelledby="writing-heading"
            className="section-block border-t border-(--border)"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-12 sm:mb-16">
              <h2
                id="writing-heading"
                className="font-serif text-[length:var(--text-2xl)] text-(--text) tracking-[-0.02em]"
              >
                Writing
              </h2>
              <Link
                href="/writing"
                className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs sm:text-sm text-(--text-muted) hover:text-(--accent) transition-colors"
              >
                <span>All posts</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="divide-y divide-(--border) border-y border-(--border)">
              {visiblePosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 py-8 sm:py-10 transition-colors"
                >
                  <div className="max-w-2xl">
                    <h3 className="font-serif text-xl sm:text-2xl text-(--text) group-hover:text-(--accent) transition-colors mb-2.5">
                      {post.title}
                    </h3>
                    <p className="text-base leading-relaxed text-(--text-muted)">
                      {post.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-(--text-subtle) shrink-0">
                    <time dateTime={post.date}>{post.date}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. About & Now */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="section-block border-t border-(--border)"
        >
          <div className="max-w-3xl mb-14 sm:mb-16">
            <h2
              id="about-heading"
              className="font-serif text-[length:var(--text-2xl)] text-(--text) tracking-[-0.02em] mb-6"
            >
              Self-taught &amp; shipping in public
            </h2>

            <p className="text-lg sm:text-xl leading-[1.75] text-(--text-muted)">
              {person.shortBio}
            </p>
          </div>

          <div className="mb-14 sm:mb-16">
            <StatCard projectCount={projects.length} />
          </div>

          <div className="mb-8">
            <InteractiveTerminal
              handle={person.handle}
              terminalLines={person.terminalLines}
              projects={projects}
            />
          </div>

          <p className="font-mono text-xs text-(--text-subtle) flex items-center gap-2 mb-20 sm:mb-24">
            <GithubMark />
            <span>{person.educationNote}</span>
          </p>

          {/* Now Sub-section */}
          {nowItems.length > 0 && (
            <div aria-labelledby="now-heading" className="pt-4">
              <div className="flex items-baseline justify-between gap-2 mb-8">
                <h3
                  id="now-heading"
                  className="font-serif text-2xl sm:text-3xl text-(--text) tracking-[-0.015em]"
                >
                  What I&apos;m focused on now
                </h3>
                <span className="font-mono text-xs text-(--text-subtle)">
                  Nov 2026
                </span>
              </div>
              <dl className="divide-y divide-(--border) border-y border-(--border)">
                {nowItems.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-6 sm:py-7"
                  >
                    <dt className="md:col-span-4 font-mono text-sm font-medium text-(--text)">
                      {item.label}
                    </dt>
                    <dd className="md:col-span-8 text-base leading-relaxed text-(--text-muted)">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>

        {/* 5. Support */}
        <section
          id="support"
          aria-labelledby="support-heading"
          className="section-block border-t border-(--border)"
        >
          <div className="max-w-2xl mb-10 sm:mb-12">
            <h2
              id="support-heading"
              className="font-serif text-[length:var(--text-2xl)] italic text-(--text) tracking-[-0.02em] mb-5"
            >
              Support the work.
            </h2>

            <p className="text-lg leading-[1.75] text-(--text-muted) mb-8">
              Everything here is free and open source. If a tool saved you time
              or unblocked a deploy, sponsoring on GitHub helps sustain the work
              and supports future releases.
            </p>

            <a
              href={links.sponsor}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-(--accent) px-6 py-3 font-mono text-sm font-medium text-(--accent-contrast) transition-opacity hover:opacity-90"
            >
              <span aria-hidden="true">♥</span>
              <span>Sponsor on GitHub</span>
            </a>
          </div>

          <div className="mt-14 sm:mt-20">
            <p className="font-mono text-xs uppercase tracking-wider text-(--text-subtle) mb-6">
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
          <h2
            id="contact-heading"
            className="font-serif text-[length:var(--text-2xl)] text-(--text) tracking-[-0.02em] mb-8 sm:mb-10"
          >
            Let&apos;s talk.
          </h2>

          <div className="font-mono text-sm flex flex-wrap gap-3 sm:gap-4">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card inline-flex min-h-12 items-center gap-2 px-5 py-3 text-(--text-muted) hover:text-(--text)"
            >
              <span>github</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a
              href={links.x}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card inline-flex min-h-12 items-center gap-2 px-5 py-3 text-(--text-muted) hover:text-(--text)"
            >
              <span>x</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a
              href={links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card inline-flex min-h-12 items-center gap-2 px-5 py-3 text-(--text-muted) hover:text-(--text)"
            >
              <span>discord</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a
              href={`mailto:${links.email}`}
              className="surface-card inline-flex min-h-12 items-center gap-2 px-5 py-3 text-(--text-muted) hover:text-(--text) break-all"
            >
              <span>{links.email}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-(--border) py-14 sm:py-20">
        <div className="container-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-xs text-(--text-subtle)">
            © 2026 {person.name} · built in {city}
          </p>
          <p className="font-mono text-xs text-(--text-subtle)">
            {person.handle} · open source
          </p>
        </div>
      </footer>
    </>
  );
}
