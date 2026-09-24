import type { Egg } from "./types";

export const aboutLead =
  "MettleNest's BRIDGE Method gives parents and teachers a shared language for understanding and responding to behaviour, so a child gets the same steady support at home and at school.";

/** Paragraphs of "Why MettleNest exists". `strong` paragraphs render bold. */
export const whyParagraphs: { text: string; strong?: boolean }[] = [
  {
    text: 'Behaviour support has always been a divided experience. Parents get parenting advice. Teachers get classroom management training. Meanwhile, the child at the centre hears two different sets of instructions, two different reactions to the same meltdown, and two different definitions of "doing well."',
  },
  { text: "MettleNest exists to close that gap.", strong: true },
  {
    text: "We believe behaviour is communication, not a problem to be managed away, and that the adults around a child do their best work when they're working from the same playbook. Not identical settings. Not identical rules. The same understanding of why the behaviour is happening, and the same approach to responding to it.",
  },
  {
    text: "MettleNest exists to make behaviour support practical, respectful and within reach, so parents and educators can meet hard moments with confidence, connection and a clearer path forward.",
  },
];

export const definitions = [
  {
    term: "Mettle",
    text: "The courage and resilience it takes to stay steady in a hard moment: a meltdown, a classroom disruption, a routine that keeps falling apart.",
  },
  {
    term: "Nest",
    text: "The safe, supportive place where people can learn and grow, not just kids, but the adults figuring out how to support them.",
  },
];

export const entryPoints: {
  title: string;
  text: string;
  colour: "blue" | "green" | "gold";
}[] = [
  {
    title: "For parents",
    text: "Coaching for meltdowns, routines, sibling conflict, homework battles and individualised behaviour plans.",
    colour: "blue",
  },
  {
    title: "For teachers",
    text: "Classroom strategies, de-escalation scripts, observation tools and a clearer way to communicate with families.",
    colour: "green",
  },
  {
    title: "Together",
    text: "BRIDGE Alignment Sessions: one goal, one set of strategies, one shared language.",
    colour: "gold",
  },
];

export const beliefs: { strong: string; rest: string; egg: Egg }[] = [
  {
    strong: "Behaviour is communication.",
    rest: "We start by understanding it, not suppressing it.",
    egg: "understand",
  },
  {
    strong: "Support should be humane and practical.",
    rest: "No jargon-heavy plans that only work on paper.",
    egg: "connect",
  },
  {
    strong: "Teachers are part of the support network,",
    rest: "not a separate audience.",
    egg: "grow",
  },
];

/** "Meet the founder" on the About page. The name comes from founderName in site.ts. */
export const founderRole =
  "Founder of MettleNest · Creator of the BRIDGE Method";

// TODO: add a short bio (one paragraph per string). The section works without it.
export const founderBio: string[] = [];
