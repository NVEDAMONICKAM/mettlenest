import type { DownloadFile } from "../content/types";

/** Shape of src/generated/downloads-manifest.json, written by scripts/sync-resources.ts. */
export type DownloadsManifest = {
  generatedAt: string;
  resources: Record<
    string,
    {
      /** Published files, sorted by name. Empty for locked resources. */
      files: DownloadFile[];
      /** Locked resources: how many files are waiting in resource-files (not published). */
      lockedFileCount?: number;
    }
  >;
};
