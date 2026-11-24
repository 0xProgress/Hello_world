'use client';

import type { Project } from '@/content/profile';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

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
        behavior: 'smooth',
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
        child.offsetLeft - track.offsetLeft - scrollLeft
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
      <div className="mb-3 flex items-center justify-between gap-2 md:hidden">
        <div
          role="tablist"
          aria-label="Project cards"
          className="flex items-center gap-1"
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
                    ? 'border-(--accent-border) bg-(--accent-soft) text-(--accent) font-medium'
                    : 'border-(--border) bg-(--surface) text-(--text-subtle)'
                }`}
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
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

      {/* Horizontal Snap Carousel on Mobile (< 768px) -> 2x2 Grid on Tablet/Desktop (>= 768px) */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:pb-0"
      >
        {projects.map((project, idx) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="surface-card group flex min-h-48 w-[85%] shrink-0 snap-start flex-col justify-between p-5 sm:p-6 md:min-h-54 md:w-auto md:shrink md:p-7"
          >
            <div>
              {/* Top telemetry row */}
              <div className="flex items-center justify-between gap-2 mb-4 md:mb-5">
                <span className="font-mono text-xs text-(--text-subtle)">
                  0{idx + 1} {'//'} {project.slug}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px]"
                    style={{
                      backgroundColor: 'var(--status-active-bg)',
                      color: 'var(--status-active)',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-current"
                    />
                    {project.status}
                  </span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="text-(--text-subtle) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent)"
                  />
                </div>
              </div>

              {/* Title & Role */}
              <h3 className="font-mono text-base sm:text-lg font-medium text-(--text) group-hover:text-(--accent) transition-colors mb-2">
                {project.name}
                {project.role && (
                  <span className="ml-2 rounded-sm border border-(--border) bg-(--bg) px-2 py-0.5 text-[11px] font-normal text-(--text-subtle)">
                    {project.role}
                  </span>
                )}
              </h3>

              {/* Summary */}
              <p className="text-sm leading-relaxed text-(--text-muted) mb-5 md:mb-6">
                {project.summary}
              </p>
            </div>

            {/* Tags footer */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-(--border) pt-3.5 md:pt-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-(--bg) px-2 py-0.5 font-mono text-[11px] text-(--text-subtle)"
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
