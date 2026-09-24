import { EggDot } from "./EggDot";

/** Decorative section break: a thin rule with the three eggs in the middle. */
export function EggDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex max-w-[280px] items-center gap-4 ${className}`}
    >
      <span className="h-px flex-1 bg-line" />
      <span className="flex items-end gap-1.5">
        <EggDot egg="understand" size={9} />
        <EggDot egg="connect" size={9} />
        <EggDot egg="grow" size={9} />
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
