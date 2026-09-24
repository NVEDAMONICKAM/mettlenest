import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ResourceBrowser,
  ResourceBrowserFromUrl,
} from "@/components/ResourceBrowser";
import { getDownloads } from "@/lib/downloads";
import { EGGS, getEggInfo, getFormats, getResources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free guides, routines, toolkits, lessons and video courses for families and educators, organised by Understand, Connect and Grow.",
};

export default function ResourcesPage() {
  const resources = getResources();
  const props = {
    resources,
    eggs: EGGS.map((egg) => ({ egg, name: getEggInfo(egg).name })),
    formats: getFormats(),
    files: Object.fromEntries(
      resources.map((r) => [r.slug, getDownloads(r.slug)]),
    ),
    lockedSlugs: [] as string[],
  };

  return (
    <div className="wrap pt-14 pb-[90px]">
      <Suspense fallback={<ResourceBrowser {...props} />}>
        <ResourceBrowserFromUrl {...props} />
      </Suspense>
    </div>
  );
}
