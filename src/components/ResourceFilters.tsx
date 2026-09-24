"use client";

import { useState } from "react";
import type { Audience, Egg } from "@/content/types";
import type { ResourceFilterState } from "@/lib/filters";
import { EggDot } from "./EggDot";

type Props = {
  state: ResourceFilterState;
  eggs: { egg: Egg; name: string }[];
  formats: string[];
  onChange: (next: ResourceFilterState) => void;
  /** Show the "Hide locked" checkbox (only when something is locked). */
  showHideLocked?: boolean;
  className?: string;
};

const labelClass =
  "flex cursor-pointer items-center gap-2.5 py-[5px] text-[15.5px]";
const inputClass = "size-4 accent-navy";
const legendClass = "mb-2.5 text-sm font-bold text-soft";

function toggle<T>(
  set: Set<T> | null,
  all: T[],
  value: T,
  on: boolean,
): Set<T> {
  const next = new Set(set ?? all);
  if (on) next.add(value);
  else next.delete(value);
  return next;
}

export function ResourceFilters({
  state,
  eggs,
  formats,
  onChange,
  showHideLocked,
  className = "",
}: Props) {
  const allEggs = eggs.map((e) => e.egg);
  // Mobile only: the filters collapse behind a "Filters" button. Always shown from 900px up.
  const [open, setOpen] = useState(false);
  const active =
    (state.eggs && state.eggs.size < allEggs.length ? 1 : 0) +
    (state.formats && state.formats.size < formats.length ? 1 : 0) +
    (state.audience !== "all" ? 1 : 0) +
    (state.hideLocked ? 1 : 0);

  return (
    <aside
      aria-label="Filter resources"
      className={`sticky top-[110px] self-start max-nav:static ${className}`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="resource-filters"
        onClick={() => setOpen(!open)}
        className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-[14px] border border-line bg-panel px-4 py-3 text-[15px] leading-normal font-bold nav:hidden"
      >
        <span>
          Filters
          {active > 0 && (
            <span className="font-semibold text-soft"> · {active} active</span>
          )}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id="resource-filters"
        className={`${open ? "" : "max-nav:hidden"} max-nav:mb-6 max-nav:grid max-nav:grid-cols-2 max-nav:gap-x-4 max-nav:rounded-2xl max-nav:border max-nav:border-line max-nav:px-4 max-nav:pt-4 max-nav:pb-4`}
      >
        <fieldset className="mb-[26px]">
          <legend className={legendClass}>Egg</legend>
          {eggs.map(({ egg, name }) => (
            <label key={egg} className={labelClass}>
              <input
                type="checkbox"
                className={inputClass}
                checked={!state.eggs || state.eggs.has(egg)}
                onChange={(e) =>
                  onChange({
                    ...state,
                    eggs: toggle(state.eggs, allEggs, egg, e.target.checked),
                  })
                }
              />
              <EggDot egg={egg} />
              {name}
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-[26px]">
          <legend className={legendClass}>For</legend>
          {(
            [
              ["all", "Everyone"],
              ["families", "Families"],
              ["educators", "Educators"],
            ] as [Audience | "all", string][]
          ).map(([value, label]) => (
            <label key={value} className={labelClass}>
              <input
                type="radio"
                name="audience"
                className={inputClass}
                checked={state.audience === value}
                onChange={() => onChange({ ...state, audience: value })}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-[26px] max-nav:col-span-2 max-nav:columns-2 max-nav:gap-x-4">
          <legend className={legendClass}>Format</legend>
          {formats.map((f) => (
            <label key={f} className={labelClass}>
              <input
                type="checkbox"
                className={inputClass}
                checked={!state.formats || state.formats.has(f)}
                onChange={(e) =>
                  onChange({
                    ...state,
                    formats: toggle(
                      state.formats,
                      formats,
                      f,
                      e.target.checked,
                    ),
                  })
                }
              />
              {f}
            </label>
          ))}
        </fieldset>

        {showHideLocked && (
          <fieldset className="mb-[26px] max-nav:col-span-2">
            <legend className={legendClass}>Access</legend>
            <label className={labelClass}>
              <input
                type="checkbox"
                className={inputClass}
                checked={state.hideLocked}
                onChange={(e) =>
                  onChange({ ...state, hideLocked: e.target.checked })
                }
              />
              Hide locked
            </label>
          </fieldset>
        )}

        <p className="rounded-xl bg-green/14 px-3.5 py-3 text-sm font-bold text-green-text max-nav:col-span-2">
          Every resource is free for now.
        </p>
      </div>
    </aside>
  );
}
