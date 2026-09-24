import type { DownloadFile } from "@/content/types";

/** Published files for a resource. Filled from the downloads manifest in the file-system step. */
export function getDownloads(slug: string): DownloadFile[] {
  void slug;
  return [];
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
