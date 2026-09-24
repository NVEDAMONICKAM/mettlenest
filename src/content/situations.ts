import type { Situation } from "./types";

export const situations: Situation[] = [
  {
    slug: "meltdowns-and-big-emotions",
    label: "Meltdowns and big emotions",
    who: "both",
    resources: [
      "surviving-the-meltdown-module-1",
      "surviving-the-meltdown-module-2",
      "surviving-the-meltdown-module-3",
      "space-breathing-and-grounding",
      "understanding-sensory-regulation-capacity",
    ],
  },
  {
    slug: "wont-go-to-school",
    label: "Won't go to school",
    who: "both",
    resources: [
      "understanding-school-avoidance",
      "the-school-day-rhythm",
      "bridge-alignment-session",
    ],
  },
  {
    slug: "mornings-keep-falling-apart",
    label: "Mornings keep falling apart",
    who: "home",
    resources: [
      "early-years-routine",
      "primary-routine",
      "tweens-and-teens-routine",
      "whole-family-routine",
    ],
  },
  {
    slug: "bedtime-battles",
    label: "Bedtime battles",
    who: "home",
    resources: [
      "early-years-routine",
      "primary-routine",
      "whole-family-routine",
    ],
  },
  {
    slug: "sibling-fights",
    label: "Sibling fights",
    who: "home",
    resources: ["the-favouritism-trap", "read-the-pattern"],
  },
  {
    slug: "sensory-overload",
    label: "Sensory overload",
    who: "both",
    resources: [
      "understanding-sensory-regulation-capacity",
      "space-breathing-and-grounding",
    ],
  },
  {
    slug: "not-speaking-at-school",
    label: "Not speaking at school",
    who: "both",
    resources: ["supporting-selective-mutism", "the-school-day-rhythm"],
  },
  {
    slug: "homework-battles",
    label: "Homework battles",
    who: "home",
    resources: [
      "the-school-day-rhythm",
      "show-up-on-purpose",
      "read-the-pattern",
    ],
  },
  {
    slug: "disruption-in-the-classroom",
    label: "Disruption in the classroom",
    who: "school",
    resources: [
      "de-escalation-scripts",
      "behaviour-observation-tool",
      "read-the-pattern",
      "classroom-behaviour-plans",
    ],
  },
  {
    slug: "teen-pulling-away",
    label: "Teen pulling away",
    who: "home",
    resources: [
      "tweens-and-teens-routine",
      "show-up-on-purpose",
      "playing-the-long-game",
    ],
  },
  {
    slug: "waiting-for-an-assessment",
    label: "Waiting for an assessment",
    who: "home",
    resources: ["support-while-you-wait"],
  },
  {
    slug: "changes-in-thinking-or-perception",
    label: "Changes in thinking or perception",
    who: "both",
    resources: ["supporting-early-psychosis"],
  },
  {
    slug: "home-and-school-arent-aligned",
    label: "Home and school aren't aligned",
    who: "both",
    resources: [
      "bridge-alignment-session",
      "bridge-pattern-tracker",
      "iep-meeting-guide",
    ],
  },
  {
    slug: "planning-for-a-student",
    label: "Planning for a student",
    who: "school",
    resources: [
      "classroom-behaviour-plans",
      "behaviour-observation-tool",
      "iep-meeting-guide",
      "whole-school-training",
    ],
  },
];

/** Shown as chips under the Home search. */
export const popularSituations = [
  "meltdowns-and-big-emotions",
  "mornings-keep-falling-apart",
  "wont-go-to-school",
  "disruption-in-the-classroom",
];
