/**
 * npm run dev
 *
 * Syncs resource files, starts `next dev`, then re-syncs whenever something in
 * resource-files/ or src/content/locks.json changes, so a dropped-in PDF shows up on refresh.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { LOCKS_PATH, RESOURCE_FILES_DIR } from "../src/lib/resourcePaths";
import { PHOTOS_DIR, syncPhotos } from "./sync-photos";
import { sync } from "./sync-resources";

sync();
void syncPhotos();

const next = spawn("next", ["dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
});

let timer: NodeJS.Timeout | undefined;
let photoTimer: NodeJS.Timeout | undefined;
function resync(reason: string) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log(`\n↻ ${reason} changed, re-syncing resource files…`);
    try {
      sync({ quiet: true });
    } catch (err) {
      console.error("Sync failed:", err);
    }
  }, 400);
}

const watchers = [
  fs.watch(path.resolve(RESOURCE_FILES_DIR), { recursive: true }, (_e, file) =>
    resync(`${RESOURCE_FILES_DIR}/${file ?? ""}`),
  ),
  fs.watch(path.resolve(LOCKS_PATH), () => resync(LOCKS_PATH)),
  fs.watch(path.resolve(PHOTOS_DIR), () => {
    clearTimeout(photoTimer);
    photoTimer = setTimeout(() => void syncPhotos(), 400);
  }),
];

function stop(code = 0) {
  watchers.forEach((w) => w.close());
  next.kill("SIGINT");
  process.exit(code);
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
next.on("exit", (code) => stop(code ?? 0));
