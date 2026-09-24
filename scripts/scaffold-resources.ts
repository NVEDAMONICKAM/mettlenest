/**
 * npm run scaffold:resources
 *
 * Creates the resource-files/ folder tree from src/content/resources.ts:
 *   resource-files/<egg>/<format>/<slug>/_PUT_FILES_HERE.txt
 *
 * Safe to run any time. It creates missing folders, rewrites only the _PUT_FILES_HERE.txt
 * files, creates 00_READ_ME_FIRST.txt if it is missing, and never deletes or overwrites
 * anything else. Folders that no longer match a resource are reported, not removed.
 */
import fs from "node:fs";
import path from "node:path";
import { eggs, resources } from "../src/content/resources";
import type { Resource } from "../src/content/types";
import {
  ACCEPTED_EXTENSIONS,
  PLACEHOLDER_FILE,
  RESOURCE_FILES_DIR,
  resourceFolder,
} from "../src/lib/resourcePaths";
import { readmeText } from "./lib/readme-text";

const root = path.resolve(process.cwd(), RESOURCE_FILES_DIR);

function audienceText(r: Resource): string {
  return r.audience
    .map((a) => (a === "families" ? "Families" : "Educators"))
    .join(" & ");
}

function placeholderText(r: Resource): string {
  const lines = [
    `PUT FILES FOR THIS RESOURCE IN THIS FOLDER`,
    ``,
    `Resource:  ${r.title}`,
    `Egg:       ${eggs[r.egg].name}`,
    `Format:    ${r.format}${r.meta ? ` (${r.meta})` : ""}`,
    `For:       ${audienceText(r)}`,
    `Web page:  /resources/${r.slug}/`,
    ``,
    `Accepted file types: ${ACCEPTED_EXTENSIONS.filter((e) => e !== ".jpeg").join(", ")}`,
    `PDF is recommended: it opens the same on every device.`,
    ``,
    `Name files in lowercase with hyphens, for example:`,
    `  ${r.slug}.pdf`,
    `You can add more than one file. Each one appears as its own download, sorted by name`,
    `(so "1-guide.pdf" comes before "2-worksheet.pdf").`,
    `Keep each file under 25 MB. GitHub rejects files over 100 MB.`,
  ];
  if (r.format === "Video course") {
    lines.push(
      ``,
      `VIDEOS: videos are usually hosted on YouTube/Vimeo. Paste the link into \`videoUrl\``,
      `for "${r.slug}" in src/content/resources.ts instead of uploading large video files.`,
      `You can still put a PDF (for example, worksheets or slides) in this folder.`,
    );
  }
  lines.push(
    ``,
    `TO PUBLISH: run  npm run sync:resources`,
    `(It also runs automatically when you start "npm run dev" and before "npm run build".)`,
    ``,
    `This file is rewritten by "npm run scaffold:resources". Anything else you put in this`,
    `folder is left alone.`,
    ``,
  );
  return lines.join("\n");
}

let createdDirs = 0;
const expected = new Set<string>();

fs.mkdirSync(root, { recursive: true });

for (const r of resources) {
  const rel = resourceFolder(r);
  expected.add(rel);
  const dir = path.join(root, rel);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    createdDirs++;
  }
  fs.writeFileSync(path.join(dir, PLACEHOLDER_FILE), placeholderText(r));
}

const readmePath = path.join(root, "00_READ_ME_FIRST.txt");
const readmeCreated = !fs.existsSync(readmePath);
if (readmeCreated) fs.writeFileSync(readmePath, readmeText());

// Report folders (three levels deep) that no longer match any resource.
const orphans: string[] = [];
const subdirs = (p: string) =>
  fs.existsSync(p)
    ? fs
        .readdirSync(p, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("."))
        .map((d) => d.name)
    : [];
for (const egg of subdirs(root)) {
  for (const format of subdirs(path.join(root, egg))) {
    const slugs = subdirs(path.join(root, egg, format));
    if (
      slugs.length === 0 &&
      ![...expected].some((e) => e.startsWith(`${egg}/${format}/`))
    ) {
      orphans.push(`${egg}/${format}/ (empty format folder)`);
    }
    for (const slug of slugs) {
      const rel = `${egg}/${format}/${slug}`;
      if (!expected.has(rel)) orphans.push(rel);
    }
  }
}

console.log(
  `Scaffolded ${resources.length} resource folders in ${RESOURCE_FILES_DIR}/`,
);
console.log(
  `  ${createdDirs} new folder(s) created, ${resources.length} ${PLACEHOLDER_FILE} file(s) written.`,
);
console.log(
  readmeCreated
    ? "  Created 00_READ_ME_FIRST.txt."
    : "  00_READ_ME_FIRST.txt already exists (left as is).",
);
if (orphans.length) {
  console.warn(
    `\n⚠  ${orphans.length} folder(s) don't match any resource (renamed or removed?):`,
  );
  for (const o of orphans) console.warn(`   - ${RESOURCE_FILES_DIR}/${o}`);
  console.warn(
    "   Move any files you still need into the right folder, then delete these by hand. Nothing was deleted.",
  );
}
