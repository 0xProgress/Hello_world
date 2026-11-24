'use client';

import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';

    root.classList.toggle('dark', nextTheme === 'dark');
    root.style.colorScheme = nextTheme;

    try {
      localStorage.setItem('theme', nextTheme);
    } catch {
      // Ignore storage restrictions
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text-muted) transition-colors hover:border-(--accent) hover:text-(--text)"
    >
      <Sun size={17} aria-hidden="true" className="hidden dark:block" />
      <Moon size={17} aria-hidden="true" className="block dark:hidden" />
    </button>
  );
}
