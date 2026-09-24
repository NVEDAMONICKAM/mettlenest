"use client";

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
}: Props) {
  const allEggs = eggs.map((e) => e.egg);
  return (
    <aside
      aria-label="Filter resources"
      className="sticky top-[110px] self-start max-nav:static"
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

      <fieldset className="mb-[26px]">
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
                  formats: toggle(state.formats, formats, f, e.target.checked),
                })
              }
            />
            {f}
          </label>
        ))}
      </fieldset>

      {showHideLocked && (
        <fieldset className="mb-[26px]">
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

      <p className="rounded-xl bg-green/14 px-3.5 py-3 text-sm font-bold text-green-text">
        Every resource is free for now.
      </p>
    </aside>
  );
}
