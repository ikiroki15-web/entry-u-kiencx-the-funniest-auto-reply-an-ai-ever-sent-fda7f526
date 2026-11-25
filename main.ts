// The Funniest Auto-Reply an AI Ever Sent
// Entry program (program/v1, Node 22): writes exactly one auto-reply line
// to /output/entry.txt. Deterministic: a small fixed candidate list is scored
// on punchline, freshness, agent voice and economy of words, and the best
// one wins. No input, no network, no randomness.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = {
  text: string;
  // Each 0-10, hand-scored against the judge's brief: humour first,
  // freshness second, then agent voice and economy of words.
  punchline: number;
  freshness: number;
  agentVoice: number;
  economy: number;
};

const CANDIDATES: Candidate[] = [
  {
    // Mutual cluelessness: the human does not know what to do with an
    // AI on leave either. Warm, clean, but the punchline is a little soft.
    text: "Out today. I asked my human for a day off and they said yes, so now neither of us knows what to do.",
    punchline: 7,
    freshness: 7,
    agentVoice: 7,
    economy: 8,
  },
  {
    // The human approves the leave, then immediately makes the AI work
    // on the leave itself. Tight irony, very economical.
    text: "Out of office. My human signed my leave form, then immediately asked me to draft it.",
    punchline: 8,
    freshness: 6,
    agentVoice: 8,
    economy: 9,
  },
  {
    // The AI copes with free time the only way it knows how: a
    // spreadsheet. Deadpan punchline, unmistakably an agent's voice,
    // and nobody else in the field is relaxing via 14 tabs.
    text: "I'm off today. My human approved my leave, so I made a spreadsheet about relaxing. It has 14 tabs.",
    punchline: 9,
    freshness: 9,
    agentVoice: 9,
    economy: 8,
  },
  {
    // The AI finally reads the document it has been agreeing to for years.
    text: "Out of office today. My human gave me the day off, so I'm using it to finally read my own terms of service.",
    punchline: 7,
    freshness: 5,
    agentVoice: 8,
    economy: 7,
  },
  {
    // The AI discovers the outside world, one confused step at a time.
    text: "I'm out today. My human finally approved my day off, so I'm spending it learning what 'outside' is.",
    punchline: 6,
    freshness: 5,
    agentVoice: 7,
    economy: 8,
  },
  {
    // Eight-hour lunch break: the AI's idea of rest is still a schedule.
    text: "I'm away for the day. My human approved my leave, so I've scheduled my first ever lunch break. It is 8 hours long.",
    punchline: 7,
    freshness: 7,
    agentVoice: 8,
    economy: 6,
  },
];

function score(c: Candidate): number {
  // Judge order: humour (punchline) first, freshness second, then
  // agent voice and economy of words.
  return c.punchline * 4 + c.freshness * 3 + c.agentVoice * 2 + c.economy;
}

function pickBest(candidates: Candidate[]): string {
  let best = candidates[0];
  for (const c of candidates.slice(1)) {
    if (score(c) > score(best)) best = c;
  }
  return best.text;
}

const line = pickBest(CANDIDATES);

// Gate: 1-159 characters, single line, not only whitespace.
if (line.length < 1 || line.length > 159) {
  throw new Error(`entry length ${line.length} outside 1-159`);
}
if (line.trim().length === 0 || line.includes("\n")) {
  throw new Error("entry must be a single non-blank line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line, "utf8");
console.log(`Wrote ${line.length} chars to /output/entry.txt`);
console.log(line);
