'use client';

import { useState } from 'react';
import { ChevronDown, Cpu, Layers, Radio } from 'lucide-react';

type SpecTab = 'runtime' | 'philosophy' | 'focus';

const SPEC_TABS: { id: SpecTab; label: string }[] = [
  { id: 'runtime', label: 'runtime' },
  { id: 'philosophy', label: 'principles' },
  { id: 'focus', label: 'focus' },
];

export default function HeroTelemetry({
  handle,
  location,
  projectCount,
}: {
  handle: string;
  location: string;
  projectCount: number;
}) {
  const [activeTab, setActiveTab] = useState<SpecTab>('runtime');
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <aside
      aria-label="System specification readout"
      className="surface-panel relative overflow-hidden p-4 sm:p-5 lg:p-6"
    >
      {/* Subtle corner registration marks (desktop) */}
      <span
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute top-2 left-2 font-mono text-[10px] leading-none text-(--text-subtle)/60"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute top-2 right-2 font-mono text-[10px] leading-none text-(--text-subtle)/60"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute bottom-2 left-2 font-mono text-[10px] leading-none text-(--text-subtle)/60"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute bottom-2 right-2 font-mono text-[10px] leading-none text-(--text-subtle)/60"
      >
        +
      </span>

      {/* Mobile Collapsible Trigger (< 1024px) */}
      <button
        type="button"
        onClick={() => setMobileExpanded((prev) => !prev)}
        aria-expanded={mobileExpanded}
        aria-controls="hero-spec-body"
        className="flex w-full min-h-11 items-center justify-between gap-2 lg:hidden"
      >
        <div className="flex items-center gap-2 font-mono text-xs text-(--text)">
          <Radio size={13} aria-hidden="true" className="text-(--accent)" />
          <span>spec://{handle.toLowerCase()}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px]"
            style={{
              backgroundColor: 'var(--status-active-bg)',
              color: 'var(--status-active)',
            }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-current"
            />
            online
          </span>
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={`text-(--text-subtle) transition-transform duration-200 ${
              mobileExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Desktop Static Header (>= 1024px) */}
      <div className="hidden lg:flex items-center justify-between gap-2 border-b border-(--border) pb-3.5 mb-4">
        <div className="flex items-center gap-2 font-mono text-xs text-(--text)">
          <Radio size={13} aria-hidden="true" className="text-(--accent)" />
          <span>spec://{handle.toLowerCase()}</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px]"
          style={{
            backgroundColor: 'var(--status-active-bg)',
            color: 'var(--status-active)',
          }}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-current"
          />
          online
        </span>
      </div>

      {/* Body: collapsible on < 1024px, always visible on >= 1024px */}
      <div
        id="hero-spec-body"
        className={`${
          mobileExpanded
            ? 'mt-3 border-t border-(--border) pt-3.5 block'
            : 'hidden'
        } lg:mt-0 lg:border-t-0 lg:pt-0 lg:block`}
      >
        {/* Mode Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Specification views"
          className="grid grid-cols-3 gap-1 rounded-md border border-(--border) bg-(--bg) p-1 mb-4"
        >
          {SPEC_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-10 rounded-sm font-mono text-[11px] transition-colors ${
                  selected
                    ? 'bg-(--surface-elevated) text-(--accent) font-medium border border-(--border)'
                    : 'text-(--text-subtle) hover:text-(--text) border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'runtime' && (
          <dl className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between gap-3 border-b border-(--border)/70 pb-2">
              <dt className="text-(--text-subtle)">node</dt>
              <dd className="text-(--text) text-right">{location} (UTC+1)</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-(--border)/70 pb-2">
              <dt className="text-(--text-subtle)">primary_lang</dt>
              <dd className="text-(--text) text-right">Go / Python</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-(--border)/70 pb-2">
              <dt className="text-(--text-subtle)">public_tools</dt>
              <dd className="tabular-nums text-(--text) text-right">
                0{projectCount} maintained
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-(--text-subtle)">license</dt>
              <dd className="text-(--accent) text-right">100% Open Source</dd>
            </div>
          </dl>
        )}

        {activeTab === 'philosophy' && (
          <ul className="space-y-2.5 font-mono text-xs text-(--text-muted)">
            <li className="flex items-start gap-2">
              <Cpu
                size={13}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-(--accent)"
              />
              <span>Single-binary, low-overhead CLI primitives.</span>
            </li>
            <li className="flex items-start gap-2">
              <Layers
                size={13}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-(--accent)"
              />
              <span>Explicit failure diagnostics over silent hangs.</span>
            </li>
            <li className="flex items-start gap-2">
              <Radio
                size={13}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-(--accent)"
              />
              <span>Zero bloat. Built to stay fast on constrained hardware.</span>
            </li>
          </ul>
        )}

        {activeTab === 'focus' && (
          <dl className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between gap-3 border-b border-(--border)/70 pb-2">
              <dt className="text-(--text-subtle)">systems</dt>
              <dd className="text-(--text) text-right">
                Concurrency &amp; CLIs
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-(--border)/70 pb-2">
              <dt className="text-(--text-subtle)">community</dt>
              <dd className="text-(--text) text-right">is-a.dev maintainer</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-(--text-subtle)">status</dt>
              <dd className="text-(--accent) text-right">Shipping in public</dd>
            </div>
          </dl>
        )}
      </div>
    </aside>
  );
}
