import PostContent from "@/components/PostContent";
import SiteHeader from "@/components/SiteHeader";
import { person } from "@/content/profile";
import { getAllPosts, getAllPostsMeta, getPostBySlug } from "@/lib/posts";
import { ArrowLeft, ArrowRight, ChevronDown, List } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllPostsMeta();
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

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/writing/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      images: post.image ? [{ url: post.image }] : [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : ["/og-image.png"],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const post = allPosts[currentIndex];
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const city = person.location.split(",")[0]?.trim() ?? person.location;

  return (
    <>
      <SiteHeader handle={person.handle} />

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
          </div>

          <h1 className="font-serif text-(length:--text-hero) text-(--text) leading-[1.12] tracking-tight mb-4">
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
                <List
                  size={14}
                  aria-hidden="true"
                  className="text-(--accent)"
                />
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
                    className={heading.level === 3 ? "pl-4" : ""}
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
                ? "lg:col-span-8 min-w-0"
                : "lg:col-span-12 min-w-0"
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
                        className={heading.level === 3 ? "pl-3.5" : ""}
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

        {/* Previous / Next Post Navigation */}
        {(olderPost || newerPost) && (
          <nav
            aria-label="Post pagination"
            className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-(--border) pt-8"
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
            {person.handle} {"//"} open source
          </p>
        </div>
      </footer>
    </>
  );
}
