import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import WritingList from '@/components/WritingList';
import { person, projects } from '@/content/profile';
import { getAllPostsMeta } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Engineering notes, systems build logs, and lessons from building small open-source tools in Go and Python.',
  alternates: {
    canonical: '/writing',
  },
};

export default function WritingPage() {
  const posts = getAllPostsMeta();
  const city = person.location.split(',')[0]?.trim() ?? person.location;

  return (
    <>
      <SiteHeader handle={person.handle} />

      <main id="main-content" className="container-main pt-12 pb-20 sm:pt-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-(--border) pb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-2">
              Logs &amp; Engineering Notes
            </p>
            <h1 className="font-serif text-[length:var(--text-hero)] text-(--text) leading-tight">
              Writing
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/feed.xml"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-(--border) bg-(--surface) px-3.5 font-mono text-xs text-(--text-muted) transition-colors hover:border-(--accent) hover:text-(--text)"
            >
              <Rss size={14} aria-hidden="true" className="text-(--accent)" />
              <span>RSS feed</span>
            </a>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-md border border-(--border) bg-(--surface) px-3.5 font-mono text-xs text-(--text-muted) transition-colors hover:border-(--accent) hover:text-(--text)"
            >
              ← home
            </Link>
          </div>
        </div>

        {/* Project Specs Quick-Index */}
        <section
          aria-labelledby="writing-projects-heading"
          className="mb-10 border-b border-(--border) pb-8"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2
              id="writing-projects-heading"
              className="font-mono text-[11px] uppercase tracking-wider text-(--text-subtle)"
            >
              Project Specs &amp; Docs
            </h2>
            <span className="font-mono text-[11px] text-(--text-subtle)">
              0{projects.length} tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {projects.map((project, idx) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="surface-card group flex min-h-12 items-center justify-between gap-2 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="font-mono text-xs font-medium text-(--text) group-hover:text-(--accent) transition-colors truncate">
                    <span className="text-(--text-subtle) mr-1.5">
                      0{idx + 1}
                    </span>
                    {project.name}
                  </p>
                  <p className="font-mono text-[11px] text-(--text-subtle) truncate">
                    {project.tags.slice(0, 2).join(' · ')}
                  </p>
                </div>
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 text-(--text-subtle) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent)"
                />
              </Link>
            ))}
          </div>
        </section>

        <WritingList posts={posts} />
      </main>

      <footer className="border-t border-(--border) py-8 sm:py-10">
        <div className="container-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-xs text-(--text-subtle)">
            © 2026 {person.name} · built in {city}
          </p>
          <p className="font-mono text-xs text-(--text-subtle)">
            {person.handle} {'//'} open source
          </p>
        </div>
      </footer>
    </>
  );
}
