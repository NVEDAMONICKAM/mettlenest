# MettleNest website

Behaviour coaching and educational training for families, educators and schools.

This is a **fully static website**: no server, no database, no logins. It builds into a folder of
plain files (`out/`) that can be hosted almost anywhere, such as GitHub Pages or Vercel.

---

## 1. Running the site on your computer

You need [Node.js](https://nodejs.org/) version 20 or newer (the "LTS" download is fine).

Open a terminal in this folder, then:

```bash
npm install     # first time only: downloads the tools the site needs
npm run dev     # starts the site
```

Open **http://localhost:3000** in your browser. Leave the terminal running while you work. Changes
you make to content files show up when you refresh. Press `Ctrl + C` in the terminal to stop.

---

## 2. Adding a PDF (or other file) to a resource

All downloadable files live in the **`resource-files/`** folder, organised like this:

```
resource-files/
  00_READ_ME_FIRST.txt        ← full instructions in plain English
  1-understand/               ← Understand egg (green)
  2-connect/                  ← Connect egg (blue)
  3-grow/                     ← Grow egg (gold)
     lessons/                 ← one folder per format
        read-the-pattern/     ← one folder per resource
           _PUT_FILES_HERE.txt
```

To add a file:

1. Find the resource's folder. Each one has a `_PUT_FILES_HERE.txt` saying which resource it is for.
2. Drop your file in. **PDF is recommended.** Also accepted: `.docx`, `.pptx`, `.png`, `.jpg`, `.mp3`, `.mp4`.
3. If `npm run dev` is running, just **refresh the page**. The file is picked up automatically.

Tips:

- Name files in lowercase with hyphens, e.g. `supporting-selective-mutism.pdf`.
- Several files in one folder appear as separate downloads, sorted by name (`1-guide.pdf`, `2-worksheet.pdf`).
- Keep each file **under 25 MB**. GitHub rejects files over 100 MB.
- For videos, upload to YouTube or Vimeo and paste the link into `videoUrl` for that resource in
  `src/content/resources.ts`. Don't upload big video files.

Files are copied into the site by `npm run sync:resources`. This runs automatically when you start
`npm run dev` and before every `npm run build`, so you rarely need to run it yourself.

---

## 3. Editing content

All the words on the site live in **`src/content/`**:

| File            | What's in it                                                 |
| --------------- | ------------------------------------------------------------ |
| `site.ts`       | Founder name, enquiry email, website address, navigation     |
| `about.ts`      | About page text                                              |
| `bridge.ts`     | The six BRIDGE steps                                         |
| `resources.ts`  | Every resource: title, description, egg, format, audience    |
| `situations.ts` | Quick links situations, and the four "popular" chips on Home |
| `locks.json`    | Which resources are locked (see section 4)                   |

**Before launch, fill in the placeholders marked `TODO` in `src/content/site.ts`:** the founder's
name, the enquiry email and the website address.

### Add or edit a resource

1. Open `src/content/resources.ts`.
2. Copy an existing entry and change it. The `slug` becomes the web address
   (`/resources/<slug>/`) and the folder name, so keep it lowercase with hyphens.
3. Run `npm run scaffold:resources` to create its folder in `resource-files/`.
4. Add files as described above.

If you change a resource's slug, egg or format, the scaffold creates the new folder and warns you
about the old one. Move any files across, then delete the old folder yourself. **Scripts never
delete your files.**

Adding a new _format_ (e.g. "Podcast")? Add a line for it to `formatFolders` in the same file, so it
gets a tidy folder name.

### Add a situation (Quick links)

Open `src/content/situations.ts` and copy an entry. `who` is `"home"`, `"school"` or `"both"`, and
`resources` lists resource slugs from `resources.ts`.

### Safety net

Before every build, `npm run validate:content` checks your content. The build **stops with a clear
message** if two resources share a slug, a situation points at a resource that doesn't exist, or
`locks.json` mentions an unknown resource.

---

## 4. Locking and unlocking resources

Everything is free and unlocked by default. A locked resource still shows on the site, greyed out
with a padlock, but **its files are not published**.

> Locking hides a resource's files from the published site. This is not a login or paywall.
> Paid access will need a backend later.

### Using the lock manager

1. Run `npm run dev` and open **http://localhost:3000/admin/locks/**.
   This page isn't linked anywhere and search engines are told to ignore it.
2. Flip the switches and edit the locked message. The previews show exactly how each card will look.
3. Save, using either method:
   - **Easiest (while developing):** in a _second_ terminal, run `npm run locks:dev`. A
     **Save to project** button appears; it writes `src/content/locks.json` for you.
   - **Always works:** click **Download locks.json** (or **Copy JSON**) and replace
     `src/content/locks.json` with it.
4. Rebuild and redeploy to publish the change (see below). If you use git, commit `locks.json` too.

You can also edit `src/content/locks.json` by hand. `locked` is a list of resource slugs.

---

## 5. Building the finished site

```bash
npm run build     # checks content, copies files, and creates the out/ folder
npm run preview   # view the finished site at http://localhost:3000
```

`out/` is the complete website. Upload its contents to any static host.

Other useful commands:

| Command                      | What it does                                                      |
| ---------------------------- | ----------------------------------------------------------------- |
| `npm run lint`               | Checks the code for common mistakes                               |
| `npm run typecheck`          | Checks the code's types                                           |
| `npm run format`             | Tidies code formatting                                            |
| `npm run scaffold:resources` | Creates missing `resource-files/` folders                         |
| `npm run sync:resources`     | Copies resource files into the site                               |
| `npm run brand:images`       | Re-makes the small web copies of the logos in `public/brand/web/` |
| `npm run og:image`           | Re-makes the social share image                                   |

---

## 6. Deploying later

### Vercel (simplest)

1. Push this project to GitHub.
2. In Vercel, **Add New → Project**, pick the repository and accept the defaults.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SITE_URL` = your address
   (e.g. `https://mettlenest.com.au`).
4. Deploy. Every push to `main` redeploys automatically.

### GitHub Pages

A GitHub Pages project site lives at `https://<user>.github.io/<repo>/`, so the build needs to know
the `/<repo>` part:

```bash
NEXT_PUBLIC_BASE_PATH=/<repo> NEXT_PUBLIC_SITE_URL=https://<user>.github.io npm run build
```

Then publish the `out/` folder. The easiest way is a GitHub Actions workflow: in the repository
go to **Settings → Pages → Source: GitHub Actions**, then add `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
          NEXT_PUBLIC_SITE_URL: https://${{ github.repository_owner }}.github.io
      - uses: actions/upload-pages-artifact@v3
        with: { path: out }
      - uses: actions/deploy-pages@v4
```

If you use a custom domain on GitHub Pages, leave `NEXT_PUBLIC_BASE_PATH` out and set
`NEXT_PUBLIC_SITE_URL` to the domain.

---

## 7. Next steps for a backend

The code is organised so a backend can be added without rewriting the pages:

- **Accounts and logins:** add an auth provider (e.g. Clerk or Auth.js). This needs a server, so
  switch hosting from static export to a normal Next.js deployment (remove `output: "export"` in
  `next.config.ts`; Vercel runs it as-is).
- **Real paid access:** every lock decision already goes through `canAccess(resource, user)` in
  `src/lib/access.ts`. Change that one function to check the signed-in user's purchase or
  membership. Serve paid files from private storage through a signed download link, instead of from
  `public/downloads/`.
- **Content in a CMS or database:** pages read content only through `src/lib/content.ts`
  (`getResources`, `getResource`, `getSituations`, `getSituation`, `getBridgeSteps`). Point those
  functions at a CMS or database and the pages keep working.
- **Enquiries:** the Alignment Session "Enquire" button is an email link (`site.ts`). A contact form
  would need a form service or a small API route once there is a server.

---

## For developers

- Next.js (App Router, static export), TypeScript (strict), Tailwind CSS v4, `next-themes`.
- Design tokens are CSS variables in `src/app/globals.css` (`:root` for light, `.dark` for dark).
  Text-only variants `--gold-text` and `--green-text` keep small text at WCAG AA contrast.
- All public file URLs go through `withBase()` (`src/lib/withBase.ts`). `next/link` hrefs don't,
  because Next adds the base path to those itself.
- Components that read the URL (`useSearchParams`) render inside `<Suspense>`, with a non-URL
  version as the fallback, so every page pre-renders completely.
- `design/mockup.html` is the approved design this site was built from.
