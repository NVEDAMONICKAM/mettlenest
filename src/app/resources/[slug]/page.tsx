import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccessBadge } from "@/components/AccessBadge";
import { DownloadList } from "@/components/DownloadList";
import { LockOverlay } from "@/components/LockOverlay";
import { EggDot } from "@/components/EggDot";
import { ResourceAction } from "@/components/ResourceAction";
import { canAccess, getLockedMessage } from "@/lib/access";
import { getDownloads } from "@/lib/downloads";
import {
  audienceLabel,
  getEggInfo,
  getResource,
  getResources,
  getSituationsForResource,
} from "@/lib/content";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const r = getResource((await params).slug);
  if (!r) return {};
  return { title: r.title, description: r.description };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const r = getResource((await params).slug);
  if (!r) notFound();

  const locked = !canAccess(r);
  const files = locked ? [] : getDownloads(r.slug);
  const situations = getSituationsForResource(r.slug);
  const egg = getEggInfo(r.egg);
  const hasOtherAction = !!(r.action || r.videoUrl);

  return (
    <div className="wrap pt-10 pb-[90px]">
      <nav aria-label="Breadcrumb" className="mb-8 text-[15px] text-soft">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/resources/"
              className="text-navy no-underline hover:underline"
            >
              Resources
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate">
            {r.shortTitle ?? r.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-[1fr_300px] gap-[70px] max-nav:grid-cols-1 max-nav:gap-10">
        <article>
          <p className="mb-4 flex items-center gap-2.5 text-[15px] font-bold text-soft">
            <EggDot egg={r.egg} size={18} />
            {egg.name}
            <span className="font-normal">· {egg.line}</span>
          </p>
          <h1 className="mb-4 text-[clamp(32px,4vw,44px)]">{r.title}</h1>
          <p className="mb-7 text-[21px] leading-normal">{r.description}</p>

          <dl className="mb-10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl bg-panel px-6 py-5 text-[15.5px]">
            <dt className="font-bold text-soft">Format</dt>
            <dd>{r.format}</dd>
            <dt className="font-bold text-soft">For</dt>
            <dd>{audienceLabel(r.audience)}</dd>
            {r.meta && (
              <>
                <dt className="font-bold text-soft">Details</dt>
                <dd>{r.meta}</dd>
              </>
            )}
            <dt className="font-bold text-soft">Access</dt>
            <dd className="text-[15.5px]">
              <AccessBadge locked={locked} />
            </dd>
          </dl>

          <section
            id="files"
            aria-labelledby="files-heading"
            className="scroll-mt-28"
          >
            <h2 id="files-heading" className="mb-4 text-[26px]">
              {hasOtherAction && !files.length && !locked
                ? "Get started"
                : "Downloads"}
            </h2>
            {locked ? (
              // Files aren't published while locked; this is a dimmed stand-in under the cover.
              <div className="relative min-h-[190px] rounded-2xl border border-line">
                <ul
                  aria-hidden="true"
                  className="divide-y divide-line opacity-45 grayscale"
                >
                  {[0, 1].map((i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 px-5 py-6"
                    >
                      <span className="h-3.5 w-48 rounded bg-line" />
                      <span className="h-9 w-24 rounded-[10px] bg-line" />
                    </li>
                  ))}
                </ul>
                <LockOverlay message={getLockedMessage()} variant="block" />
              </div>
            ) : (
              <>
                {hasOtherAction && (
                  <div className="mb-4">
                    <ResourceAction resource={r} files={[]} large />
                  </div>
                )}
                {(!hasOtherAction || files.length > 0) && (
                  <DownloadList files={files} title={r.title} />
                )}
              </>
            )}
          </section>
        </article>

        <aside className="self-start">
          {r.isBridge && (
            <Link
              href="/bridge/"
              className="mb-8 block rounded-[18px] bg-teaser px-6 py-5 text-white no-underline"
            >
              <span className="text-[13.5px] font-bold text-gold">
                ✦ Part of the BRIDGE Method
              </span>
              <span className="mt-1 block text-[15px] text-[#C7D2E0]">
                Built to be used the same way at home and at school.{" "}
                <span className="link-gold whitespace-nowrap text-white">
                  See the six steps
                </span>
              </span>
            </Link>
          )}
          {situations.length > 0 && (
            <>
              <h2 className="mb-3 text-[22px]">Related situations</h2>
              <ul className="flex flex-wrap gap-2">
                {situations.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/quick-links/?open=${s.slug}`}
                      className="inline-block rounded-full border border-line px-3 py-[5px] text-sm leading-normal text-soft no-underline transition-colors hover:border-ink hover:text-ink"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
