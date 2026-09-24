/**
 * npm run sync:resources   (also runs before `npm run build` and at the start of `npm run dev`)
 *
 * 1. Clears public/downloads/ (generated; gitignored).
 * 2. Copies each UNLOCKED resource's files from resource-files/<egg>/<format>/<slug>/
 *    to public/downloads/<slug>/. Locked resources are skipped, so their files are never published.
 * 3. Writes src/generated/downloads-manifest.json, the only place pages get file lists from.
 * 4. Prints a summary table.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { resources } from "../src/content/resources";
import type { DownloadFile } from "../src/content/types";
import type { DownloadsManifest } from "../src/lib/manifest";
import {
  ACCEPTED_EXTENSIONS,
  DOWNLOADS_DIR,
  LOCKS_PATH,
  MANIFEST_PATH,
  PLACEHOLDER_FILE,
  RESOURCE_FILES_DIR,
  resourceFolder,
} from "../src/lib/resourcePaths";

const WARN_BYTES = 25 * 1024 * 1024;
const MAX_BYTES = 100 * 1024 * 1024;

type Row = {
  slug: string;
  files: number;
  status: "published" | "locked (not published)" | "no files yet";
};

function readLocked(cwd: string): Set<string> {
  // Read fresh from disk each time (not via import) so the dev watcher sees edits.
  const raw = JSON.parse(
    fs.readFileSync(path.join(cwd, LOCKS_PATH), "utf8"),
  ) as { locked?: unknown };
  return new Set(
    Array.isArray(raw.locked)
      ? raw.locked.filter((s): s is string => typeof s === "string")
      : [],
  );
}

/** Files in a resource folder that would be published, sorted by name. */
function listSourceFiles(
  dir: string,
  warnings: string[],
): { name: string; full: string; size: number }[] {
  if (!fs.existsSync(dir)) return [];
  const out: { name: string; full: string; size: number }[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;
    if (name.startsWith(".") || name === PLACEHOLDER_FILE) continue;
    const rel = path.relative(process.cwd(), path.join(dir, name));
    if (entry.isDirectory()) {
      warnings.push(
        `${rel}/ is a folder inside a resource folder. Put files directly in the resource folder.`,
      );
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(name).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      warnings.push(
        `${rel} skipped: "${ext || "no extension"}" isn't an accepted file type.`,
      );
      continue;
    }
    const size = fs.statSync(path.join(dir, name)).size;
    if (size > MAX_BYTES) {
      warnings.push(
        `${rel} skipped: over 100 MB (GitHub rejects files this big).`,
      );
      continue;
    }
    if (size > WARN_BYTES)
      warnings.push(`${rel} is over 25 MB. Consider compressing it.`);
    if (/[A-Z\s]/.test(name))
      warnings.push(
        `${rel}: use lowercase with hyphens and no spaces in file names.`,
      );
    out.push({ name, full: path.join(dir, name), size });
  }
  return out.sort((a, b) =>
    a.name.localeCompare(b.name, "en", { numeric: true }),
  );
}

export function sync({
  quiet = false,
}: { quiet?: boolean } = {}): DownloadsManifest {
  const cwd = process.cwd();
  const srcRoot = path.join(cwd, RESOURCE_FILES_DIR);
  const outRoot = path.join(cwd, DOWNLOADS_DIR);
  const locked = readLocked(cwd);
  const warnings: string[] = [];
  const rows: Row[] = [];
  const manifest: DownloadsManifest = {
    generatedAt: new Date().toISOString(),
    resources: {},
  };

  fs.rmSync(outRoot, { recursive: true, force: true });
  fs.mkdirSync(outRoot, { recursive: true });

  for (const r of resources) {
    const source = listSourceFiles(
      path.join(srcRoot, resourceFolder(r)),
      warnings,
    );

    if (locked.has(r.slug)) {
      manifest.resources[r.slug] = {
        files: [],
        lockedFileCount: source.length,
      };
      rows.push({
        slug: r.slug,
        files: source.length,
        status: "locked (not published)",
      });
      continue;
    }

    const files: DownloadFile[] = [];
    if (source.length)
      fs.mkdirSync(path.join(outRoot, r.slug), { recursive: true });
    for (const f of source) {
      fs.copyFileSync(f.full, path.join(outRoot, r.slug, f.name));
      files.push({
        name: f.name,
        path: `/downloads/${r.slug}/${encodeURIComponent(f.name)}`,
        sizeBytes: f.size,
        ext: path.extname(f.name).slice(1).toLowerCase(),
      });
    }
    manifest.resources[r.slug] = { files };
    rows.push({
      slug: r.slug,
      files: files.length,
      status: files.length ? "published" : "no files yet",
    });
  }

  const manifestPath = path.join(cwd, MANIFEST_PATH);
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  if (!quiet) {
    const w = Math.max(...rows.map((r) => r.slug.length), "Resource".length);
    console.log(`\n${"Resource".padEnd(w)}  Files  Status`);
    console.log(`${"-".repeat(w)}  -----  ${"-".repeat(22)}`);
    for (const r of rows)
      console.log(
        `${r.slug.padEnd(w)}  ${String(r.files).padStart(5)}  ${r.status}`,
      );
  }
  const published = rows.filter((r) => r.status === "published");
  console.log(
    `\nSynced resources: ${published.length} published (${published.reduce((n, r) => n + r.files, 0)} files), ` +
      `${rows.filter((r) => r.status.startsWith("locked")).length} locked, ` +
      `${rows.filter((r) => r.status === "no files yet").length} with no files yet.`,
  );
  for (const warning of warnings) console.warn(`⚠  ${warning}`);
  return manifest;
}

// Run when called directly (not when imported by the dev script).
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  sync();
}
