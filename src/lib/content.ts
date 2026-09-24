/**
 * The only way pages read content. Swap these implementations for a CMS or database later
 * without touching the pages.
 */
import { bridgeSteps } from "@/content/bridge";
import { eggs, formatFolders, resources } from "@/content/resources";
import { popularSituations, situations } from "@/content/situations";
import type { BridgeStep, Egg, Resource, Situation } from "@/content/types";

export type {
  Audience,
  BridgeStep,
  Egg,
  Resource,
  Situation,
} from "@/content/types";

export const EGGS: Egg[] = ["understand", "connect", "grow"];

export function getResources(): Resource[] {
  return resources;
}

export function getResource(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export function getSituations(): Situation[] {
  return situations;
}

export function getSituation(slug: string): Situation | undefined {
  return situations.find((s) => s.slug === slug);
}

export function getPopularSituations(): Situation[] {
  return popularSituations
    .map((slug) => getSituation(slug))
    .filter((s): s is Situation => !!s);
}

/** Situations that list the given resource. */
export function getSituationsForResource(slug: string): Situation[] {
  return situations.filter((s) => s.resources.includes(slug));
}

export function getBridgeSteps(): BridgeStep[] {
  return bridgeSteps;
}

export function getEggInfo(egg: Egg) {
  return eggs[egg];
}

export function getFormats(): string[] {
  return [...new Set(resources.map((r) => r.format))];
}

export function getFormatFolder(format: string): string {
  return (
    formatFolders[format] ??
    format.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "s"
  );
}

export function audienceLabel(audience: Resource["audience"]): string {
  if (audience.length > 1) return "Families & educators";
  return audience[0] === "families" ? "Families" : "Educators";
}

export const whoLabel: Record<Situation["who"], string> = {
  home: "At home",
  school: "In the classroom",
  both: "Home and school",
};
