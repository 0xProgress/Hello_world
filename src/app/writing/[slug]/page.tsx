import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  List,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import PostContent from '@/components/PostContent';
import { links, person, projects } from '@/content/profile';
import { getAllPosts, getAllPostsMeta, getPostBySlug } from '@/lib/posts';

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllPostsMeta({ includeUnlisted: true });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const ogImageUrl = post.image ?? `/writing/${post.slug}/opengraph-image`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/writing/${post.slug}`,
    },
    ...(post.unlisted
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publicPosts = await getAllPosts();
  const publicIndex = post.unlisted
    ? -1
    : publicPosts.findIndex((p) => p.slug === slug);

  const newerPost = publicIndex > 0 ? publicPosts[publicIndex - 1] : null;
  const olderPost =
    publicIndex !== -1 && publicIndex < publicPosts.length - 1
      ? publicPosts[publicIndex + 1]
      : null;

  const postTags = new Set(post.tags.map((t) => t.toLowerCase()));
  const relatedProjects = projects.filter((project) =>
    project.tags.some((tag) => postTags.has(tag.toLowerCase()))
  );

  const siteUrl = links.website.replace(/\/$/, '');
  const postUrl = `${siteUrl}/writing/${post.slug}`;
  const resolvedImage = post.image
    ? `${siteUrl}${post.image}`
    : `${postUrl}/opengraph-image`;

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    image: resolvedImage,
    keywords: post.tags.join(', '),
    author: {
      '@type': 'Person',
      name: person.name,
      url: links.website,
    },
    publisher: {
      '@type': 'Person',
      name: person.name,
      url: links.website,
    },
  };

  const city = person.location.split(',')[0]?.trim() ?? person.location;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <SiteHeader handle={person.handle} posts={publicPosts} />

      <main id="main-content" className="container-main pt-10 pb-20 sm:pt-16">
        <div className="mb-8">
          <Link
            href="/writing"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-xs text-(--text-muted) hover:text-(--accent) transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to all writing</span>
          </Link>
        </div>

        {/* Post Header */}
        <header className="border-b border-(--border) pb-8 mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-(--text-subtle) mb-3">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            {post.unlisted && (
              <>
                <span aria-hidden="true">·</span>
                <span className="rounded-sm border border-(--border) bg-(--surface) px-2 py-0.5 text-[11px] text-(--accent)">
                  unlisted
                </span>
              </>
            )}
          </div>

          <h1 className="font-serif text-[length:var(--text-hero)] text-(--text) leading-[1.12] tracking-tight mb-4">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-(--text-muted) max-w-2xl mb-5">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-(--border) bg-(--surface) px-2.5 py-1 font-mono text-xs text-(--text-muted)"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.image && (
            <figure className="mt-6 overflow-hidden rounded-lg border border-(--border)">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full h-auto object-cover"
              />
            </figure>
          )}
        </header>

        {/* Mobile Collapsible Table of Contents (< 1024px) */}
        {post.headings.length > 0 && (
          <details className="surface-panel mb-8 p-4 lg:hidden group">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between font-mono text-xs font-medium text-(--text)">
              <span className="inline-flex items-center gap-2">
                <List size={14} aria-hidden="true" className="text-(--accent)" />
                <span>Table of contents</span>
              </span>
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="text-(--text-subtle) transition-transform group-open:rotate-180"
              />
            </summary>
            <nav
              aria-label="Table of contents"
              className="mt-3 border-t border-(--border) pt-3"
            >
              <ul className="space-y-1 font-mono text-xs">
                {post.headings.map((heading) => (
                  <li
                    key={heading.id}
                    className={heading.level === 3 ? 'pl-4' : ''}
                  >
                    <a
                      href={`#${heading.id}`}
                      className="inline-flex min-h-9 items-center text-(--text-muted) hover:text-(--accent)"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        )}

        {/* Article + Desktop Sticky Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <article
            className={
              post.headings.length > 0
                ? 'lg:col-span-8 min-w-0'
                : 'lg:col-span-12 min-w-0'
            }
          >
            <PostContent html={post.html} />
          </article>

          {post.headings.length > 0 && (
            <aside
              aria-label="Table of contents"
              className="hidden lg:block lg:col-span-4 sticky top-24"
            >
              <div className="surface-panel p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-(--text-subtle) mb-3">
                  On this page
                </p>
                <nav>
                  <ul className="space-y-1.5 font-mono text-xs">
                    {post.headings.map((heading) => (
                      <li
                        key={heading.id}
                        className={heading.level === 3 ? 'pl-3.5' : ''}
                      >
                        <a
                          href={`#${heading.id}`}
                          className="block py-1 text-(--text-muted) hover:text-(--accent) transition-colors"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
        </div>

        {/* Related Projects (overlapping tags) */}
        {relatedProjects.length > 0 && (
          <section
            aria-labelledby="post-related-projects-heading"
            className="mt-12 border-t border-(--border) pt-8"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-1">
              Related Tools
            </p>
            <h2
              id="post-related-projects-heading"
              className="font-serif text-xl text-(--text) mb-4"
            >
              Projects Mentioned or Tagged
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="surface-card group flex items-start justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-medium text-(--text) group-hover:text-(--accent) transition-colors mb-1">
                      {project.name}
                    </p>
                    <p className="text-xs leading-relaxed text-(--text-muted)">
                      {project.summary}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-(--text-subtle) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent)"
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Previous / Next Post Navigation */}
        {(olderPost || newerPost) && (
          <nav
            aria-label="Post pagination"
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-(--border) pt-8"
          >
            {olderPost ? (
              <Link
                href={`/writing/${olderPost.slug}`}
                className="surface-card flex flex-col justify-between p-5"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-(--text-subtle) mb-2">
                  <ArrowLeft size={13} aria-hidden="true" />
                  <span>Previous post</span>
                </span>
                <span className="font-serif text-lg text-(--text)">
                  {olderPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {newerPost && (
              <Link
                href={`/writing/${newerPost.slug}`}
                className="surface-card flex flex-col justify-between p-5 sm:text-right sm:items-end"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-(--text-subtle) mb-2">
                  <span>Next post</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </span>
                <span className="font-serif text-lg text-(--text)">
                  {newerPost.title}
                </span>
              </Link>
            )}
          </nav>
        )}
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
