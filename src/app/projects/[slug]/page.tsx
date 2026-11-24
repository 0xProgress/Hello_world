import PostContent from "@/components/PostContent";
import SiteHeader from "@/components/SiteHeader";
import { links, person, projects } from "@/content/profile";
import { getAllPostsMeta, highlightSnippet } from "@/lib/posts";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  GitBranch,
  Package,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const ogImageUrl = `/projects/${project.slug}/opengraph-image`;

  return {
    title: project.name,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      type: "website",
      title: `${project.name} — ${person.handle}`,
      description: project.summary,
      images: [
        { url: ogImageUrl, width: 1200, height: 630, alt: project.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ${person.handle}`,
      description: project.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const snippetHtml = await highlightSnippet(
    project.installSnippet,
    project.installLang,
  );

  const projectTags = new Set(project.tags.map((t) => t.toLowerCase()));
  const relatedPosts = getAllPostsMeta().filter((post) =>
    post.tags.some((tag) => projectTags.has(tag.toLowerCase())),
  );

  const siteUrl = links.website.replace(/\/$/, "");
  const projectUrl = `${siteUrl}/projects/${project.slug}`;

  const softwareSourceCodeJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.summary,
    url: projectUrl,
    codeRepository: project.repoUrl,
    programmingLanguage: project.programmingLanguage,
    ...(project.license ? { license: project.license } : {}),
    author: {
      "@type": "Person",
      name: person.name,
      url: links.website,
    },
  };

  const city = person.location.split(",")[0]?.trim() ?? person.location;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSourceCodeJsonLd),
        }}
      />
      <SiteHeader handle={person.handle} />

      <main id="main-content" className="container-main pt-10 pb-20 sm:pt-16">
        <div className="mb-8">
          <Link
            href="/#work"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-xs text-(--text-muted) hover:text-(--accent) transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to selected systems</span>
          </Link>
        </div>

        {/* Project Header */}
        <header className="border-b border-(--border) pb-8 mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px]"
              style={{
                backgroundColor: "var(--status-active-bg)",
                color: "var(--status-active)",
              }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-current"
              />
              {project.status}
            </span>

            {project.role && (
              <span className="rounded-sm border border-(--border) bg-(--surface) px-2.5 py-0.5 font-mono text-[11px] text-(--text-muted)">
                {project.role}
              </span>
            )}
          </div>

          <h1 className="font-mono text-3xl sm:text-4xl font-medium text-(--text) tracking-tight mb-3">
            {project.name}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-(--text-muted) max-w-2xl mb-5">
            {project.summary}
          </p>

          <div
            aria-label="Project tags"
            className="flex flex-wrap items-center gap-1.5"
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-(--border) bg-(--surface) px-2.5 py-1 font-mono text-xs text-(--text-muted)"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Links Bar: Repo, Docs, Package Registry */}
        <section
          aria-label="Project links"
          className="mb-10 flex flex-wrap items-center gap-2.5"
        >
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-(--accent) px-4 py-2 font-mono text-xs font-medium text-(--accent-contrast) transition-opacity hover:opacity-90"
          >
            <GitBranch size={14} aria-hidden="true" />
            <span>Repository</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>

          {project.docsUrl && (
            <a
              href={project.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card inline-flex min-h-11 items-center gap-2 px-4 py-2 font-mono text-xs text-(--text)"
            >
              <BookOpen
                size={14}
                aria-hidden="true"
                className="text-(--accent)"
              />
              <span>Documentation</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}

          {project.packageUrl && (
            <a
              href={project.packageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card inline-flex min-h-11 items-center gap-2 px-4 py-2 font-mono text-xs text-(--text)"
            >
              <Package
                size={14}
                aria-hidden="true"
                className="text-(--accent)"
              />
              <span>{project.packageLabel ?? "Package Registry"}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </section>

        {/* Problem Statement */}
        <section
          aria-labelledby="problem-heading"
          className="surface-panel p-5 sm:p-7 mb-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-2">
            01 {"//"} Problem Statement
          </p>
          <h2
            id="problem-heading"
            className="font-serif text-xl sm:text-2xl text-(--text) mb-3"
          >
            Why {project.name} exists
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-(--text-muted)">
            {project.problem}
          </p>
        </section>

        {/* Install / Usage Snippet */}
        <section aria-labelledby="install-heading" className="mb-12 min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-2">
            02 {"//"} Quickstart
          </p>
          <h2
            id="install-heading"
            className="font-serif text-xl sm:text-2xl text-(--text) mb-4"
          >
            Install &amp; Usage
          </h2>
          <PostContent html={snippetHtml} />
        </section>

        {/* Related Posts */}
        <section
          aria-labelledby="related-posts-heading"
          className="border-t border-(--border) pt-10"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-1">
                03 {"//"} Field Notes
              </p>
              <h2
                id="related-posts-heading"
                className="font-serif text-xl sm:text-2xl text-(--text)"
              >
                Related Writing
              </h2>
            </div>
            <Link
              href="/writing"
              className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs text-(--text-muted) hover:text-(--accent)"
            >
              <span>All posts</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {relatedPosts.length === 0 ? (
            <p className="font-mono text-xs text-(--text-subtle)">
              No posts tagged with {project.tags.map((t) => `#${t}`).join(", ")}{" "}
              yet.
            </p>
          ) : (
            <div className="space-y-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className="surface-card group block p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="font-mono text-sm sm:text-base font-medium text-(--text) group-hover:text-(--accent) transition-colors">
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
          )}
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
