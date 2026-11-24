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
    <div className="surface-panel grid grid-cols-2 sm:grid-cols-3 divide-(--border)">
      <div className="border-r border-b sm:border-b-0 border-(--border) p-4 sm:p-6">
        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-(--text-subtle) mb-1.5">
          Contributions
        </p>
        <p className="font-mono text-xl sm:text-3xl font-medium tabular-nums text-(--text)">
          {display}{" "}
          <span className="block sm:inline text-xs sm:text-sm font-normal text-(--text-muted)">
            commits
          </span>
        </p>
      </div>

      <div className="border-b sm:border-b-0 sm:border-r border-(--border) p-4 sm:p-6">
        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-(--text-subtle) mb-1.5">
          Shipped OSS
        </p>
        <p className="font-mono text-xl sm:text-3xl font-medium tabular-nums text-(--text)">
          {projectCount}{" "}
          <span className="block sm:inline text-xs sm:text-sm font-normal text-(--text-muted)">
            public repos
          </span>
        </p>
      </div>

      <div className="col-span-2 sm:col-span-1 p-4 sm:p-6">
        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-(--text-subtle) mb-1.5">
          Track Record
        </p>
        <p className="font-mono text-xl sm:text-3xl font-medium tabular-nums text-(--text)">
          4+{" "}
          <span className="text-xs sm:text-sm font-normal text-(--text-muted)">
            yrs studying &amp; shipping
          </span>
        </p>
      </div>
    </div>
  );
}
