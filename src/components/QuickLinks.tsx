"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { situationMatches } from "@/lib/filters";
import { SearchBox } from "./SearchBox";
import { SituationTile, type TileSituation } from "./SituationTile";

type Who = "all" | "home" | "school";
type Props = { situations: TileSituation[] };
type Initial = { q: string; who: Who; open: string | null };

/** Reads ?q=, ?who= and ?open=. Must render inside <Suspense> for static export. */
export function QuickLinksFromUrl({ situations }: Props) {
  const p = useSearchParams();
  const who = p.get("who");
  const initial: Initial = {
    q: p.get("q") ?? "",
    who: who === "home" || who === "school" ? who : "all",
    open: p.get("open"),
  };
  return <QuickLinks situations={situations} initial={initial} />;
}

const WHO_OPTIONS: [Who, string][] = [
  ["all", "All"],
  ["home", "At home"],
  ["school", "In the classroom"],
];

export function QuickLinks({
  situations,
  initial = { q: "", who: "all", open: null },
}: Props & { initial?: Initial }) {
  const [q, setQ] = useState(initial.q);
  const [who, setWho] = useState<Who>(initial.who);
  // Tiles the user opened, and tiles the user closed (so an auto-opened single match can be closed).
  const [opened, setOpened] = useState<Set<string>>(
    () => new Set(initial.open ? [initial.open] : []),
  );
  const [closed, setClosed] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (initial.open)
      document
        .getElementById(`tile-${initial.open}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [initial.open]);

  const list = situations.filter(
    (s) =>
      (who === "all" || s.who === who || s.who === "both") &&
      situationMatches(
        s.label,
        s.resources.map((r) => r.title),
        q,
      ),
  );

  function syncUrl(nextQ: string, nextWho: Who) {
    const url = new URL(window.location.href);
    url.searchParams.delete("open"); // only meaningful on arrival
    if (nextQ.trim()) url.searchParams.set("q", nextQ);
    else url.searchParams.delete("q");
    if (nextWho === "all") url.searchParams.delete("who");
    else url.searchParams.set("who", nextWho);
    window.history.replaceState(null, "", url);
  }

  const isOpen = (slug: string) =>
    opened.has(slug) || (list.length === 1 && !closed.has(slug));

  function toggle(slug: string) {
    const open = isOpen(slug);
    syncUrl(q, who);
    setOpened((prev) => {
      const next = new Set(prev);
      if (open) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setClosed((prev) => {
      const next = new Set(prev);
      if (open) next.add(slug);
      else next.delete(slug);
      return next;
    });
  }

  return (
    <>
      <div className="mx-auto mb-9 max-w-[640px] text-center">
        <h1 className="mb-2.5 text-[44px]">Quick links</h1>
        <p className="mb-[22px] text-soft">
          Pick the situation closest to yours. Each one opens the resources to
          start with.
        </p>
        <SearchBox
          placeholder="Search situations"
          aria-label="Search situations"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setClosed(new Set());
            syncUrl(e.target.value, who);
          }}
        />
      </div>

      <div
        className="mb-[30px] flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Where it happens"
      >
        {WHO_OPTIONS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={who === value}
            onClick={() => {
              setWho(value);
              syncUrl(q, value);
            }}
            className="cursor-pointer rounded-full border border-line px-[15px] py-[7px] text-[14.5px] leading-normal font-semibold text-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
          >
            {label}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {list.length} situation{list.length === 1 ? "" : "s"} shown
      </p>

      {list.length ? (
        <div className="grid grid-cols-3 items-start gap-3.5 max-nav:grid-cols-1">
          {list.map((s) => (
            <SituationTile
              key={s.slug}
              situation={s}
              open={isOpen(s.slug)}
              onToggle={() => toggle(s.slug)}
            />
          ))}
        </div>
      ) : (
        <p className="p-[30px] text-center text-soft">
          Nothing matches yet. Try a simpler word, or{" "}
          <Link href="/resources/" className="link-gold text-navy">
            browse all resources
          </Link>
          .
        </p>
      )}
    </>
  );
}
