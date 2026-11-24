"use client";

import { sponsors } from "@/content/profile";
import { useState } from "react";

const GithubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-stone-50"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-stone-50"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

type HoverState = {
  index: number;
  rect: DOMRect;
} | null;

export default function SponsorGrid() {
  const [hover, setHover] = useState<HoverState>(null);
  const [modalPos, setModalPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const handleEnter = (
    index: number,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const modalWidth = 320;
    const modalHeight = 240;
    const gap = 12;

    let left = rect.right + gap;
    let top = rect.top;

    if (left + modalWidth > window.innerWidth - 16) {
      left = rect.left - modalWidth - gap;
    }
    if (left < 16) {
      left = 16;
    }
    if (top + modalHeight > window.innerHeight - 16) {
      top = window.innerHeight - modalHeight - 16;
    }
    if (top < 16) {
      top = 16;
    }

    setHover({ index, rect });
    setModalPos({ top, left });
  };

  const handleLeave = () => {
    setHover(null);
  };

  const activeSponsor = hover ? sponsors[hover.index] : null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sponsors.map((sponsor, index) => (
          <a
            key={index}
            href={sponsor.url}
            target={sponsor.isFamily ? "_self" : "_blank"}
            rel={sponsor.isFamily ? undefined : "noopener noreferrer"}
            onMouseEnter={(e) => handleEnter(index, e)}
            onMouseLeave={handleLeave}
            className="bg-stone-900 border border-stone-700 p-6 rounded-sm flex items-center gap-3 min-h-25 hover:border-purple-400 transition-colors group cursor-pointer"
          >
            {sponsor.isGithub && <GithubIcon />}
            {sponsor.isFamily && <HeartIcon />}
            <p className="font-mono text-sm text-stone-50">{sponsor.name}</p>
          </a>
        ))}
      </div>

      {hover && activeSponsor && (
        <div
          className="fixed z-100 w-80 bg-stone-900 border border-stone-700 rounded-sm p-5 pointer-events-none"
          style={{
            top: modalPos.top,
            left: modalPos.left,
          }}
        >
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-stone-700">
            {activeSponsor.isGithub && <GithubIcon />}
            {activeSponsor.isFamily && <HeartIcon />}
            <p className="font-mono text-sm text-stone-50">
              {activeSponsor.name}
            </p>
          </div>
          <p className="font-mono text-xs text-stone-400 leading-relaxed">
            {activeSponsor.message}
          </p>
          {!activeSponsor.isFamily && (
            <div className="mt-3 pt-3 border-t border-stone-700">
              <p className="font-mono text-[10px] text-stone-500 break-all">
                {activeSponsor.url}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
