"use client";

import { sponsors } from "@/content/profile";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const GithubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="h-5 w-5 shrink-0 text-(--text)"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="h-5 w-5 shrink-0 text-(--accent)"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function SponsorGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sponsors.map((sponsor, index) => {
        const isExpanded = expandedIndex === index;
        const noteId = `sponsor-note-${index}`;

        return (
          <article
            key={sponsor.name}
            className="surface-card p-6 flex flex-col"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {sponsor.icon === "github" && <GithubIcon />}
                {sponsor.icon === "family" && <HeartIcon />}
                {sponsor.url ? (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm font-medium text-(--text) hover:text-(--accent) transition-colors"
                  >
                    <span>{sponsor.name}</span>
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="text-(--text-subtle)"
                    />
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center font-mono text-sm font-medium text-(--text)">
                    {sponsor.name}
                  </span>
                )}
              </div>

              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={noteId}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="inline-flex min-h-11 shrink-0 items-center rounded-sm px-2.5 font-mono text-xs text-(--text-subtle) hover:bg-(--accent-soft) hover:text-(--accent) transition-colors"
              >
                {isExpanded ? "hide note" : "read note"}
              </button>
            </div>

            <p
              id={noteId}
              className={`mt-3 border-t border-(--border) pt-3 text-sm leading-relaxed text-(--text-muted) ${
                isExpanded ? "block" : "line-clamp-2"
              }`}
            >
              {sponsor.message}
            </p>
          </article>
        );
      })}
    </div>
  );
}
