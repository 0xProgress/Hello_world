"use client";

import type { Project } from "@/content/profile";
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
    { id: "projects", label: "ls ./work" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-(--border) bg-(--surface-terminal)">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border) bg-(--surface) px-6 py-3.5">
        <span className="font-mono text-xs text-(--text-subtle)">
          {handle.toLowerCase()}@lagos
        </span>

        <div
          role="group"
          aria-label="Terminal commands"
          className="flex items-center gap-1.5"
        >
          {commands.map((cmd) => {
            const active = command === cmd.id;
            return (
              <button
                key={cmd.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCommand(cmd.id)}
                className={`min-h-9 rounded-md px-3 font-mono text-xs transition-colors ${
                  active
                    ? "bg-(--accent-soft) text-(--accent) font-medium"
                    : "text-(--text-subtle) hover:text-(--text)"
                }`}
              >
                {cmd.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8 font-mono text-sm leading-relaxed">
        <p className="text-(--text)">
          <span className="text-(--accent)" aria-hidden="true">
            $
          </span>{" "}
          {commands.find((c) => c.id === command)?.label}
        </p>

        {command === "whoami" && (
          <div className="mt-4 space-y-2 text-(--text-muted)">
            {terminalLines.map((line, idx) => (
              <p key={line}>
                {idx === 0 ? `> ${line}` : `\u00A0\u00A0${line}`}
              </p>
            ))}
          </div>
        )}

        {command === "stack" && (
          <div className="mt-4 space-y-2 text-(--text-muted)">
            <p>&gt; languages: Go, Python, TypeScript, Bash</p>
            <p>&nbsp;&nbsp;focus: CLI tooling, backend services, DNS infra</p>
            <p>&nbsp;&nbsp;environment: Linux · Git · CI/CD automation</p>
          </div>
        )}

        {command === "projects" && (
          <div className="mt-4 space-y-2.5 text-sm text-(--text-muted)">
            {projects.map((proj) => {
              const displayTarget = proj.repoUrl.replace(/^https?:\/\//, "");
              return (
                <div
                  key={proj.slug}
                  className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1"
                >
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--accent) underline decoration-(--accent-border) underline-offset-4 hover:decoration-(--accent)"
                  >
                    {proj.slug}
                  </a>
                  <span className="text-(--text-subtle)">→</span>
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
