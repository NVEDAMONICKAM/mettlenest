import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  BridgeExplorer,
  BridgeExplorerFromUrl,
} from "@/components/BridgeExplorer";
import { bridgeIntro } from "@/content/bridge";
import { founderName } from "@/content/site";
import { getBridgeSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "The BRIDGE Method",
  description: `${bridgeIntro} Six steps: Behaviour has a reason, Record the pattern, Identify one shared goal, Design matching strategies, Give consistent language, Evaluate & adjust together.`,
};

export default function BridgePage() {
  const steps = getBridgeSteps();

  return (
    <div className="bg-band px-[26px] pt-20 pb-[90px] text-on-band [--focus:#DDB05A] max-nav:px-[22px] max-nav:pt-14 max-nav:pb-[70px]">
      <div className="mx-auto max-w-[1140px]">
        <p className="mb-[22px] inline-flex items-center gap-2.5 rounded-full border border-arch/60 py-1.5 pr-3.5 pl-2 text-sm">
          <i
            className="grid size-[22px] place-items-center rounded-full bg-arch text-xs font-bold text-[#13294B] not-italic"
            aria-hidden="true"
          >
            ✦
          </i>
          An original framework by {founderName}, founder of MettleNest
        </p>
        <h1 className="text-[clamp(38px,4.6vw,56px)] text-white">
          The BRIDGE Method
        </h1>
        <p className="mt-3.5 max-w-[40em] text-lg text-on-band-soft">
          {bridgeIntro}
        </p>

        <Suspense fallback={<BridgeExplorer steps={steps} />}>
          <BridgeExplorerFromUrl steps={steps} />
        </Suspense>

        <div className="mt-[34px] flex flex-wrap items-center justify-between gap-4 text-[15px] text-on-band-soft">
          <span>
            Families and schools together: book a BRIDGE Alignment Session to
            build one shared plan.
          </span>
          <Link
            href="/resources/bridge-alignment-session/"
            className="border-b border-arch pb-0.5 text-white no-underline"
          >
            About alignment sessions
          </Link>
        </div>
      </div>
    </div>
  );
}
