'use client';

import {
    DEFAULT_VIBE,
    VIBES,
    isValidVibe,
    type VibeId,
} from '@/content/vibes';
import { Check, Palette } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

function subscribeToVibe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-vibe'],
  });
  return () => observer.disconnect();
}

function getClientVibe(): VibeId {
  const current = document.documentElement.getAttribute('data-vibe');
  return isValidVibe(current) ? current : DEFAULT_VIBE;
}

function getServerVibe(): VibeId {
  return DEFAULT_VIBE;
}

export default function VibeSwitcher() {
  const vibe = useSyncExternalStore(
    subscribeToVibe,
    getClientVibe,
    getServerVibe
  );
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const applyVibe = (nextVibe: VibeId) => {
    document.documentElement.setAttribute('data-vibe', nextVibe);
    try {
      localStorage.setItem('vibe', nextVibe);
    } catch {
      // Ignore storage restrictions
    }
    setOpen(false);
  };

  const activeMeta = VIBES.find((v) => v.id === vibe) ?? VIBES[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change site vibe (current: ${activeMeta.label})`}
        className="inline-flex h-11 items-center gap-2 rounded-md border border-(--border) bg-(--surface) px-2.5 sm:px-3 font-mono text-xs text-(--text-muted) transition-colors hover:border-(--accent) hover:text-(--text)"
      >
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 rounded-full bg-(--accent)"
        />
        <Palette size={14} aria-hidden="true" className="sm:hidden" />
        <span className="hidden sm:inline">{activeMeta.shortLabel}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Site visual vibe"
          className="surface-panel absolute right-0 z-50 mt-2 w-64 p-1.5 shadow-lg"
        >
          <p className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-(--text-subtle)">
            Site Vibe
          </p>
          {VIBES.map((option) => {
            const selected = option.id === vibe;
            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => applyVibe(option.id)}
                className={`flex w-full min-h-11 items-start justify-between gap-2.5 rounded-sm px-2.5 py-2 text-left transition-colors ${
                  selected
                    ? 'bg-(--accent-soft) text-(--text)'
                    : 'text-(--text-muted) hover:bg-(--bg) hover:text-(--text)'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: option.swatchLight }}
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-medium text-(--text)">
                      {option.label}
                    </p>
                    <p className="text-[11px] leading-snug text-(--text-subtle)">
                      {option.description}
                    </p>
                  </div>
                </div>
                {selected && (
                  <Check
                    size={14}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-(--accent)"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
