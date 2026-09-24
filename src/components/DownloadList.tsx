import type { DownloadFile } from "@/content/types";
import { formatBytes } from "@/lib/format";
import { withBase } from "@/lib/withBase";
import { buttonClass } from "./SearchBox";

export function DownloadList({
  files,
  title,
}: {
  files: DownloadFile[];
  title: string;
}) {
  if (!files.length) {
    return (
      <p className="rounded-2xl border border-dashed border-line px-5 py-6 text-soft">
        Files are coming soon.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-line rounded-2xl border border-line">
      {files.map((f) => (
        <li
          key={f.path}
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
        >
          <span className="min-w-0">
            <span className="block font-bold break-all">{f.name}</span>
            <span className="text-[13px] text-soft">
              {f.ext.toUpperCase()} · {formatBytes(f.sizeBytes)}
            </span>
          </span>
          <a href={withBase(f.path)} download className={buttonClass}>
            Download
            <span className="sr-only">
              {" "}
              {f.name} ({title})
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
