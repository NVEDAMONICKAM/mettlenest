import Link from "next/link";
import { withBase } from "@/lib/withBase";
import { TabNav } from "./TabNav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg">
      <div className="wrap flex h-[76px] items-center gap-3.5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3.5 rounded-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
          <img
            src={withBase("/brand/web/emblem-96.webp")}
            alt=""
            width={46}
            height={46}
            className="size-[46px] rounded-full"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/brand/web/name-300.webp")}
            alt="MettleNest home"
            width={149}
            height={30}
            className="h-[30px] w-auto dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/brand/web/name-dark-300.webp")}
            loading="lazy" // hidden in light mode, so don't download it up front
            alt="MettleNest home"
            width={149}
            height={30}
            className="hidden h-[30px] w-auto dark:block"
          />
        </Link>
        <TabNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
