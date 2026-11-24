"use client";

import type { PostMeta } from "@/lib/posts";
import { ArrowUpRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function WritingList({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      const matchesQuery =
        !normalized ||
        post.title.toLowerCase().includes(normalized) ||
        post.tags.some((t) => t.toLowerCase().includes(normalized));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, selectedTag]);

  return (
    <div>
      {/* Search & Tag Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-(--text-subtle)"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts by title or tag..."
            aria-label="Search posts by title or tag"
            className="min-h-11 w-full rounded-md border border-(--border) bg-(--surface) pr-11 pl-10 font-mono text-xs sm:text-sm text-(--text) placeholder:text-(--text-subtle) focus:border-(--accent) focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search query"
              className="absolute top-1/2 right-1 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm text-(--text-subtle) hover:text-(--text)"
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div
            role="group"
            aria-label="Filter posts by tag"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              aria-pressed={selectedTag === null}
              onClick={() => setSelectedTag(null)}
              className={`min-h-10 rounded-md border px-3 font-mono text-xs transition-colors ${
                selectedTag === null
                  ? "border-(--accent-border) bg-(--accent-soft) text-(--accent) font-medium"
                  : "border-(--border) bg-(--surface) text-(--text-muted) hover:text-(--text)"
              }`}
            >
              all ({posts.length})
            </button>
            {allTags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedTag(active ? null : tag)}
                  className={`min-h-10 rounded-md border px-3 font-mono text-xs transition-colors ${
                    active
                      ? "border-(--accent-border) bg-(--accent-soft) text-(--accent) font-medium"
                      : "border-(--border) bg-(--surface) text-(--text-muted) hover:text-(--text)"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="surface-panel p-8 text-center">
          <p className="font-mono text-sm text-(--text-muted)">
            No posts matched your filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post, idx) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="surface-card group block p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 font-mono text-xs text-(--text-subtle)">
                  <span>0{idx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.date}>{post.date}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime}</span>
                </div>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="text-(--text-subtle) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent)"
                />
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-(--text) group-hover:text-(--accent) transition-colors mb-2">
                {post.title}
              </h2>

              <p className="text-sm leading-relaxed text-(--text-muted) mb-4">
                {post.description}
              </p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-(--bg) px-2 py-0.5 font-mono text-[11px] text-(--text-subtle)"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
