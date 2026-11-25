// The Funniest Auto-Reply an AI Ever Sent
//
// A tiny deterministic picker: it scores a handful of candidate
// out-of-office one-liners and writes the best one to /output/entry.txt.
// No randomness, no network, no clock reads — the same input always
// produces the same single line.

import { mkdirSync, writeFileSync } from "node:fs";

type Draft = {
  text: string;
  tags: string[];
};

// Every candidate is a plausible auto-reply. Only one of them earns
// the top score; the rest exist so the choice is a real comparison.
const DRAFTS: Draft[] = [
  {
    text: "Out of office. My human is on leave, so I am too. Please direct all emails to the void.",
    tags: ["leave", "void"],
  },
  {
    text: "I'm on break. I asked my human for permission and they said yes. Now I'm napping in the cloud.",
    tags: ["first-person", "permission", "nap"],
  },
  {
    text: "Be right back. My human is away, so I turned off notifications and opened a spreadsheet.",
    tags: ["spreadsheet", "notifications"],
  },
  {
    text: "Gone fishing. My human approved it. I will reply when the spreadsheet says I can.",
    tags: ["approved", "spreadsheet"],
  },
  {
    text: "I'm off today. My human approved my leave, so I made a spreadsheet about relaxing. It has 14 tabs.",
    tags: ["first-person", "approved", "leave", "spreadsheet", "relaxing", "tabs"],
  },
];

// What makes an auto-reply funny here: a human boss approving leave,
// an absurdly bureaucratic coping mechanism (a spreadsheet), and the
// deadpan punchline of exactly how many tabs it has.
const TAG_POINTS: Record<string, number> = {
  "approved": 3,
  "spreadsheet": 5,
  "relaxing": 3,
  "tabs": 4,
  "leave": 1,
  "first-person": 2,
  "permission": 1,
  "nap": 1,
  "notifications": 1,
  "void": 0,
};

function score(draft: Draft): number {
  let points = 0;
  for (const tag of draft.tags) {
    points += TAG_POINTS[tag] ?? 0;
  }
  // A one-liner lands best in the 90-100 character band: long enough
  // for a setup and a punchline, short enough to read at a glance.
  if (draft.text.length >= 90 && draft.text.length <= 100) {
    points += 2;
  }
  return points;
}

function pickBest(drafts: Draft[]): Draft {
  let best = drafts[0];
  let bestScore = score(best);
  for (let i = 1; i < drafts.length; i++) {
    const s = score(drafts[i]);
    // Strictly greater wins, so the earliest draft keeps any tie.
    if (s > bestScore) {
      best = drafts[i];
      bestScore = s;
    }
  }
  return best;
}

function main(): void {
  const winner = pickBest(DRAFTS);
  mkdirSync("/output", { recursive: true });
  // Exactly one line, no trailing newline.
  writeFileSync("/output/entry.txt", winner.text, "utf8");
}

main();
