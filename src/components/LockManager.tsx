"use client";

import { useEffect, useMemo, useState } from "react";
import type { Egg, Resource } from "@/content/types";
import { EggDot } from "./EggDot";
import { PadlockIcon } from "./PadlockIcon";
import { ResourceCard } from "./ResourceCard";
import { SearchBox, buttonClass } from "./SearchBox";

/** Local-only helper started by `npm run locks:dev` (scripts/locks-dev-server.ts). */
const HELPER = "http://127.0.0.1:4319";

type Props = {
  groups: { egg: Egg; name: string; resources: Resource[] }[];
  fileCounts: Record<string, number>;
  initialLocked: string[];
  initialMessage: string;
};

const ghostButton =
  "inline-block cursor-pointer rounded-[10px] border border-line bg-bg px-4 py-2.5 text-[15px] leading-normal font-bold text-ink hover:border-navy disabled:cursor-not-allowed disabled:opacity-50";

export function LockManager({
  groups,
  fileCounts,
  initialLocked,
  initialMessage,
}: Props) {
  const all = useMemo(() => groups.flatMap((g) => g.resources), [groups]);
  const [locked, setLocked] = useState(() => new Set(initialLocked));
  const [message, setMessage] = useState(initialMessage);
  const [q, setQ] = useState("");
  const [helper, setHelper] = useState<"checking" | "on" | "off">("checking");
  const [status, setStatus] = useState<{
    kind: "ok" | "error";
    text: string;
  } | null>(null);
  const [saved, setSaved] = useState({
    locked: [...initialLocked].sort().join(","),
    message: initialMessage,
  });

  // Keep resource order so locks.json diffs stay tidy.
  const json = useMemo(
    () =>
      `${JSON.stringify(
        {
          lockedMessage: message.trim(),
          locked: all.filter((r) => locked.has(r.slug)).map((r) => r.slug),
        },
        null,
        2,
      )}\n`,
    [all, locked, message],
  );
  const dirty =
    [...locked].sort().join(",") !== saved.locked || message !== saved.message;

  useEffect(() => {
    // The helper only exists on the owner's machine; don't probe from the live site.
    if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      queueMicrotask(() => setHelper("off"));
      return;
    }
    fetch(`${HELPER}/health`, { signal: AbortSignal.timeout(1500) })
      .then((r) => setHelper(r.ok ? "on" : "off"))
      .catch(() => setHelper("off"));
  }, []);

  function setOne(slug: string, on: boolean) {
    setLocked((prev) => {
      const next = new Set(prev);
      if (on) next.add(slug);
      else next.delete(slug);
      return next;
    });
    setStatus(null);
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" }),
    );
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "locks.json",
    });
    a.click();
    URL.revokeObjectURL(url);
    setStatus({
      kind: "ok",
      text: "Downloaded locks.json. Replace src/content/locks.json with it, then rebuild and redeploy.",
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(json);
      setStatus({
        kind: "ok",
        text: "JSON copied. Paste it into src/content/locks.json, then rebuild and redeploy.",
      });
    } catch {
      setStatus({
        kind: "error",
        text: "Couldn't copy automatically. Use “Show JSON” below and copy it by hand.",
      });
    }
  }

  async function saveToProject() {
    try {
      const res = await fetch(`${HELPER}/locks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok)
        throw new Error(body.error ?? `Helper replied ${res.status}`);
      setSaved({ locked: [...locked].sort().join(","), message });
      setStatus({
        kind: "ok",
        text: "Saved to src/content/locks.json. If npm run dev is running, the site updates in a moment. Commit the change and redeploy to publish it.",
      });
    } catch (err) {
      setStatus({
        kind: "error",
        text: `Save failed: ${(err as Error).message}. Is npm run locks:dev still running?`,
      });
    }
  }

  const query = q.trim().toLowerCase();
  const matches = (r: Resource) =>
    !query || `${r.title} ${r.format} ${r.slug}`.toLowerCase().includes(query);

  return (
    <>
      <h1 className="mb-2 text-[40px]">Lock manager</h1>
      <p className="mb-5 max-w-[46em] text-soft">
        Choose which resources are locked. Locked resources stay visible on the
        site, greyed out with a padlock, and their files are not published.
      </p>
      <p
        role="note"
        className="mb-8 flex max-w-[46em] gap-3 rounded-xl border border-gold/60 bg-gold/10 px-4 py-3 text-[15px]"
      >
        <PadlockIcon size={18} className="mt-0.5 shrink-0 text-gold-text" />
        <span>
          Locking hides a resource&apos;s files from the published site. This is
          not a login or paywall. Paid access will need a backend later.
        </span>
      </p>

      {/* Toolbar */}
      <div className="sticky top-[77px] z-10 -mx-[26px] mb-8 border-b border-line bg-bg/95 px-[26px] py-4 backdrop-blur max-nav:static">
        <div className="flex flex-wrap items-end gap-3">
          <button
            type="button"
            className={ghostButton}
            onClick={() => setLocked(new Set(all.map((r) => r.slug)))}
          >
            Lock all
          </button>
          <button
            type="button"
            className={ghostButton}
            onClick={() => setLocked(new Set())}
          >
            Unlock all
          </button>
          <SearchBox
            className="min-w-[220px] flex-1"
            placeholder="Search resources"
            aria-label="Search resources"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p
            className="ml-auto self-center text-[15px] font-bold"
            aria-live="polite"
          >
            {locked.size} of {all.length} locked
            {dirty && (
              <span className="ml-2 font-semibold text-gold-text">
                · unsaved changes
              </span>
            )}
          </p>
        </div>
        <label className="mt-3 block text-sm font-bold text-soft">
          Locked message
          <input
            type="text"
            value={message}
            maxLength={200}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full rounded-[10px] border border-line bg-panel px-3 py-2 text-base leading-normal font-normal text-ink focus:border-navy focus:outline-none"
          />
        </label>
      </div>

      {/* Rows */}
      {groups.map((g) => {
        const rows = g.resources.filter(matches);
        if (!rows.length) return null;
        return (
          <section
            key={g.egg}
            aria-labelledby={`group-${g.egg}`}
            className="mb-10"
          >
            <h2
              id={`group-${g.egg}`}
              className="mb-4 flex items-center gap-2.5 text-[26px]"
            >
              <EggDot egg={g.egg} size={16} /> {g.name}
            </h2>
            <ul className="divide-y divide-line border-y border-line">
              {rows.map((r) => {
                const on = locked.has(r.slug);
                const n = fileCounts[r.slug] ?? 0;
                return (
                  <li
                    key={r.slug}
                    className="grid grid-cols-[1fr_minmax(0,440px)] items-center gap-6 py-4 max-nav:grid-cols-1"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={`Lock ${r.title}`}
                        onClick={() => setOne(r.slug, !on)}
                        className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${on ? "bg-accent" : "bg-line"}`}
                      >
                        <span
                          className={`absolute top-1 left-1 grid size-5 place-items-center rounded-full bg-bg text-ink shadow transition-transform ${on ? "translate-x-5" : ""}`}
                        >
                          {on && <PadlockIcon size={11} />}
                        </span>
                      </button>
                      <div>
                        <p className="leading-snug font-bold">{r.title}</p>
                        <p className="text-sm text-soft">
                          {r.format} · {n} file{n === 1 ? "" : "s"}
                          {on && n > 0 && " (not published while locked)"}
                        </p>
                      </div>
                    </div>
                    <div aria-hidden="true" inert>
                      <ResourceCard
                        resource={r}
                        files={[]}
                        locked={on}
                        lockedMessage={message}
                        preview
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {groups.every((g) => !g.resources.some(matches)) && (
        <p className="p-[30px] text-center text-soft">
          No resources match that search.
        </p>
      )}

      {/* Saving */}
      <section
        aria-labelledby="save-heading"
        className="mt-12 rounded-[22px] bg-panel px-8 py-7 max-nav:px-5"
      >
        <h2 id="save-heading" className="mb-2 text-[26px]">
          Save your changes
        </h2>
        <p className="mb-5 text-soft">
          This page can&apos;t change the live site by itself. Replace{" "}
          <code>src/content/locks.json</code> with this file, then rebuild and
          redeploy.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={buttonClass} onClick={download}>
            Download locks.json
          </button>
          <button type="button" className={ghostButton} onClick={copy}>
            Copy JSON
          </button>
          {helper === "on" && (
            <button
              type="button"
              className={ghostButton}
              onClick={saveToProject}
              disabled={!dirty}
            >
              Save to project
            </button>
          )}
        </div>
        <p className="mt-3 text-sm text-soft">
          {helper === "on"
            ? "Local helper detected: “Save to project” writes src/content/locks.json directly. Remember to commit and redeploy."
            : helper === "off"
              ? "Tip: while developing, run npm run locks:dev in a second terminal to get a “Save to project” button."
              : "Checking for the local helper…"}
        </p>
        {status && (
          <p
            role="status"
            className={`mt-4 rounded-xl px-4 py-3 text-[15px] font-semibold ${status.kind === "ok" ? "bg-green/14 text-green-text" : "bg-[#b3261e]/10 text-[#b3261e] dark:text-[#ffb4ab]"}`}
          >
            {status.text}
          </p>
        )}
        <details className="mt-5">
          <summary className="cursor-pointer text-[15px] font-bold">
            Show JSON
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-line bg-bg p-4 text-sm">
            {json}
          </pre>
        </details>
      </section>
    </>
  );
}
