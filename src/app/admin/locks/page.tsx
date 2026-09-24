import type { Metadata } from "next";
import { LockManager } from "@/components/LockManager";
import { getLockedMessage, getLockedSlugs } from "@/lib/access";
import { EGGS, getEggInfo, getResources } from "@/lib/content";
import { getFileCount } from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Lock manager",
  robots: { index: false, follow: false },
};

/** Owner helper. Not linked anywhere; excluded from the sitemap and robots. */
export default function LocksPage() {
  const resources = getResources();
  return (
    <div className="wrap pt-14 pb-[90px]">
      <LockManager
        groups={EGGS.map((egg) => ({
          egg,
          name: getEggInfo(egg).name,
          resources: resources.filter((r) => r.egg === egg),
        }))}
        fileCounts={Object.fromEntries(
          resources.map((r) => [r.slug, getFileCount(r.slug)]),
        )}
        initialLocked={getLockedSlugs()}
        initialMessage={getLockedMessage()}
      />
    </div>
  );
}
