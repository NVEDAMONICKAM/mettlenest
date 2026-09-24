import Link from "next/link";
import type { Egg, Situation } from "@/content/types";
import { whoLabel } from "@/lib/content";
import { EggDot } from "./EggDot";
import { PadlockIcon } from "./PadlockIcon";

export type TileResource = {
  slug: string;
  title: string;
  format: string;
  egg: Egg;
  locked: boolean;
};
export type TileSituation = Pick<Situation, "slug" | "label" | "who"> & {
  resources: TileResource[];
};

type Props = { situation: TileSituation; open: boolean; onToggle: () => void };

export function SituationTile({ situation: s, open, onToggle }: Props) {
  const eggs = [...new Set(s.resources.map((r) => r.egg))];
  const listId = `situation-${s.slug}`;
  const n = s.resources.length;

  return (
    <div
      id={`tile-${s.slug}`}
      className={`scroll-mt-28 scroll-mb-24 overflow-hidden rounded-[18px] border bg-bg ${open ? "border-navy" : "border-line"}`}
    >
      <h2 className="text-base">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-[18px] text-left focus-visible:-outline-offset-[3px]"
        >
          <span>
            <b className="block font-serif text-xl leading-[1.45] font-normal text-navy">
              {s.label}
            </b>
            <small className="mt-1 block font-sans text-[13px] text-soft">
              {whoLabel[s.who]} · {n} resource{n === 1 ? "" : "s"}
            </small>
          </span>
          <span className="flex gap-[3px]" aria-hidden="true">
            {eggs.map((egg) => (
              <EggDot key={egg} egg={egg} size={10} />
            ))}
          </span>
        </button>
      </h2>
      <ul id={listId} hidden={!open} className="px-5 pb-4">
        {s.resources.map((r) => (
          <li
            key={r.slug}
            className="border-t border-line py-[9px] text-[15px]"
          >
            <Link
              href={`/resources/${r.slug}/`}
              className="flex justify-between gap-2.5 no-underline hover:text-navy hover:underline"
            >
              <span>
                {r.title}
                {r.locked && (
                  <>
                    {" "}
                    <PadlockIcon
                      size={13}
                      className="inline-block align-[-1px] text-soft"
                    />
                    <span className="sr-only">(locked)</span>
                  </>
                )}
              </span>
              <span className="text-[13px] whitespace-nowrap text-soft">
                {r.format}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
