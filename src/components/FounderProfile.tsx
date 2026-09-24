import fs from "node:fs";
import path from "node:path";
import { founderBio, founderRole } from "@/content/about";
import { founderName } from "@/content/site";
import { withBase } from "@/lib/withBase";

/** Web copy made by scripts/sync-photos.ts from photos/founder.jpg. */
const PHOTO = "/images/founder.webp";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

/** "Meet the founder" panel. Shows initials until a photo is added to photos/. Server-only. */
export function FounderProfile() {
  const hasPhoto = fs.existsSync(path.join(process.cwd(), "public", PHOTO));
  const frame = "aspect-[4/5] w-full rounded-2xl max-nav:max-w-[220px]";

  return (
    <section aria-labelledby="founder-heading">
      <h2 id="founder-heading" className="mt-10 mb-4 text-[26px]">
        Meet the founder
      </h2>
      <div className="grid grid-cols-[200px_1fr] items-start gap-7 rounded-[22px] bg-panel p-6 max-nav:grid-cols-1 max-nav:gap-5">
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser
          <img
            src={withBase(PHOTO)}
            alt={`Portrait of ${founderName}`}
            width={400}
            height={500}
            loading="lazy"
            className={`${frame} object-cover`}
          />
        ) : (
          <div
            aria-hidden="true"
            className={`${frame} grid place-items-center border border-line bg-bg font-serif text-[56px] text-navy`}
          >
            {initials(founderName)}
          </div>
        )}
        <div>
          <p className="font-serif text-2xl leading-tight text-navy">
            {founderName}
          </p>
          <p className="mt-1.5 mb-4 text-[14.5px] font-bold text-gold-text">
            <span aria-hidden="true">✦ </span>
            {founderRole}
          </p>
          {founderBio.map((p) => (
            <p key={p} className="mb-3 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
