"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NavItem {
  index: string;
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { index: "01", id: "work", label: "work" },
  { index: "02", id: "about", label: "about" },
  { index: "03", id: "support", label: "support" },
  { index: "04", id: "contact", label: "contact" },
];

export default function SiteHeader({ handle }: { handle: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-(--border) bg-(--bg)/85 backdrop-blur-md">
        <div className="container-main flex h-16 items-center justify-between gap-4">
          <a
            href="#hero"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-sm font-medium text-(--text)"
          >
            <span className="text-(--accent)" aria-hidden="true">
              ~/
            </span>
            <span>{handle}</span>
            <span
              aria-hidden="true"
              className="inline-block h-4 w-1.5 bg-(--accent) animate-blink"
            />
          </a>

          {/* Tablet & Desktop Horizontal Nav */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1"
          >
            <div className="flex items-center rounded-lg border border-(--border) bg-(--surface)/80 p-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 font-mono text-xs transition-colors ${
                      isActive
                        ? "border border-(--border) bg-(--surface-elevated) text-(--accent) font-medium"
                        : "border border-transparent text-(--text-muted) hover:text-(--text)"
                    }`}
                  >
                    <span className="text-[10px] text-(--text-subtle)">
                      {item.index}
                    </span>
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Controls (>= 44px touch targets) */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
              aria-label="Open navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text) transition-colors hover:border-(--accent)"
            >
              <Menu size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Panel */}
      {menuOpen && (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-50 flex flex-col bg-(--bg) md:hidden"
        >
          <div className="container-main flex h-16 items-center justify-between border-b border-(--border)">
            <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-(--text)">
              <span className="text-(--accent)" aria-hidden="true">
                ~/
              </span>
              <span>{handle}</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text) transition-colors hover:border-(--accent)"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Mobile navigation"
            className="container-main flex flex-1 flex-col justify-center gap-3 py-8"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="surface-card flex min-h-14 items-center justify-between px-5 font-mono text-base text-(--text)"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xs text-(--accent)">{item.index}</span>
                  <span>{item.label}</span>
                </span>
                <span aria-hidden="true" className="text-(--text-subtle)">
                  →
                </span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Sticky Section Rail on Wide Desktop Viewports */}
      <aside
        aria-label="Section index"
        className="pointer-events-none fixed inset-y-0 right-6 z-30 hidden xl:flex items-center"
      >
        <nav className="pointer-events-auto flex flex-col gap-1 rounded-lg border border-(--border) bg-(--surface)/85 p-2 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`inline-flex min-h-9 items-center gap-2 rounded-md px-2.5 font-mono text-xs transition-colors ${
                  isActive
                    ? "bg-(--accent-soft) text-(--accent) font-medium"
                    : "text-(--text-subtle) hover:text-(--text)"
                }`}
              >
                <span className="text-[10px] opacity-70">{item.index}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
