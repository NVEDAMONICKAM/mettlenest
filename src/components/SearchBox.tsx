import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  /** Optional trailing element, e.g. a submit button. */
  children?: ReactNode;
  className?: string;
};

/** Panel-coloured search field from the mockup. Works in server and client components. */
export function SearchBox({ children, className = "", ...input }: Props) {
  return (
    <div
      className={`flex gap-2 rounded-[14px] border border-line bg-panel p-1.5 focus-within:border-navy ${className}`}
    >
      <input
        type="search"
        autoComplete="off"
        {...input}
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[17px] leading-normal text-ink placeholder:text-soft focus:outline-none [&::-webkit-search-cancel-button]:cursor-pointer"
      />
      {children}
    </div>
  );
}

export const buttonClass =
  "inline-block cursor-pointer leading-normal whitespace-nowrap rounded-[10px] border-0 bg-accent px-[18px] py-2.5 text-[15px] font-bold text-on-accent no-underline";
