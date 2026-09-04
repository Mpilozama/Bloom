import { gardenStates } from "./gardenStates";

const FLOWER_POSITIONS = [
  { bottom: 6, left: 12 },
  { bottom: 11, left: 32 },
  { bottom: 7, left: 52 },
  { bottom: 12, left: 71 },
  { bottom: 6, left: 88 },
  { bottom: 14, left: 22 },
];

const BUTTERFLY_SPOTS = [
  { top: 22, left: 18 },
  { top: 34, left: 78 },
  { top: 16, left: 55 },
];

function Garden({ completed, completionCount = 0, timeOfDay = "day" }) {
  const stateIndex = Math.min(completionCount, 5);
  const state = gardenStates[stateIndex];
  const flowersToShow = Math.min(completionCount, FLOWER_POSITIONS.length);
  const isNight = timeOfDay === "night";
  const isDusk = timeOfDay === "dusk";

  return (
    <div
      className={`relative h-72 w-full overflow-hidden rounded-[2rem] bg-gradient-to-b transition-colors duration-1000 ${
        isNight ? "from-indigo-950 via-slate-800 to-emerald-950" : isDusk ? "from-orange-200 via-amber-100 to-lime-200" : state.background
      }`}
    >
      {isNight &&
        [...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-sparkle rounded-full bg-white"
            style={{ top: `${10 + ((i * 41) % 40)}%`, left: `${8 + ((i * 59) % 85)}%`, animationDelay: `${(i % 4) * 0.5}s` }}
          />
        ))}

      {/* Sun (or moon, if the world's real clock says it's night) with a
          warm glow that grows more radiant with the garden */}
      <div
        className={`absolute right-7 top-6 text-4xl transition-all duration-1000 ${completed ? "scale-110" : ""}`}
        style={{
          filter: isNight
            ? "drop-shadow(0 0 10px rgba(226,232,240,0.4))"
            : `drop-shadow(0 0 ${8 + stateIndex * 4}px rgba(207,154,58,${0.25 + stateIndex * 0.08}))`,
        }}
      >
        {isNight ? "🌙" : "☀️"}
      </div>

      {/* Clouds drift in as the garden matures */}
      {stateIndex >= 1 && (
        <div className="absolute left-5 top-5 text-2xl opacity-70 animate-[drift_9s_ease-in-out_infinite]">☁️</div>
      )}
      {stateIndex >= 3 && (
        <div className="absolute left-2/3 top-4 text-xl opacity-50 animate-[drift_12s_ease-in-out_infinite_reverse]">
          ☁️
        </div>
      )}

      {/* Sparkles appear at higher levels — a little bit of magic, earned */}
      {stateIndex >= 4 &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute animate-sparkle text-lg"
            style={{ top: `${30 + i * 12}%`, left: `${15 + i * 30}%`, animationDelay: `${i * 0.7}s` }}
          >
            ✨
          </div>
        ))}

      {/* Butterflies — more of them the further the garden has come */}
      {BUTTERFLY_SPOTS.slice(0, state.butterflies).map((spot, i) => (
        <div
          key={i}
          className="absolute text-xl animate-[floatSimple_4s_ease-in-out_infinite]"
          style={{ top: `${spot.top}%`, left: `${spot.left}%`, animationDelay: `${i * 0.5}s` }}
        >
          🦋
        </div>
      ))}

      {/* Trees */}
      <div className="absolute bottom-16 left-4 text-6xl">🌳</div>
      <div className="absolute bottom-16 right-6 text-6xl">🌳</div>

      {/* Ground */}
      <div className={`absolute bottom-0 h-16 w-full transition-colors duration-1000 ${state.ground}`} />

      {/* Flowers, driven by real completion count, each swaying independently */}
      {FLOWER_POSITIONS.slice(0, flowersToShow).map((pos, index) => (
        <div
          key={index}
          className="absolute z-10 text-3xl transition-all duration-700 animate-[sway_3.5s_ease-in-out_infinite]"
          style={{
            bottom: `${pos.bottom}%`,
            left: `${pos.left}%`,
            animationDelay: `${index * 0.3}s`,
          }}
        >
          {state.flowers[index] || "🌸"}
        </div>
      ))}

      {/* Bloom */}
      <img
        src="/assets/Bloom.svg"
        alt="Bloom"
        className="absolute bottom-9 left-1/2 z-20 w-28 -translate-x-1/2 animate-[floatSimple_3s_ease-in-out_infinite]"
      />

      {/* Message + level */}
      <div className="absolute bottom-3 left-3 z-30 max-w-[62%] rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-[var(--canopy-dark)] shadow-sm">
        {state.message}
      </div>

      {completionCount > 0 && (
        <div className="absolute bottom-3 right-3 z-30 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-[var(--canopy-dark)] shadow-sm">
          🌱 {completionCount} {completionCount === 1 ? "moment" : "moments"}
        </div>
      )}
    </div>
  );
}

export default Garden;
