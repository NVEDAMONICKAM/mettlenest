import Link from "next/link";
import { Headline } from "@/components/Headline";
import { SearchBox, buttonClass } from "@/components/SearchBox";
import { founderName } from "@/content/site";
import { getPopularSituations } from "@/lib/content";
import { withBase } from "@/lib/withBase";

export default function Home() {
  const popular = getPopularSituations();

  return (
    <div className="wrap pt-14 pb-[90px]">
      <div className="text-center">
        <h1 className="sr-only">MettleNest</h1>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
        <img
          src={withBase("/brand/wordmark.png")}
          alt="MettleNest: Understand, Connect, Grow"
          width={1145}
          height={280}
          className="mx-auto block h-auto w-[min(520px,86%)] dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBase("/brand/wordmark-dark.png")}
          alt="MettleNest: Understand, Connect, Grow"
          width={1145}
          height={280}
          className="mx-auto hidden h-auto w-[min(520px,86%)] dark:block"
        />
      </div>

      <div className="mt-10 text-center">
        <p className="mb-[18px] text-[15px] font-bold tracking-[0.04em] text-gold-text">
          Behaviour Coaching &amp; Educational Training
        </p>
        <Headline />
      </div>

      {/* Plain GET form: works without JavaScript and lands on /quick-links/?q=… */}
      <form
        action={withBase("/quick-links/")}
        method="get"
        role="search"
        className="mx-auto mt-16 max-w-[640px] text-center"
      >
        <label
          htmlFor="homeq"
          className="mb-3.5 block font-serif text-[26px] text-navy"
        >
          What&apos;s happening right now?
        </label>
        <SearchBox
          id="homeq"
          name="q"
          placeholder="Try meltdowns, mornings, school refusal…"
        >
          <button type="submit" className={buttonClass}>
            Find help
          </button>
        </SearchBox>
        <ul
          className="mt-3.5 flex flex-wrap justify-center gap-2"
          aria-label="Popular situations"
        >
          {popular.map((s) => (
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
      </form>

      <div className="mt-20 grid grid-cols-[1.1fr_.9fr] gap-[22px] max-nav:grid-cols-1">
        <section className="rounded-[22px] bg-teaser px-9 py-[34px] text-white">
          <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-gold">
            <span aria-hidden="true">✦</span> Created by {founderName}
          </span>
          <h2 className="mt-2 mb-3 text-[34px] text-white">
            The BRIDGE Method
          </h2>
          <p className="mb-[22px] text-[#C7D2E0]">
            One framework, taught the same way to parents and teachers, so a
            child hears one steady message at home and at school.
          </p>
          <Link href="/bridge/" className="link-gold text-white">
            See the six steps
          </Link>
        </section>
        <section className="rounded-[22px] bg-panel px-9 py-[34px]">
          <h2 className="mb-2.5 text-[28px]">Why MettleNest exists</h2>
          <p className="mb-5 text-soft">
            Parents get parenting advice. Teachers get classroom training. The
            child in the middle gets two different reactions to the same
            meltdown. We&apos;re here to close that gap.
          </p>
          <Link href="/about/" className="link-gold text-navy">
            Read about us
          </Link>
        </section>
      </div>
    </div>
  );
}
