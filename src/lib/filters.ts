/**
 * Resource filter state and its URL form, e.g. ?egg=connect,grow&for=educators&format=Routine&q=bedtime
 *
 * - `egg` / `format`: comma-separated. Missing = everything selected; present but empty = nothing selected.
 * - `for`: "families" | "educators". Missing = everyone.
 * - `q`: free-text search.
 * - `hideLocked=1`: leave locked resources out of the grid.
 */
import type { Audience, Egg, Resource } from "@/content/types";

export type ResourceFilterState = {
  eggs: Set<Egg> | null; // null = all
  formats: Set<string> | null; // null = all
  audience: Audience | "all";
  q: string;
  hideLocked: boolean;
};

export const defaultFilters: ResourceFilterState = {
  eggs: null,
  formats: null,
  audience: "all",
  q: "",
  hideLocked: false,
};

const EGG_VALUES: Egg[] = ["understand", "connect", "grow"];

function parseList(value: string | null): string[] | null {
  if (value === null) return null;
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function parseFilters(
  params: URLSearchParams,
  formats: string[],
): ResourceFilterState {
  const eggList = parseList(params.get("egg"));
  const formatList = parseList(params.get("format"));
  const audience = params.get("for");
  return {
    eggs: eggList
      ? new Set(eggList.filter((e): e is Egg => EGG_VALUES.includes(e as Egg)))
      : null,
    formats: formatList
      ? new Set(
          formatList
            .map((f) =>
              formats.find((x) => x.toLowerCase() === f.toLowerCase()),
            )
            .filter((f): f is string => !!f),
        )
      : null,
    audience:
      audience === "families" || audience === "educators" ? audience : "all",
    q: params.get("q") ?? "",
    hideLocked: params.get("hideLocked") === "1",
  };
}

/** Writes filter state into `params` (other keys are left alone). "All selected" is written as absent. */
export function writeFilters(
  params: URLSearchParams,
  state: ResourceFilterState,
  allFormats: string[],
): URLSearchParams {
  const setList = (key: string, set: Set<string> | null, all: string[]) => {
    if (!set || all.every((v) => set.has(v))) params.delete(key);
    else params.set(key, all.filter((v) => set.has(v)).join(","));
  };
  setList("egg", state.eggs, EGG_VALUES);
  setList("format", state.formats, allFormats);
  if (state.audience === "all") params.delete("for");
  else params.set("for", state.audience);
  if (state.q.trim()) params.set("q", state.q);
  else params.delete("q");
  if (state.hideLocked) params.set("hideLocked", "1");
  else params.delete("hideLocked");
  return params;
}

export function filterResources(
  resources: Resource[],
  state: ResourceFilterState,
  isLocked: (slug: string) => boolean,
): Resource[] {
  const q = state.q.trim().toLowerCase();
  return resources.filter(
    (r) =>
      (!state.eggs || state.eggs.has(r.egg)) &&
      (!state.formats || state.formats.has(r.format)) &&
      (state.audience === "all" || r.audience.includes(state.audience)) &&
      (!state.hideLocked || !isLocked(r.slug)) &&
      (!q ||
        `${r.title} ${r.description} ${r.format}`.toLowerCase().includes(q)),
  );
}

/** Situation search: matches the situation label or any of its resources' titles. */
export function situationMatches(
  label: string,
  resourceTitles: string[],
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    label.toLowerCase().includes(q) ||
    resourceTitles.some((t) => t.toLowerCase().includes(q))
  );
}
