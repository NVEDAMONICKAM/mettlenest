import Link from "next/link";
import { buttonClass } from "@/components/SearchBox";

export default function NotFound() {
  return (
    <div className="wrap pt-20 pb-[110px] text-center">
      <p className="mb-3 text-[15px] font-bold tracking-[0.04em] text-gold-text">
        Page not found
      </p>
      <h1 className="mb-4 text-[clamp(34px,4vw,48px)]">
        We couldn&apos;t find that page
      </h1>
      <p className="mx-auto mb-8 max-w-[34em] text-soft">
        It may have moved, or the link may be mistyped. Try Quick links to find
        help for what&apos;s happening right now.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/quick-links/" className={buttonClass}>
          Quick links
        </Link>
        <Link
          href="/"
          className="inline-block rounded-[10px] border border-line px-[18px] py-2.5 text-[15px] leading-normal font-bold text-ink no-underline hover:border-navy"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
