import { enquiryMailto } from "./site";
import type { Egg, Resource } from "./types";

export const eggs: Record<Egg, { name: string; line: string; folder: string }> =
  {
    understand: {
      name: "Understand",
      line: "The why behind the behaviour",
      folder: "1-understand",
    },
    connect: {
      name: "Connect",
      line: "The shape of an ordinary day",
      folder: "2-connect",
    },
    grow: { name: "Grow", line: "The next step forward", folder: "3-grow" },
  };

/** Folder name for each format inside resource-files/<egg>/. Add a line here when you add a new format. */
export const formatFolders: Record<string, string> = {
  "Research guide": "research-guides",
  "Family guide": "family-guides",
  "Strategy card": "strategy-cards",
  Tool: "tools",
  "Educator toolkit": "educator-toolkits",
  Routine: "routines",
  Session: "sessions",
  "Video course": "video-courses",
  Lesson: "lessons",
  Journal: "journals",
  Training: "training",
};

export const resources: Resource[] = [
  // UNDERSTAND
  {
    slug: "understanding-sensory-regulation-capacity",
    title: "Understanding sensory regulation capacity",
    egg: "understand",
    format: "Research guide",
    audience: ["families", "educators"],
    description:
      "Why some children hit overload sooner, and what that looks like at home and in class.",
  },
  {
    slug: "understanding-school-avoidance",
    title: "Understanding school avoidance",
    egg: "understand",
    format: "Research guide",
    audience: ["families", "educators"],
    description:
      "What sits underneath a child who can't get through the school gate.",
  },
  {
    slug: "supporting-early-psychosis",
    title: "Supporting early psychosis",
    egg: "understand",
    format: "Family guide",
    audience: ["families"],
    description:
      "Noticing changes in thinking or perception, and where to go for help.",
  },
  {
    slug: "supporting-selective-mutism",
    title: "Supporting selective mutism",
    egg: "understand",
    format: "Family guide",
    audience: ["families", "educators"],
    description:
      "Taking the pressure off speaking so confidence can come back.",
  },
  {
    slug: "space-breathing-and-grounding",
    title: "Space, breathing and grounding",
    egg: "understand",
    format: "Strategy card",
    audience: ["families", "educators"],
    description: "A printable card of calm-down steps for the hardest minutes.",
  },
  {
    slug: "bridge-pattern-tracker",
    title: "BRIDGE pattern tracker",
    egg: "understand",
    format: "Tool",
    audience: ["families", "educators"],
    description:
      "One shared record for home and school, same format, same language.",
    isBridge: true,
  },
  {
    slug: "behaviour-observation-tool",
    title: "Behaviour observation tool",
    egg: "understand",
    format: "Educator toolkit",
    audience: ["educators"],
    description: "A quick way to note what happened before, during and after.",
  },

  // CONNECT
  {
    slug: "early-years-routine",
    title: "Early years routine",
    egg: "connect",
    format: "Routine",
    audience: ["families"],
    meta: "Ages 0–5",
    description:
      "Predictable anchors for little ones: wake, meals, play, sleep.",
  },
  {
    slug: "primary-routine",
    title: "Primary routine",
    egg: "connect",
    format: "Routine",
    audience: ["families"],
    meta: "Ages 5–12",
    description:
      "Mornings, pickup and bedtime that run on rails, not reminders.",
  },
  {
    slug: "tweens-and-teens-routine",
    title: "Tweens & teens routine",
    egg: "connect",
    format: "Routine",
    audience: ["families"],
    meta: "Ages 12–18",
    description:
      "More independence, fewer battles, and time that still feels shared.",
  },
  {
    slug: "whole-family-routine",
    title: "Whole family routine",
    egg: "connect",
    format: "Routine",
    audience: ["families"],
    meta: "Everyone under one roof",
    description: "Fitting different ages and needs into one household rhythm.",
  },
  {
    slug: "the-school-day-rhythm",
    title: "The school day rhythm",
    egg: "connect",
    format: "Routine",
    audience: ["families", "educators"],
    meta: "Morning to home-time",
    description:
      "Smoothing the handovers: drop-off, transitions, pickup and homework.",
  },
  {
    slug: "support-while-you-wait",
    title: "Support while you wait",
    egg: "connect",
    format: "Family guide",
    audience: ["families"],
    meta: "For families on a waitlist",
    description:
      "What you can do now while an assessment or appointment is pending.",
  },
  {
    slug: "de-escalation-scripts",
    title: "De-escalation scripts",
    egg: "connect",
    format: "Educator toolkit",
    audience: ["educators", "families"],
    description:
      "Words that lower the temperature, the same at home and at school.",
  },
  {
    slug: "iep-meeting-guide",
    title: "IEP meeting guide",
    egg: "connect",
    format: "Educator toolkit",
    audience: ["educators", "families"],
    description:
      "Preparing for, running and following up a plan meeting together.",
  },
  {
    slug: "bridge-alignment-session",
    title: "BRIDGE Alignment Session",
    egg: "connect",
    format: "Session",
    audience: ["families", "educators"],
    description:
      "Family and teacher in one room (or call) to build one shared plan.",
    isBridge: true,
    action: { label: "Enquire", href: enquiryMailto },
  },

  // GROW
  {
    slug: "surviving-the-meltdown-module-1",
    title:
      "Surviving the Meltdown, Module 1: What is this meltdown telling me?",
    shortTitle: "Meltdown 1: What is it telling me?",
    egg: "grow",
    format: "Video course",
    audience: ["families", "educators"],
    description: "Reading the meltdown as communication.",
  },
  {
    slug: "surviving-the-meltdown-module-2",
    title: "Surviving the Meltdown, Module 2: Building the toolkit",
    shortTitle: "Meltdown 2: Building the toolkit",
    egg: "grow",
    format: "Video course",
    audience: ["families", "educators"],
    description: "Strategies for before, during and after.",
  },
  {
    slug: "surviving-the-meltdown-module-3",
    title: "Surviving the Meltdown, Module 3: What to say",
    shortTitle: "Meltdown 3: What to say",
    egg: "grow",
    format: "Video course",
    audience: ["families", "educators"],
    description: "Scripts that keep you steady and the child safe.",
  },
  {
    slug: "read-the-pattern",
    title: "Read the pattern",
    egg: "grow",
    format: "Lesson",
    audience: ["families", "educators"],
    description: "Spotting what repeats before behaviour escalates.",
  },
  {
    slug: "the-favouritism-trap",
    title: "The favouritism trap",
    egg: "grow",
    format: "Lesson",
    audience: ["families"],
    description: "Sibling conflict and the fairness question.",
  },
  {
    slug: "show-up-on-purpose",
    title: "Show up on purpose",
    egg: "grow",
    format: "Lesson",
    audience: ["families", "educators"],
    description: "Small, planned moments of connection that add up.",
  },
  {
    slug: "playing-the-long-game",
    title: "Playing the long game",
    egg: "grow",
    format: "Lesson",
    audience: ["families", "educators"],
    description: "Measuring progress in months, not days.",
  },
  {
    slug: "my-brain-companion",
    title: "My Brain Companion",
    egg: "grow",
    format: "Journal",
    audience: ["families"],
    meta: "31-day guided journal · PDF or print",
    description:
      "A month of short prompts for a child and adult to work through together.",
  },
  {
    slug: "classroom-behaviour-plans",
    title: "Classroom behaviour plans",
    egg: "grow",
    format: "Educator toolkit",
    audience: ["educators"],
    description:
      "Plans built on the BRIDGE Method that hold up in a real classroom.",
  },
  {
    slug: "whole-school-training",
    title: "Whole-school training",
    egg: "grow",
    format: "Training",
    audience: ["educators"],
    description:
      "Staff PD so every adult in the building speaks the same language.",
  },
];
