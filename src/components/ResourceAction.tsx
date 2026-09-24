import Link from "next/link";
import type { DownloadFile, Resource } from "@/content/types";
import { withBase } from "@/lib/withBase";
import { buttonClass } from "./SearchBox";

const pillClass =
  "inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[13px] font-bold leading-normal text-navy no-underline transition-colors hover:border-navy";

/**
 * The card's call to action. Priority: custom action (e.g. Enquire) → Watch → Download → Coming soon.
 * Never rendered for locked resources.
 */
export function ResourceAction({
  resource,
  files,
  large = false,
}: {
  resource: Resource;
  files: DownloadFile[];
  /** Full-size button, used on the detail page. */
  large?: boolean;
}) {
  const actionClass = large ? buttonClass : pillClass;
  if (resource.action) {
    return (
      <a href={resource.action.href} className={actionClass}>
        {resource.action.label}
        <span className="sr-only"> about {resource.title}</span>
      </a>
    );
  }
  if (resource.videoUrl) {
    return (
      <a
        href={resource.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={actionClass}
      >
        Watch
        <span className="sr-only"> {resource.title} (opens in a new tab)</span>
      </a>
    );
  }
  if (files.length === 1) {
    return (
      <a href={withBase(files[0].path)} download className={actionClass}>
        Download<span className="sr-only"> {resource.title}</span>
      </a>
    );
  }
  if (files.length > 1) {
    return (
      <Link href={`/resources/${resource.slug}/#files`} className={actionClass}>
        Download ({files.length})
        <span className="sr-only"> files for {resource.title}</span>
      </Link>
    );
  }
  return <span className="text-[13px] text-soft italic">Coming soon</span>;
}
