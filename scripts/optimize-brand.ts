/**
 * npm run brand:images
 *
 * Makes small web copies of the logos in public/brand/ (the originals are 1000px+ and up to 1 MB).
 * Output goes to public/brand/web/ at 2x the size each is shown on the site. Re-run if a logo changes.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/brand";
const OUT = "public/brand/web";

// [source file, output width in px (2x display size), output name]
const jobs: [string, number, string][] = [
  ["emblem.png", 96, "emblem-96.webp"], // header seal, shown at 46px
  ["name.png", 300, "name-300.webp"], // header wordmark, shown ~149px wide
  ["name-dark.png", 300, "name-dark-300.webp"],
  ["wordmark.png", 1040, "wordmark-1040.webp"], // Home, shown up to 520px wide
  ["wordmark-dark.png", 1040, "wordmark-dark-1040.webp"],
  ["sign-logo.png", 680, "sign-logo-680.webp"], // About sidebar, shown up to 340px
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [src, width, out] of jobs) {
    const info = await sharp(path.join(SRC, src))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, alphaQuality: 95, effort: 6 })
      .toFile(path.join(OUT, out));
    const before = fs.statSync(path.join(SRC, src)).size;
    console.log(
      `${out.padEnd(26)} ${info.width}×${info.height}  ${Math.round(before / 1024)} KB → ${Math.round(info.size / 1024)} KB`,
    );
  }
}

main();
