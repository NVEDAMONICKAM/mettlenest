/**
 * Where each resource's files live. Shared by the Node scripts and the site,
 * so it uses relative imports only.
 */
import { eggs, formatFolders } from "../content/resources";
import type { Resource } from "../content/types";

export const RESOURCE_FILES_DIR = "resource-files";
export const DOWNLOADS_DIR = "public/downloads";
export const MANIFEST_PATH = "src/generated/downloads-manifest.json";
export const LOCKS_PATH = "src/content/locks.json";

/** File types the sync script publishes. PDF is recommended. */
export const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".pptx",
  ".png",
  ".jpg",
  ".jpeg",
  ".mp3",
  ".mp4",
];

/** Files the sync script never publishes. */
export const PLACEHOLDER_FILE = "_PUT_FILES_HERE.txt";

export function formatFolder(format: string): string {
  return (
    formatFolders[format] ??
    `${format.toLowerCase().replace(/[^a-z0-9]+/g, "-")}s`
  );
}

/** e.g. "2-connect/routines/early-years-routine" (relative to resource-files/). */
export function resourceFolder(
  r: Pick<Resource, "egg" | "format" | "slug">,
): string {
  return `${eggs[r.egg].folder}/${formatFolder(r.format)}/${r.slug}`;
}
