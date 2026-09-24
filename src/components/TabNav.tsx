"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/content/site";

const trim = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

export function TabNav() {
  const pathname = trim(usePathname() ?? "/");

  return (
    <nav
      aria-label="Main"
      className="ml-auto flex gap-1 rounded-full bg-panel p-1 max-nav:fixed max-nav:right-3 max-nav:bottom-3 max-nav:left-3 max-nav:z-10 max-nav:m-0 max-nav:justify-between max-nav:overflow-x-auto max-nav:shadow-[0_6px_24px_rgba(0,0,0,.18)] max-[420px]:gap-0"
    >
      {navItems.map((item) => {
        const href = trim(item.href);
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className="flex items-center gap-1.5 rounded-full px-[15px] py-2 text-[14.5px] font-semibold whitespace-nowrap text-soft no-underline transition-colors hover:text-ink aria-[current=page]:bg-bg aria-[current=page]:text-ink aria-[current=page]:shadow-[0_1px_3px_rgba(0,0,0,.12)] max-nav:px-2.5 max-nav:text-[13px] max-[420px]:gap-1 max-[420px]:px-[7px] max-[420px]:text-[12.5px]"
          >
            {item.star && (
              <span className="text-xs text-gold" aria-hidden="true">
                ✦
              </span>
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
