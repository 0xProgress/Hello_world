"use client";

import CommandPalette, { type PalettePost } from "@/components/CommandPalette";
import ThemeToggle from "@/components/ThemeToggle";
import VibeSwitcher from "@/components/VibeSwitcher";
import { projects } from "@/content/profile";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  index: string;
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { index: "01", id: "work", label: "work", href: "/#work" },
  { index: "02", id: "writing", label: "writing", href: "/writing" },
  { index: "03", id: "about", label: "about", href: "/#about" },
  { index: "04", id: "support", label: "support", href: "/#support" },
  { index: "05", id: "contact", label: "contact", href: "/#contact" },
];

export default function SiteHeader({
  handle,
  posts = [],
}: {
  handle: string;
  posts?: PalettePost[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isWritingRoute = pathname?.startsWith("/writing") ?? false;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (!isHome) return;

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
  }, [isHome]);

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

  const isItemActive = (item: NavItem) => {
    if (item.id === "writing" && isWritingRoute) return true;
    if (isHome && activeSection === item.id) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-(--border) bg-(--bg)/85 backdrop-blur-md">
        <div className="container-main flex h-16 items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-sm font-medium text-(--text) truncate"
          >
            <span className="text-(--accent)" aria-hidden="true">
              ~/
            </span>
            <span className="truncate">{handle}</span>
            <span
              aria-hidden="true"
              className="inline-block h-4 w-1.5 shrink-0 bg-(--accent) animate-blink"
            />
          </Link>

          {/* Tablet & Desktop Horizontal Nav */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1"
          >
            <div className="flex items-center rounded-lg border border-(--border) bg-(--surface)/80 p-1">
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 font-mono text-xs transition-colors ${
                      active
                        ? "border border-(--border) bg-(--surface-elevated) text-(--accent) font-medium"
                        : "border border-transparent text-(--text-muted) hover:text-(--text)"
                    }`}
                  >
                    <span className="text-[10px] text-(--text-subtle)">
                      {item.index}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="ml-2 flex items-center gap-1.5">
              <CommandPalette projects={projects} posts={posts} />
              <VibeSwitcher />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Controls (>= 44px touch targets, fits comfortably at 360px) */}
          <div className="flex items-center gap-1 md:hidden shrink-0">
            <CommandPalette projects={projects} posts={posts} />
            <VibeSwitcher />
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
              <Link
                key={item.id}
                href={item.href}
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
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Sticky Section Rail on Wide Desktop Home Viewports */}
      {isHome && (
        <aside
          aria-label="Section index"
          className="pointer-events-none fixed inset-y-0 right-6 z-30 hidden xl:flex items-center"
        >
          <nav className="pointer-events-auto flex flex-col gap-1 rounded-lg border border-(--border) bg-(--surface)/85 p-2 backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={active ? "location" : undefined}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-md px-2.5 font-mono text-xs transition-colors ${
                    active
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
      )}
    </>
  );
}
