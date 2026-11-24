import SiteHeader from "@/components/SiteHeader";
import WritingList from "@/components/WritingList";
import { person } from "@/content/profile";
import { getAllPostsMeta } from "@/lib/posts";
import { Rss } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Engineering notes, systems build logs, and lessons from building small open-source tools in Go and Python.",
  alternates: {
    canonical: "/writing",
  },
};

export default function WritingPage() {
  const posts = getAllPostsMeta();
  const city = person.location.split(",")[0]?.trim() ?? person.location;

  return (
    <>
      <SiteHeader handle={person.handle} />

      <main id="main-content" className="container-main pt-12 pb-20 sm:pt-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-(--border) pb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-(--accent) mb-2">
              Logs &amp; Engineering Notes
            </p>
            <h1 className="font-serif text-(length:--text-hero) text-(--text) leading-tight">
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

        <WritingList posts={posts} />
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
