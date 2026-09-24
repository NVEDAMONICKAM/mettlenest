import { PadlockIcon } from "./PadlockIcon";

export function AccessBadge({ locked }: { locked: boolean }) {
  if (locked) {
    return (
      <em className="inline-flex items-center gap-1 font-bold text-soft not-italic">
        <PadlockIcon size={12} />
        Locked
      </em>
    );
  }
  return <em className="font-bold text-green-text not-italic">Free</em>;
}
