// Bloom's world doesn't pause when the tab is closed — but nothing can
// literally run with no browser process alive. Instead, the world is
// driven by real wall-clock time: it looks like whatever time it actually
// is, and it remembers what "happened" while you were away and tells you
// about it when you come back. That's what makes it feel continuous
// rather than something that only exists when you're clicking on it.
//
// This is deliberately kept separate from service/signals.js. Nothing
// here ever feeds the wellbeing check — it's flavor for the world, not
// a signal about the person.

const LAST_SEEN_KEY = "bloom_last_seen";

export function getTimeOfDay(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 18) return "day";
  if (hour >= 18 && hour < 21) return "dusk";
  return "night";
}

export const WORLD_SKY = {
  dawn: {
    sky: "from-rose-200 via-amber-100 to-lime-200",
    hills: "bg-[#a7c98f]",
    hillsFar: "bg-[#93bb7c]",
    orb: "🌅",
    stars: false,
  },
  day: {
    sky: "from-[#bfe3ee] via-[#dff0e6] to-[#a8d49d]",
    hills: "bg-[#9dcc9a]",
    hillsFar: "bg-[#8fbe86]",
    orb: "☀️",
    stars: false,
  },
  dusk: {
    sky: "from-orange-200 via-amber-100 to-emerald-200",
    hills: "bg-[#8fb37f]",
    hillsFar: "bg-[#7ba36c]",
    orb: "🌇",
    stars: false,
  },
  night: {
    sky: "from-indigo-900 via-slate-800 to-emerald-900",
    hills: "bg-[#2f4a38]",
    hillsFar: "bg-[#263c2d]",
    orb: "🌙",
    stars: true,
  },
};

const SHORT_AWAY_EVENTS = {
  dawn: ["Bloom was watching the mist settle over the grass."],
  day: ["Bloom was chasing a butterfly around the garden.", "Bloom was lying in a patch of sun."],
  dusk: ["Bloom was watching the sky turn orange."],
  night: ["Bloom was listening to the crickets.", "Bloom was watching for shooting stars."],
};

const LONG_AWAY_EVENTS = [
  "A few new flowers opened up while you were gone.",
  "Bloom napped through most of it — nothing urgent happened.",
  "A family of butterflies passed through the garden.",
  "The garden had a quiet stretch. Bloom didn't mind.",
];

/**
 * Reads how long it's been since the person was last here, returns a
 * short, honest "while you were away" note (or nothing, if it's only
 * been a few minutes), and updates the timestamp for next time.
 */
export function checkInOnTheWorld() {
  const now = Date.now();
  let lastSeen = null;

  try {
    const stored = localStorage.getItem(LAST_SEEN_KEY);
    lastSeen = stored ? Number(stored) : null;
    localStorage.setItem(LAST_SEEN_KEY, String(now));
  } catch {
    return null;
  }

  if (!lastSeen) return null;

  const elapsedMinutes = (now - lastSeen) / 60000;
  if (elapsedMinutes < 20) return null;

  const timeOfDay = getTimeOfDay();

  if (elapsedMinutes < 180) {
    const pool = SHORT_AWAY_EVENTS[timeOfDay];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return LONG_AWAY_EVENTS[Math.floor(Math.random() * LONG_AWAY_EVENTS.length)];
}
