/** Three-line Fraunces headline on Home. */
export function Headline() {
  return (
    <p className="mx-auto max-w-[13em] font-display text-[clamp(36px,6vw,74px)] leading-[1.1] font-semibold tracking-[-0.01em] text-navy">
      <span className="block">Understand the behaviour,</span>
      <span className="block font-normal text-blue italic">
        Connect with the child,
      </span>
      <span className="block text-gold-text">Watch them grow.</span>
    </p>
  );
}
