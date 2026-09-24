/**
 * npm run sync:photos   (also runs before `npm run build` and during `npm run dev`)
 *
 * Makes a small web copy of the founder portrait: photos/founder.(jpg|jpeg|png|webp)
 * → public/images/founder.webp (600px wide, generated; gitignored).
 * If there's no photo, any old web copy is removed and the About page shows initials instead.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

export const PHOTOS_DIR = "photos";
const OUT = "public/images/founder.webp";
const NAMES = ["founder.jpg", "founder.jpeg", "founder.png", "founder.webp"];

export async function syncPhotos(): Promise<void> {
  const src = NAMES.map((n) => path.join(PHOTOS_DIR, n)).find((p) =>
    fs.existsSync(p),
  );
  if (!src) {
    fs.rmSync(OUT, { force: true });
    console.log(
      `Founder photo: none in ${PHOTOS_DIR}/ yet (About page shows initials).`,
    );
    return;
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const info = await sharp(src)
    .rotate() // respect the phone's orientation (EXIF)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(OUT);
  const kb = (n: number) => `${Math.round(n / 1024)} KB`;
  console.log(
    `Founder photo: ${src} (${kb(fs.statSync(src).size)}) → ${OUT} (${info.width}×${info.height}, ${kb(info.size)})`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  syncPhotos();
}
