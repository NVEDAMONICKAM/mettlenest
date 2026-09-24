/**
 * All lock and access decisions go through here. Components never read locks.json directly,
 * so swapping to real auth or paid access later only changes this file.
 */
import locks from "@/content/locks.json";
import type { Resource } from "@/content/types";

export type LocksFile = { lockedMessage: string; locked: string[] };

/** Placeholder for a future signed-in user (auth / paid access). */
export type User = { id: string };

const lockedSet = new Set<string>((locks as LocksFile).locked);

export function isLocked(slug: string): boolean {
  return lockedSet.has(slug);
}

/**
 * Whether this visitor can open the resource's files. For now: anything not locked.
 * Later: check `user`'s purchases or membership here.
 */
export function canAccess(
  resource: Pick<Resource, "slug">,
  user?: User,
): boolean {
  void user;
  return !isLocked(resource.slug);
}

export function getLockedMessage(): string {
  return (locks as LocksFile).lockedMessage;
}

export function getLockedSlugs(): string[] {
  return [...lockedSet];
}
