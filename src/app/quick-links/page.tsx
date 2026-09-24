import type { Metadata } from "next";
import { Suspense } from "react";
import { QuickLinks, QuickLinksFromUrl } from "@/components/QuickLinks";
import type { TileSituation } from "@/components/SituationTile";
import { isLocked } from "@/lib/access";
import { getResource, getSituations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Quick links",
  description:
    "Find help for what's happening right now: meltdowns, mornings, school refusal, classroom disruption and more.",
};

export default function QuickLinksPage() {
  const situations: TileSituation[] = getSituations().map((s) => ({
    slug: s.slug,
    label: s.label,
    who: s.who,
    resources: s.resources.flatMap((slug) => {
      const r = getResource(slug);
      return r
        ? [
            {
              slug,
              title: r.shortTitle ?? r.title,
              format: r.format,
              egg: r.egg,
              locked: isLocked(slug),
            },
          ]
        : [];
    }),
  }));

  return (
    <div className="wrap pt-14 pb-[90px]">
      <Suspense fallback={<QuickLinks situations={situations} />}>
        <QuickLinksFromUrl situations={situations} />
      </Suspense>
    </div>
  );
}
