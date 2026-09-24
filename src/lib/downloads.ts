/**
 * File lists for resources, read from src/generated/downloads-manifest.json
 * (written by `npm run sync:resources`). Server-only: uses the file system at build time.
 */
import fs from "node:fs";
import path from "node:path";
import type { DownloadFile } from "@/content/types";
import type { DownloadsManifest } from "./manifest";
import { MANIFEST_PATH } from "./resourcePaths";

let cached: DownloadsManifest | undefined;

function readManifest(): DownloadsManifest {
  // In dev, re-read on every request so newly synced files appear on refresh.
  if (cached && process.env.NODE_ENV === "production") return cached;
  try {
    cached = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), MANIFEST_PATH), "utf8"),
    );
  } catch {
    console.warn(
      `[downloads] ${MANIFEST_PATH} not found. Run "npm run sync:resources".`,
    );
    cached = { generatedAt: "", resources: {} };
  }
  return cached!;
}

/** Published files for a resource (empty when locked or when there are no files yet). */
export function getDownloads(slug: string): DownloadFile[] {
  return readManifest().resources[slug]?.files ?? [];
}

/** Number of files for a resource, including unpublished ones when it is locked. */
export function getFileCount(slug: string): number {
  const entry = readManifest().resources[slug];
  return entry ? (entry.lockedFileCount ?? entry.files.length) : 0;
}
