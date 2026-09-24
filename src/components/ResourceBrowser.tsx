"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { DownloadFile, Egg, Resource } from "@/content/types";
import {
  defaultFilters,
  filterResources,
  parseFilters,
  writeFilters,
  type ResourceFilterState,
} from "@/lib/filters";
import { ResourceCard } from "./ResourceCard";
import { ResourceFilters } from "./ResourceFilters";
import { SearchBox } from "./SearchBox";

type Props = {
  resources: Resource[];
  eggs: { egg: Egg; name: string }[];
  formats: string[];
  files: Record<string, DownloadFile[]>;
  lockedSlugs: string[];
};

/** Reads the filters from the URL. Must render inside <Suspense> for static export. */
export function ResourceBrowserFromUrl(props: Props) {
  const params = useSearchParams();
  const initial = parseFilters(
    new URLSearchParams(params.toString()),
    props.formats,
  );
  return <ResourceBrowser {...props} initial={initial} />;
}

export function ResourceBrowser({
  resources,
  eggs,
  formats,
  files,
  lockedSlugs,
  initial = defaultFilters,
}: Props & { initial?: ResourceFilterState }) {
  const [state, setState] = useState(initial);
  const locked = useMemo(() => new Set(lockedSlugs), [lockedSlugs]);
  const items = filterResources(resources, state, (slug) => locked.has(slug));

  function update(next: ResourceFilterState) {
    setState(next);
    const url = new URL(window.location.href);
    writeFilters(url.searchParams, next, formats);
    window.history.replaceState(null, "", url);
  }

  // Mobile order is heading → filters → results; from 900px the filters sit in a left column.
  return (
    <div className="grid grid-cols-1 nav:grid-cols-[250px_1fr] nav:grid-rows-[auto_1fr] nav:gap-x-11">
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-5 nav:col-start-2 nav:row-start-1">
        <div>
          <h1 className="mb-1.5 text-[40px]">Resources</h1>
          <p className="text-[15px] text-soft" aria-live="polite">
            {items.length} of {resources.length} resources
          </p>
        </div>
        <SearchBox
          className="min-w-[280px] max-nav:w-full max-nav:min-w-0"
          placeholder="Search resources"
          aria-label="Search resources"
          value={state.q}
          onChange={(e) => update({ ...state, q: e.target.value })}
        />
      </div>
      <ResourceFilters
        className="nav:col-start-1 nav:row-span-2 nav:row-start-1"
        state={state}
        eggs={eggs}
        formats={formats}
        onChange={update}
        showHideLocked={locked.size > 0}
      />
      <div className="nav:col-start-2 nav:row-start-2">
        {items.length ? (
          <div className="grid grid-cols-2 gap-3.5 max-nav:grid-cols-1">
            {items.map((r) => (
              <ResourceCard
                key={r.slug}
                resource={r}
                files={files[r.slug] ?? []}
                locked={locked.has(r.slug)}
              />
            ))}
          </div>
        ) : (
          <p className="p-[30px] text-center text-soft">
            No resources match. Clear a filter or the search.
          </p>
        )}
      </div>
    </div>
  );
}
