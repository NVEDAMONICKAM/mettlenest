import { PadlockIcon } from "./PadlockIcon";

type Props = {
  message: string;
  /** "card": compact row near the bottom of a resource card. "block": centred stack over a larger area. */
  variant?: "card" | "block";
};

/** Greyed-out cover with a padlock, shown over locked resources. The parent must be `relative`. */
export function LockOverlay({ message, variant = "card" }: Props) {
  const circle = (
    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-bg text-ink shadow-sm">
      <PadlockIcon size={18} />
    </span>
  );
  if (variant === "block") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-panel/75 px-6 text-center">
        {circle}
        <p className="font-bold text-ink">Locked</p>
        <p className="max-w-[32em] text-[15px] text-soft">{message}</p>
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center rounded-[inherit] bg-panel/75 px-4 pb-4">
      <div className="flex items-center gap-3 rounded-full border border-line bg-bg py-1.5 pr-5 pl-1.5 text-left shadow-sm">
        {circle}
        <p className="leading-snug">
          <span className="block text-sm font-bold text-ink">Locked</span>
          <span className="block text-[13px] text-soft">{message}</span>
        </p>
      </div>
    </div>
  );
}
