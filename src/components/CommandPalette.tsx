'use client';

import { VIBES, type VibeId } from '@/content/vibes';
import {
    ArrowUpRight,
    Command,
    FileText,
    FolderGit2,
    Moon,
    Palette,
    Search,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface PaletteProject {
  slug: string;
  name: string;
  summary: string;
  tags: string[];
}

export interface PalettePost {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

interface PaletteAction {
  id: string;
  group: 'Projects' | 'Writing' | 'Navigation' | 'Appearance';
  title: string;
  subtitle: string;
  keywords: string;
  icon: 'project' | 'post' | 'nav' | 'theme' | 'vibe';
  onSelect: () => void;
}

export default function CommandPalette({
  projects,
  posts,
}: {
  projects: PaletteProject[];
  posts: PalettePost[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          if (next) {
            setQuery('');
            setSelectedIndex(0);
          }
          return next;
        });
      } else if (event.key === 'Escape' && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(frame);
    };
  }, [open]);

  const actions: PaletteAction[] = useMemo(() => {
    const navigate = (href: string) => {
      setOpen(false);
      router.push(href);
    };

    const setVibe = (nextVibe: VibeId) => {
      document.documentElement.setAttribute('data-vibe', nextVibe);
      try {
        localStorage.setItem('vibe', nextVibe);
      } catch {
        // Ignore storage restrictions
      }
      setOpen(false);
    };

    const toggleTheme = () => {
      const root = document.documentElement;
      const nextTheme = root.classList.contains('dark') ? 'light' : 'dark';
      root.classList.toggle('dark', nextTheme === 'dark');
      root.style.colorScheme = nextTheme;
      try {
        localStorage.setItem('theme', nextTheme);
      } catch {
        // Ignore storage restrictions
      }
      setOpen(false);
    };

    const projectActions: PaletteAction[] = projects.map((project) => ({
      id: `project-${project.slug}`,
      group: 'Projects',
      title: project.name,
      subtitle: project.summary,
      keywords: `${project.name} ${project.summary} ${project.tags.join(' ')}`,
      icon: 'project',
      onSelect: () => navigate(`/projects/${project.slug}`),
    }));

    const postActions: PaletteAction[] = posts.map((post) => ({
      id: `post-${post.slug}`,
      group: 'Writing',
      title: post.title,
      subtitle: post.description,
      keywords: `${post.title} ${post.description} ${post.tags.join(' ')}`,
      icon: 'post',
      onSelect: () => navigate(`/writing/${post.slug}`),
    }));

    const navActions: PaletteAction[] = [
      {
        id: 'nav-home',
        group: 'Navigation',
        title: 'Home',
        subtitle: 'Hero, selected systems, Now & contact',
        keywords: 'home index top now',
        icon: 'nav',
        onSelect: () => navigate('/'),
      },
      {
        id: 'nav-writing',
        group: 'Navigation',
        title: 'All Writing',
        subtitle: 'Engineering notes, build logs & RSS feed',
        keywords: 'writing blog posts notes rss',
        icon: 'nav',
        onSelect: () => navigate('/writing'),
      },
    ];

    const appearanceActions: PaletteAction[] = [
      {
        id: 'theme-toggle',
        group: 'Appearance',
        title: 'Toggle Light / Dark Theme',
        subtitle: 'Switch between light and dark color schemes',
        keywords: 'theme dark light mode color scheme',
        icon: 'theme',
        onSelect: toggleTheme,
      },
      ...VIBES.map((v) => ({
        id: `vibe-${v.id}`,
        group: 'Appearance' as const,
        title: `Vibe: ${v.label}`,
        subtitle: v.description,
        keywords: `vibe style ${v.id} ${v.label} ${v.description}`,
        icon: 'vibe' as const,
        onSelect: () => setVibe(v.id),
      })),
    ];

    return [
      ...projectActions,
      ...postActions,
      ...navActions,
      ...appearanceActions,
    ];
  }, [projects, posts, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [actions, query]);

  const boundedIndex =
    filtered.length === 0 ? 0 : Math.min(selectedIndex, filtered.length - 1);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((prev) =>
        filtered.length === 0 ? 0 : (prev + 1) % filtered.length
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((prev) =>
        filtered.length === 0
          ? 0
          : (prev - 1 + filtered.length) % filtered.length
      );
    } else if (event.key === 'Enter' && filtered[boundedIndex]) {
      event.preventDefault();
      filtered[boundedIndex].onSelect();
    }
  };

  const renderIcon = (icon: PaletteAction['icon']) => {
    switch (icon) {
      case 'project':
        return (
          <FolderGit2
            size={15}
            aria-hidden="true"
            className="shrink-0 text-(--accent)"
          />
        );
      case 'post':
        return (
          <FileText
            size={15}
            aria-hidden="true"
            className="shrink-0 text-(--accent)"
          />
        );
      case 'theme':
        return (
          <Moon
            size={15}
            aria-hidden="true"
            className="shrink-0 text-(--accent)"
          />
        );
      case 'vibe':
        return (
          <Palette
            size={15}
            aria-hidden="true"
            className="shrink-0 text-(--accent)"
          />
        );
      default:
        return (
          <ArrowUpRight
            size={15}
            aria-hidden="true"
            className="shrink-0 text-(--text-subtle)"
          />
        );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setQuery('');
          setSelectedIndex(0);
          setOpen(true);
        }}
        aria-label="Open command palette"
        className="inline-flex h-11 items-center gap-2 rounded-md border border-(--border) bg-(--surface) px-2.5 font-mono text-xs text-(--text-muted) transition-colors hover:border-(--accent) hover:text-(--text)"
      >
        <Search size={14} aria-hidden="true" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 text-[10px] text-(--text-subtle)">
          <Command size={10} aria-hidden="true" />K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-16 sm:pt-24 backdrop-blur-xs"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="surface-panel w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2.5 border-b border-(--border) px-4 py-3">
              <Search
                size={16}
                aria-hidden="true"
                className="shrink-0 text-(--accent)"
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search projects, posts, or switch vibe..."
                aria-label="Search commands, projects, and posts"
                className="w-full bg-transparent font-mono text-sm text-(--text) placeholder:text-(--text-subtle) focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close command palette"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text-muted) hover:text-(--text)"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center font-mono text-xs text-(--text-subtle)">
                  No matches for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <ul role="listbox" aria-label="Results" className="space-y-1">
                  {filtered.map((item, idx) => {
                    const active = idx === boundedIndex;
                    return (
                      <li
                        key={item.id}
                        role="option"
                        aria-selected={active}
                      >
                        <button
                          type="button"
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={item.onSelect}
                          className={`flex w-full min-h-11 items-center justify-between gap-3 rounded-sm px-3 py-2 text-left transition-colors ${
                            active
                              ? 'bg-(--accent-soft) text-(--text)'
                              : 'text-(--text-muted) hover:bg-(--bg)'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {renderIcon(item.icon)}
                            <div className="min-w-0">
                              <p className="font-mono text-xs font-medium text-(--text) truncate">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-(--text-subtle) truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 font-mono text-[10px] text-(--text-subtle)">
                            {item.group}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-(--border) bg-(--bg)/70 px-4 py-2 font-mono text-[11px] text-(--text-subtle)">
              <span>↑↓ navigate · ↵ select</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
