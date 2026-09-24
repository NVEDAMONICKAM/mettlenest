export type Egg = "understand" | "connect" | "grow";
export type Audience = "families" | "educators";

export type Resource = {
  slug: string;
  title: string;
  shortTitle?: string;
  egg: Egg;
  format: string;
  audience: Audience[];
  meta?: string;
  description: string; // TODO: author to confirm
  videoUrl?: string;
  isBridge?: boolean;
  /** Optional call to action that replaces Download/Watch, e.g. the Alignment Session's "Enquire". */
  action?: { label: string; href: string };
};

export type Situation = {
  slug: string;
  label: string;
  who: "home" | "school" | "both";
  resources: string[];
};

export type BridgeStep = {
  letter: string;
  title: string;
  description: string;
};
