"use client";

import type { Project } from "@/content/profile";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const bounded = Math.max(0, Math.min(index, projects.length - 1));
    const child = track.children[bounded] as HTMLElement | undefined;
    if (child) {
      track.scrollTo({
        left: child.offsetLeft - track.offsetLeft,
        behavior: "smooth",
      });
    }
    setActiveIndex(bounded);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const scrollLeft = track.scrollLeft;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < track.children.length; i++) {
      const child = track.children[i] as HTMLElement;
      const distance = Math.abs(
        child.offsetLeft - track.offsetLeft - scrollLeft,
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <div>
      {/* Mobile Deck Controls (< 768px) */}
      <div className="mb-4 flex items-center justify-between gap-2 md:hidden">
        <div
          role="tablist"
          aria-label="Project cards"
          className="flex items-center gap-1.5"
        >
          {projects.map((project, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={project.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Show project ${idx + 1}: ${project.name}`}
                onClick={() => scrollToCard(idx)}
                className={`inline-flex h-11 min-w-11 items-center justify-center rounded-md border font-mono text-xs transition-colors ${
                  isSelected
                    ? "border-(--accent-border) bg-(--accent-soft) text-(--accent) font-medium"
                    : "border-(--border) bg-(--surface) text-(--text-subtle)"
                }`}
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollToCard(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous project"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text) transition-colors hover:border-(--accent) disabled:opacity-40"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollToCard(activeIndex + 1)}
            disabled={activeIndex === projects.length - 1}
            aria-label="Next project"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text) transition-colors hover:border-(--accent) disabled:opacity-40"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Horizontal Snap Carousel on Mobile -> Airy 2x2 Grid on Desktop */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0"
      >
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="surface-card group flex min-h-64 w-[86%] shrink-0 snap-start flex-col justify-between p-7 sm:p-9 md:min-h-72 md:w-auto md:shrink lg:p-11"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 font-mono text-xs"
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
                    <span className="font-mono text-xs text-(--text-subtle)">
                      · {project.role}
                    </span>
                  )}
                </div>

                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="text-(--text-subtle) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent)"
                />
              </div>

              <h3 className="font-serif text-2xl sm:text-[1.65rem] text-(--text) group-hover:text-(--accent) transition-colors mb-3.5 leading-snug">
                {project.name}
              </h3>

              <p className="text-base leading-[1.7] text-(--text-muted) mb-8">
                {project.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-(--surface) px-2.5 py-1 font-mono text-xs text-(--text-subtle)"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
