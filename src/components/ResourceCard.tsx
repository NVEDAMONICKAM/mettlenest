import Link from "next/link";
import type { DownloadFile, Resource } from "@/content/types";
import { audienceLabel, getEggInfo } from "@/lib/content";
import { AccessBadge } from "./AccessBadge";
import { EggDot } from "./EggDot";
import { ResourceAction } from "./ResourceAction";

type Props = {
  resource: Resource;
  files: DownloadFile[];
  locked?: boolean;
  /** Admin previews render without a working title link. */
  preview?: boolean;
};

export function ResourceCard({
  resource: r,
  files,
  locked = false,
  preview = false,
}: Props) {
  const titleClass =
    "text-[16.5px] leading-[1.35] font-bold text-ink no-underline hover:underline";
  return (
    <article className="relative grid grid-cols-[auto_1fr] items-start gap-x-3.5 gap-y-1 rounded-2xl border border-line px-5 pt-[18px] pb-4">
      <EggDot egg={r.egg} size={30} className="row-span-3 mt-[3px]" />
      {preview ? (
        <b className={titleClass}>{r.title}</b>
      ) : (
        <Link href={`/resources/${r.slug}/`} className={titleClass}>
          {r.title}
        </Link>
      )}
      <p className="text-[14.5px] text-soft">{r.description}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-soft">
        <span>{getEggInfo(r.egg).name}</span>
        <span>
          {r.format}
          {r.meta ? ` · ${r.meta}` : ""}
        </span>
        <span>{audienceLabel(r.audience)}</span>
        <AccessBadge locked={locked} />
        {!locked && (
          <span className="ml-auto">
            <ResourceAction resource={r} files={files} />
          </span>
        )}
      </div>
    </article>
  );
}
