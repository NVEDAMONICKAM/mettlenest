import type { Egg } from "@/content/types";

export const eggColour: Record<Egg, string> = {
  understand: "var(--green)",
  connect: "var(--blue)",
  grow: "var(--gold)",
};

type Props = {
  egg: Egg;
  /** Width in px; height follows the egg's 11:14 proportion. */
  size?: number;
  className?: string;
};

export function EggDot({ egg, size = 11, className = "" }: Props) {
  return (
    <i
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: Math.round((size * 14) / 11),
        borderRadius: "50% / 60% 60% 40% 40%",
        background: eggColour[egg],
      }}
    />
  );
}
