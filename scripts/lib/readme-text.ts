import { eggs, formatFolders } from "../../src/content/resources";
import type { Egg } from "../../src/content/types";

/** Contents of resource-files/00_READ_ME_FIRST.txt. */
export function readmeText(): string {
  const eggLines = (Object.keys(eggs) as Egg[]).map(
    (e) =>
      `  ${eggs[e].folder.padEnd(14)} ${eggs[e].name}: ${eggs[e].line.toLowerCase()}`,
  );
  const formatLines = Object.entries(formatFolders).map(
    ([f, folder]) => `  ${folder.padEnd(20)} ${f}`,
  );

  return `METTLENEST RESOURCE FILES: READ ME FIRST
========================================

This folder holds the downloadable files (PDFs and so on) for the website's
Resources section. Nothing in here is on the website until you "sync" it.


HOW THE FOLDERS ARE ORGANISED
-----------------------------
Egg folder  >  format folder  >  one folder per resource

The three egg folders match the three eggs in the logo:
${eggLines.join("\n")}

Inside each egg is a folder for each format, for example:
${formatLines.join("\n")}

Inside those is one folder per resource, named after its web address.
For example, the "Early years routine" files go in:
  2-connect/routines/early-years-routine/
and appear on the page /resources/early-years-routine/

Every resource folder has a _PUT_FILES_HERE.txt file that says which
resource it is for. You can leave it there; it is never published.


HOW TO ADD A FILE
-----------------
1. Find the resource's folder (open its _PUT_FILES_HERE.txt to check).
2. Drop your file in. PDF is best. Also accepted: .docx .pptx .png .jpg .mp3 .mp4
3. If "npm run dev" is running, refresh the page. Otherwise run:
     npm run sync:resources
   (This also happens automatically before "npm run build".)

You can put several files in one folder. Each becomes its own download,
sorted by name, so start names with numbers to set the order:
  1-guide.pdf, 2-worksheet.pdf

File names: lowercase, words joined with hyphens, no spaces.
  Good:  supporting-selective-mutism.pdf
  Avoid: Supporting Selective Mutism (FINAL v2).pdf

File size: keep each file under 25 MB. GitHub rejects anything over 100 MB.
For videos, upload to YouTube or Vimeo and paste the link into the
resource's "videoUrl" in src/content/resources.ts instead.


HOW TO ADD A NEW RESOURCE
-------------------------
1. Add it to src/content/resources.ts (copy an existing entry and change it).
   The "slug" becomes its web address and folder name, e.g. "my-new-guide".
2. Run:  npm run scaffold:resources
   This creates its folder here, with a _PUT_FILES_HERE.txt inside.
3. Drop the files in and sync (see above).

If you rename a resource's slug, egg or format, scaffold creates the new folder
and warns you about the old one. Move your files across, then delete the old
folder yourself. Scripts never delete your files.


LOCKING A RESOURCE
------------------
Everything is free and unlocked unless you lock it.
To lock or unlock, open  /admin/locks/  on the site while running
"npm run dev", or edit src/content/locks.json by hand.

Locked files are NOT published: the sync step skips them, so they never
reach the website even though they stay safe in this folder. The resource
still shows on the site, greyed out with a padlock.

Locking is not a login or a paywall. Paid access will need a backend later.


WHAT GETS PUBLISHED
-------------------
"sync" copies files from here into public/downloads/ (which is generated;
never edit it by hand) and records them in src/generated/downloads-manifest.json.
Text files like this one, _PUT_FILES_HERE.txt and hidden files are skipped.
`;
}
