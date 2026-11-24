"use client";

import { useEffect, useRef } from "react";

export default function PostContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Wrap tables in a horizontal scroll container so wide GFM tables never overflow at 360px
    const tables = root.querySelectorAll<HTMLTableElement>("table");
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains("table-scroll")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll";
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Attach language header + accessible Copy button to every Shiki code block
    const blocks = root.querySelectorAll<HTMLDivElement>(".code-block-wrapper");
    blocks.forEach((block) => {
      if (block.querySelector(".code-block-header")) return;
      const pre = block.querySelector("pre");
      if (!pre) return;

      const lang = block.dataset.lang || "text";
      const header = document.createElement("div");
      header.className = "code-block-header";

      const langLabel = document.createElement("span");
      langLabel.textContent = lang;

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.textContent = "copy";
      copyBtn.setAttribute("aria-label", `Copy ${lang} code snippet`);
      copyBtn.className =
        "inline-flex min-h-9 min-w-14 items-center justify-center rounded-sm border border-(--border) bg-(--bg) px-2.5 text-[11px] text-(--text-muted) transition-colors hover:border-(--accent) hover:text-(--text)";

      let resetTimer: number | undefined;
      copyBtn.addEventListener("click", async () => {
        const text = pre.textContent ?? "";
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = "copied";
          copyBtn.style.color = "var(--accent)";
        } catch {
          copyBtn.textContent = "failed";
        }
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          copyBtn.textContent = "copy";
          copyBtn.style.color = "";
        }, 1800);
      });

      header.appendChild(langLabel);
      header.appendChild(copyBtn);
      block.insertBefore(header, pre);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose-post"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
