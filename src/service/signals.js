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
    .map((entry) =>
      entry.type === "abandoned" ? `stepped away from ${entry.activityType || "an activity"}` : entry.feeling || entry.type
    )
    .filter(Boolean)
    .join(", ");
}
