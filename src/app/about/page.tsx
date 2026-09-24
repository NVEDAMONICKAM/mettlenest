import type { Metadata } from "next";
import { EggDot } from "@/components/EggDot";
import { FounderProfile } from "@/components/FounderProfile";
import {
  aboutLead,
  beliefs,
  definitions,
  entryPoints,
  whyParagraphs,
} from "@/content/about";
import { withBase } from "@/lib/withBase";

export const metadata: Metadata = {
  title: "About us",
  description: aboutLead,
};

const borderColour = {
  blue: "var(--blue)",
  green: "var(--green)",
  gold: "var(--gold)",
};

export default function AboutPage() {
  return (
    <div className="wrap pt-14 pb-[90px]">
      <div className="grid grid-cols-[1fr_340px] gap-[70px] max-nav:grid-cols-1 max-nav:gap-10">
        <div>
          <h1 className="mb-[22px] text-[clamp(34px,4vw,48px)]">About us</h1>
          <p className="mb-[30px] text-[21px] leading-normal">{aboutLead}</p>

          <h2 className="mt-10 mb-3 text-[26px]">Why MettleNest exists</h2>
          {whyParagraphs.map((p) => (
            <p key={p.text} className="mb-3.5">
              {p.strong ? <strong>{p.text}</strong> : p.text}
            </p>
          ))}

          <FounderProfile />

          <h2 className="mt-10 mb-3 text-[26px]">
            Two entry points, one system
          </h2>
          <div className="mt-[18px] grid grid-cols-3 gap-4 max-nav:grid-cols-1">
            {entryPoints.map((e) => (
              <div
                key={e.title}
                className="rounded-[18px] border-t-[5px] bg-panel px-[22px] pt-[22px] pb-6"
                style={{ borderTopColor: borderColour[e.colour] }}
              >
                <h3 className="mb-1.5 text-[21px]">{e.title}</h3>
                <p className="text-[15px] text-soft">{e.text}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 mb-3 text-[26px]">Our approach</h2>
          <ul className="my-[17px]">
            {beliefs.map((b) => (
              <li
                key={b.strong}
                className="relative border-b border-line py-3 pl-[30px]"
              >
                <EggDot
                  egg={b.egg}
                  size={12}
                  className="absolute top-[19px] left-1"
                />
                <strong>{b.strong}</strong> {b.rest}
              </li>
            ))}
          </ul>
        </div>

        <aside className="sticky top-[110px] self-start max-nav:static max-nav:max-w-[260px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
          <img
            src={withBase("/brand/web/sign-logo-680.webp")}
            alt="MettleNest sign logo: a bluebird beside a nest holding three eggs"
            width={340}
            height={340}
            className="h-auto w-full rounded-full"
          />
          <dl className="mt-[31px]">
            {definitions.map((d) => (
              <div key={d.term}>
                <dt className="font-serif text-[22px] text-navy">{d.term}</dt>
                <dd className="mt-0.5 mb-4 text-[15.5px] text-soft">
                  {d.text}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}
