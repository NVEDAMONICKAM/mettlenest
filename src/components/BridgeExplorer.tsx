"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import type { BridgeStep } from "@/content/types";

type Props = { steps: BridgeStep[]; initialIndex?: number };

/** Reads ?step=b…e. Must render inside <Suspense> for static export. */
export function BridgeExplorerFromUrl({ steps }: Props) {
  const step = useSearchParams().get("step")?.toLowerCase();
  const found = steps.findIndex((s) => s.letter.toLowerCase() === step);
  return <BridgeExplorer steps={steps} initialIndex={found < 0 ? 0 : found} />;
}

/** The interactive bridge: an accessible tablist of the six letters plus the detail panel. */
export function BridgeExplorer({ steps, initialIndex = 0 }: Props) {
  const [active, setActive] = useState(initialIndex);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(i: number, focus = false) {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
    const url = new URL(window.location.href);
    url.searchParams.set("step", steps[i].letter.toLowerCase());
    window.history.replaceState(null, "", url);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const last = steps.length - 1;
    const next =
      e.key === "ArrowRight"
        ? (active + 1) % steps.length
        : e.key === "ArrowLeft"
          ? (active - 1 + steps.length) % steps.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  }

  const step = steps[active];

  return (
    <>
      <div className="relative mt-10 px-10 max-nav:px-0">
        <svg
          className="pointer-events-none absolute top-0 right-10 left-10 h-[70px] w-[calc(100%-80px)] max-nav:hidden"
          viewBox="0 0 1000 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M2 70 Q500 -60 998 70"
            fill="none"
            stroke="#DDB05A"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            opacity=".8"
          />
          <g
            stroke="#DDB05A"
            opacity=".35"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          >
            <line x1="250" y1="12" x2="250" y2="70" />
            <line x1="500" y1="5" x2="500" y2="70" />
            <line x1="750" y1="12" x2="750" y2="70" />
            <line x1="100" y1="44" x2="100" y2="70" />
            <line x1="900" y1="44" x2="900" y2="70" />
          </g>
        </svg>
        <div
          role="tablist"
          aria-label="BRIDGE steps"
          className="relative grid grid-cols-6 gap-2.5 pt-[70px] max-nav:grid-cols-3"
        >
          {steps.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.letter}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`bridge-tab-${s.letter.toLowerCase()}`}
                aria-selected={selected}
                aria-controls="bridge-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={onKeyDown}
                className="group flex cursor-pointer flex-col items-center justify-start rounded-md border border-white/14 bg-white/[.03] px-2 pt-[18px] pb-3.5 text-center text-on-band transition-[background-color,border-color] duration-200 hover:border-white/30 aria-selected:border-arch aria-selected:bg-white/8"
              >
                <b
                  className="block font-serif text-[46px] leading-none font-normal text-arch"
                  aria-hidden="true"
                >
                  {s.letter}
                </b>
                <span className="mt-2 block text-[13.5px] text-on-band-soft group-aria-selected:text-white">
                  <span className="sr-only">{s.letter}: </span>
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
        <div
          className="mt-3 flex justify-between font-serif text-lg text-on-band-soft italic"
          aria-hidden="true"
        >
          <span>Home</span>
          <span>School</span>
        </div>
      </div>

      <div
        id="bridge-panel"
        role="tabpanel"
        aria-labelledby={`bridge-tab-${step.letter.toLowerCase()}`}
        className="mt-[26px] grid min-h-[132px] grid-cols-[auto_1fr] items-start gap-7 rounded-lg border border-white/14 bg-white/5 px-8 py-[30px] max-nav:grid-cols-1"
      >
        <div
          className="font-serif text-[84px] leading-[.85] text-arch max-nav:text-[56px]"
          aria-hidden="true"
        >
          {step.letter}
        </div>
        <div>
          <h2 className="mb-2 text-[26px] text-white">{step.title}</h2>
          <p className="max-w-[44em] text-on-band-soft">{step.description}</p>
        </div>
      </div>
    </>
  );
}
