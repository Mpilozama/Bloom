// Deterministic, local, explainable signal-confidence check.
//
// This intentionally does NOT go through the AI layer. Deciding whether a
// check-in should be taken at face value is a safety-relevant judgment —
// the exact kind of decision the README says shouldn't be handed to a model
// or presented as fact. Keeping it as plain, readable logic means anyone
// (a user, a judge, a future contributor) can see exactly why Bloom
// hesitated, instead of trusting a black box.
//
// This never diagnoses and never tells someone they're wrong about their
// own feelings. It only ever says: these signals don't fully agree — and
// then stays gentle about it.

// Ordinal severity for the four preset feelings, so Bloom can read a real
// trend over time rather than just matching one word to another.
const PRESET_SEVERITY = {
  "pretty okay": 0,
  "a bit off": 1,
  "running low": 2,
  "honestly... rough": 3,
};


const LOW_SIGNAL_WORDS = [
  "running low", "rough", "tired", "exhausted", "empty", "numb",
  "overwhelmed", "anxious", "off", "low", "drained", "stressed",
];

const OKAY_PATTERN = /\b(okay|ok|fine|good|great)\b/i;
const NOT_OKAY_PATTERN = /\bnot\s+(okay|ok|fine|good|great)\b/i;

function severityOf(feeling = "") {
  const key = feeling.trim().toLowerCase();
  if (key in PRESET_SEVERITY) return PRESET_SEVERITY[key];
  const hits = LOW_SIGNAL_WORDS.filter((word) => key.includes(word)).length;
  return Math.min(hits, 3);
}

function saysOkay(feeling = "") {
  return OKAY_PATTERN.test(feeling) && !NOT_OKAY_PATTERN.test(feeling) && severityOf(feeling) === 0;
}

/**
 * Looks across more than one kind of signal before deciding whether to take
 * a check-in fully at face value:
 *   - the trend in recent feeling severity (not just keyword matching)
 *   - how many recent activities were opened and then left unfinished
 *
 * Mirrors the README's own worked example: someone can say "I'm fine" while
 * everything else points somewhere else. Bloom's job isn't to pick a side —
 * it's to notice the disagreement and say so, plainly and kindly.
 */
export function assessSignal(history, currentFeeling = "") {
  const recentCheckins = history.filter((entry) => entry.type === "checkin").slice(-4);
  const recentAbandoned = history.filter((entry) => entry.type === "abandoned").slice(-4);

  const roughCount = recentCheckins.filter((entry) => severityOf(entry.feeling) >= 2).length;
  const abandonedCount = recentAbandoned.length;

  if (saysOkay(currentFeeling) && (roughCount >= 2 || abandonedCount >= 2)) {
    return {
      uncertain: true,
      note:
        "The available signals don't fully agree. You said you're doing okay, and that might be exactly right — " +
        "I'm just not going to lean on one moment when a few others painted a different picture. Both can be true.",
    };
  }

  return { uncertain: false, note: "" };
}

/** A short, human-readable summary of recent signals, for the AI prompt. */
export function summarizeHistory(history) {
  const recent = history.slice(-4);
  if (!recent.length) return "";
  return recent
    .map((entry) => {
      if (entry.type === "abandoned") return `stepped away from ${entry.activityType || "an activity"}`;
      if (entry.type === "write" && entry.content) return `wrote: "${entry.content.slice(0, 80)}"`;
      if (entry.type === "notice" && entry.content) return `grounded with: ${entry.content}`;
      if (entry.type === "reach-out" && entry.content) return `planned to reach out (${entry.content.slice(0, 60)})`;
      return entry.feeling || entry.type;
    })
    .filter(Boolean)
    .join(", ");
}

const CONNECTION_WORDS = [
  "isolated", "isolation", "lonely", "loneliness", "alone", "disconnected",
  "no one to talk to", "no friends", "haven't talked to anyone", "cut off",
];

/** Local, deterministic — same philosophy as assessSignal: this is a
 * safety/routing judgment, not something to hand to the model. */
export function needsConnection(text = "") {
  const lower = text.toLowerCase();
  return CONNECTION_WORDS.some((word) => lower.includes(word));
}


/**
 * REFLECT, made real: looks across recent history for a pattern worth
 * surfacing — never a verdict, never phrased as certainty. Deliberately
 * local and deterministic, same reasoning as assessSignal: noticing a
 * pattern in someone's data is a judgment call, not something to hand
 * to a model and hope it stays calibrated.
 *
 * Returns null when there isn't enough data or nothing stands out —
 * silence is a valid, correct output here, not a fallback to avoid.
 */
export function reflectOnPatterns(history) {
  if (history.length < 3) return null;

  const recent = history.slice(-8);
  const completed = recent.filter((e) => e.type !== "abandoned" && e.type !== "checkin");
  const abandoned = recent.filter((e) => e.type === "abandoned");
  const reachOuts = recent.filter((e) => e.type === "reach-out");

  if (reachOuts.length >= 2) {
    return `You've reached out to people ${reachOuts.length} times recently. That's not something I can take credit for — that's you, out in your actual life.`;
  }

  const counts = completed.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1;
    return acc;
  }, {});
  const favorite = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  if (favorite && favorite[1] >= 3) {
    const labels = {
      breath: "a slow breath",
      notice: "grounding yourself",
      write: "writing things out",
    };
    return `You've reached for ${labels[favorite[0]] || favorite[0]} more than anything else lately. Worth noticing, not worth reading too much into.`;
  }

  if (abandoned.length >= 3 && completed.length === 0) {
    return "You've opened a few things lately and stepped away before finishing. That's completely fine — sometimes starting is the whole point.";
  }

  return null;
}

/**
 * Ranks activity types by what's actually helped this person before —
 * completed more than abandoned — so suggestions adapt to the individual
 * instead of a fixed order. Never hides an option, only reorders; every
 * choice is still visible and pickable regardless of rank.
 */
export function rankActivities(history, types) {
  const scores = types.reduce((acc, type) => ({ ...acc, [type]: 0 }), {});

  history.forEach((entry) => {
    if (entry.type === "abandoned" && scores[entry.activityType] !== undefined) {
      scores[entry.activityType] -= 1;
    } else if (scores[entry.type] !== undefined) {
      scores[entry.type] += 1;
    }
  });

  return [...types].sort((a, b) => scores[b] - scores[a]);
}
