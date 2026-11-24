"use client";

import type { Project } from "@/content/profile";
import { Terminal } from "lucide-react";
import { useState } from "react";

type CommandKey = "whoami" | "stack" | "projects";

export default function InteractiveTerminal({
  handle,
  terminalLines,
  projects,
}: {
  handle: string;
  terminalLines: string[];
  projects: Project[];
}) {
  const [command, setCommand] = useState<CommandKey>("whoami");

  const commands: { id: CommandKey; label: string }[] = [
    { id: "whoami", label: "whoami" },
    { id: "stack", label: "stack --info" },
    { id: "projects", label: "ls -la ./work" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-(--border-strong) bg-(--surface-terminal) mb-6">
      {/* Terminal Window Titlebar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--border) bg-(--surface) px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-(--border-strong)" />
          <span className="h-2.5 w-2.5 rounded-full bg-(--border-strong)" />
          <span className="h-2.5 w-2.5 rounded-full bg-(--border-strong)" />
        </div>

        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-(--text-subtle)">
          <Terminal size={12} aria-hidden="true" />
          <span>zsh — {handle.toLowerCase()}@lagos</span>
        </span>

        {/* Interactive command selector pills */}
        <div
          role="group"
          aria-label="Terminal commands"
          className="flex items-center gap-1"
        >
          {commands.map((cmd) => {
            const active = command === cmd.id;
            return (
              <button
                key={cmd.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCommand(cmd.id)}
                className={`min-h-9 rounded-sm px-2.5 font-mono text-[11px] transition-colors ${
                  active
                    ? "bg-(--accent-soft) text-(--accent) font-medium border border-(--accent-border)"
                    : "text-(--text-subtle) hover:text-(--text) border border-transparent"
                }`}
              >
                {cmd.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-5 sm:p-6 font-mono text-sm">
        <p className="text-(--text)">
          <span className="text-(--accent)" aria-hidden="true">
            $
          </span>{" "}
          {commands.find((c) => c.id === command)?.label}
        </p>

        {command === "whoami" && (
          <div className="mt-3 space-y-1.5 text-(--text-muted)">
            {terminalLines.map((line, idx) => (
              <p key={line}>
                {idx === 0 ? `> ${line}` : `\u00A0\u00A0${line}`}
              </p>
            ))}
          </div>
        )}

        {command === "stack" && (
          <div className="mt-3 space-y-1.5 text-(--text-muted)">
            <p>&gt; languages: Go, Python, TypeScript, Bash</p>
            <p>&nbsp;&nbsp;focus: CLI tooling, backend services, DNS infra</p>
            <p>&nbsp;&nbsp;environment: Linux · Git · CI/CD automation</p>
          </div>
        )}

        {command === "projects" && (
          <div className="mt-3 space-y-2 text-xs sm:text-sm text-(--text-muted)">
            {projects.map((proj) => {
              const displayTarget = proj.repoUrl.replace(/^https?:\/\//, "");
              return (
                <div
                  key={proj.slug}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                >
                  <span className="text-(--text-subtle)">lrwxr-xr-x</span>
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--accent) underline decoration-(--accent-border) underline-offset-4 hover:decoration-(--accent)"
                  >
                    {proj.slug}
                  </a>
                  <span className="text-(--text-subtle)">-&gt;</span>
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--text-muted) hover:text-(--text) break-all"
                  >
                    {displayTarget}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
