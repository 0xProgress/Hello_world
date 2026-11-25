"use client";

import { useEffect, useState } from "react";

export default function StatCard({ projectCount }: { projectCount: number }) {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/commit-count.json");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTotal(data.total);
      } catch (e) {
        console.error("Error fetching commit count:", e);
        setError(true);
      }
    }
    fetchData();
  }, []);

  const display = error || total === null ? "—" : total.toLocaleString();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 border-y border-(--border) py-8 sm:py-10">
      <div>
        <p className="font-serif text-3xl sm:text-4xl text-(--text) tabular-nums mb-1.5">
          {display}
        </p>
        <p className="font-mono text-xs text-(--text-subtle)">
          GitHub contributions
        </p>
      </div>

      <div>
        <p className="font-serif text-3xl sm:text-4xl text-(--text) tabular-nums mb-1.5">
          {projectCount}
        </p>
        <p className="font-mono text-xs text-(--text-subtle)">
          Public open-source tools
        </p>
      </div>

      <div>
        <p className="font-serif text-3xl sm:text-4xl text-(--text) tabular-nums mb-1.5">
          4+ yrs
        </p>
        <p className="font-mono text-xs text-(--text-subtle)">
          Studying &amp; shipping in public
        </p>
      </div>
    </div>
  );
}
