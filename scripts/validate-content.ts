/**
 * npm run validate:content   (runs automatically before `npm run build`)
 *
 * Fails the build if:
 *   - two resources (or two situations) share a slug
 *   - a situation or the Home "popular" list points at something that doesn't exist
 *   - src/content/locks.json lists an unknown slug or is malformed
 */
import fs from "node:fs";
import path from "node:path";
import { formatFolders, resources } from "../src/content/resources";
import { popularSituations, situations } from "../src/content/situations";
import { LOCKS_PATH } from "../src/lib/resourcePaths";

const errors: string[] = [];
const warnings: string[] = [];

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  return [...new Set(values.filter((v) => seen.has(v) || !seen.add(v)))];
}

const resourceSlugs = new Set(resources.map((r) => r.slug));
for (const d of duplicates(resources.map((r) => r.slug)))
  errors.push(`Two resources share the slug "${d}".`);
for (const d of duplicates(situations.map((s) => s.slug)))
  errors.push(`Two situations share the slug "${d}".`);

for (const r of resources) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.slug))
    errors.push(
      `Resource slug "${r.slug}" must be lowercase letters, numbers and hyphens.`,
    );
  if (!formatFolders[r.format])
    warnings.push(
      `Format "${r.format}" (${r.slug}) has no folder name in formatFolders; a default will be used.`,
    );
}

for (const s of situations) {
  for (const slug of s.resources) {
    if (!resourceSlugs.has(slug))
      errors.push(
        `Situation "${s.label}" references missing resource "${slug}".`,
      );
  }
}
for (const slug of popularSituations) {
  if (!situations.some((s) => s.slug === slug))
    errors.push(`Popular situation "${slug}" doesn't exist.`);
}

try {
  const locks = JSON.parse(fs.readFileSync(path.resolve(LOCKS_PATH), "utf8"));
  if (typeof locks.lockedMessage !== "string" || !locks.lockedMessage.trim())
    errors.push(`${LOCKS_PATH}: "lockedMessage" must be a non-empty string.`);
  if (!Array.isArray(locks.locked))
    errors.push(`${LOCKS_PATH}: "locked" must be an array of resource slugs.`);
  else
    for (const slug of locks.locked) {
      if (!resourceSlugs.has(slug))
        errors.push(`${LOCKS_PATH} lists unknown resource "${slug}".`);
    }
} catch (err) {
  errors.push(`${LOCKS_PATH} couldn't be read: ${(err as Error).message}`);
}

for (const w of warnings) console.warn(`⚠  ${w}`);
if (errors.length) {
  console.error(
    `\n✗ Content check failed:\n${errors.map((e) => `  - ${e}`).join("\n")}\n`,
  );
  process.exit(1);
}
console.log(
  `✓ Content OK: ${resources.length} resources, ${situations.length} situations.`,
);
