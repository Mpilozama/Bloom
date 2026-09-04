import { useEffect, useRef, useState } from "react";
import Garden from "./components/garden/Garden.jsx";
import ActivityHistory from "./components/ActivityHistory.jsx";
import { getBloomResponse } from "./service/ai.js";
import { assessSignal, summarizeHistory } from "./service/signals.js";
import { getTimeOfDay, WORLD_SKY, checkInOnTheWorld } from "./service/world.js";

const PRESET_FEELINGS = [
  { emoji: "😌", label: "Pretty okay" },
  { emoji: "😐", label: "A bit off" },
  { emoji: "😮‍💨", label: "Running low" },
  { emoji: "🫠", label: "Honestly... rough" },
];

const WRITE_PROMPTS = [
  "What's one thing that happened today that you haven't said out loud yet?",
  "What's taking up the most space in your head right now?",
  "What's something you did today that you didn't give yourself credit for?",
  "If today had a headline, what would it say?",
];

const NAV_ITEMS = [
  { key: "checkin", icon: "💬", label: "Check in" },
  { key: "wellbeing-overview", icon: "📊", label: "Overview" },
  { key: "garden", icon: "🌷", label: "Garden" },
  { key: "history", icon: "📖", label: "History" },
  { key: "settings", icon: "⚙️", label: "Settings" },
];

function loadStoredHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem("bloom_history") || "[]");
    return { history: Array.isArray(stored) ? stored : [], failed: false };
  } catch (err) {
    console.error("Bloom: couldn't read saved data", err);
    return { history: [], failed: true };
  }
}

function Wordmark({ tone = "dark" }) {
  return (
    <span
      className={`font-display text-lg font-medium tracking-tight ${
        tone === "dark" ? "text-[var(--canopy-dark)]" : "text-white"
      }`}
    >
      Bloom
    </span>
  );
}

function BottomNav({ screen, onNavigate }) {
  return (
    <nav className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-[var(--paper-line)] bg-[var(--paper)]/95 px-1.5 py-1.5 shadow-lg">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.key === "garden" ? screen === "progress" || screen === "empty-state" : screen === item.key;

        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            aria-label={item.label}
            className={`flex flex-col items-center gap-0.5 rounded-full px-3.5 py-2 transition-all ${
              isActive ? "bg-[var(--mist)]" : "hover:bg-[var(--mist)]/60"
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span
              className={`text-[10px] font-medium leading-none ${
                isActive ? "text-[var(--canopy-dark)]" : "text-[var(--moss)]"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function App() {
  const [noticed, setNoticed] = useState(false);
  const [customFeeling, setCustomFeeling] = useState("");
  const [conversation, setConversation] = useState([]);
  const [showTyping, setShowTyping] = useState(false);
  const [signalNote, setSignalNote] = useState("");
  const [initialLoad] = useState(loadStoredHistory);
  const [history, setHistory] = useState(initialLoad.history);
  const [screen, setScreen] = useState(initialLoad.failed ? "error" : "welcome");
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [breathCycles, setBreathCycles] = useState(1);
  const [writePrompt, setWritePrompt] = useState(WRITE_PROMPTS[0]);
  const [timeOfDay, setTimeOfDay] = useState(() => getTimeOfDay());
  const [awayNote] = useState(() => checkInOnTheWorld());
  const breathTimeoutRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setNoticed(true), 700);
    return () => clearTimeout(timer);
  }, []);

  // The world runs on real wall-clock time, not on whether the user is
  // here. This keeps the sky honest to whatever time it actually is —
  // no faking a cycle just to look busy.
  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Breathing exercise: a real timed inhale / hold / exhale cycle,
  // synchronizing React state with a wall-clock timer (a genuine
  // external system, not something derivable during render).
  useEffect(() => {
    if (screen !== "activity-breath") return undefined;

    const sequence = ["inhale", "hold", "exhale"];
    let index = 0;

    const advance = () => {
      index = (index + 1) % sequence.length;
      if (index === 0) setBreathCycles((c) => c + 1);
      setBreathPhase(sequence[index]);
      breathTimeoutRef.current = setTimeout(advance, 4000);
    };

    breathTimeoutRef.current = setTimeout(advance, 4000);
    return () => clearTimeout(breathTimeoutRef.current);
  }, [screen]);

  const openActivityBreath = () => {
    setBreathPhase("inhale");
    setBreathCycles(1);
    setScreen("activity-breath");
  };

  const openActivityWrite = () => {
    setWritePrompt(WRITE_PROMPTS[Math.floor(Math.random() * WRITE_PROMPTS.length)]);
    setScreen("activity-write");
  };

  const addHistoryEntry = (entry) => {
    setHistory((prev) => {
      const next = [...prev, entry];
      try {
        localStorage.setItem("bloom_history", JSON.stringify(next));
      } catch (err) {
        console.error("Bloom: couldn't save this moment", err);
      }
      return next;
    });
  };

  const enterBloom = () => {
    localStorage.setItem("bloom_has_visited", "true");
    setScreen(localStorage.getItem("bloom_has_visited_before") ? "checkin" : "introduction");
    localStorage.setItem("bloom_has_visited_before", "true");
  };

  const navigate = (key) => {
    if (key === "garden") {
      setScreen(history.length === 0 ? "empty-state" : "progress");
      return;
    }
    setScreen(key);
  };

  // Starts a fresh conversation from a check-in. This is the one moment
  // that gets logged as a signal and checked against the recent pattern.
  const startConversation = async (feelingText) => {
    setCustomFeeling(feelingText);
    setConversation([{ role: "user", text: feelingText }]);
    setShowTyping(true);
    setScreen("reflection");

    const responseText = await getBloomResponse(feelingText, summarizeHistory(history));
    setConversation((prev) => [...prev, { role: "bloom", text: responseText }]);
    setShowTyping(false);

    addHistoryEntry({ type: "checkin", date: new Date().toISOString(), feeling: feelingText });

    const signal = assessSignal(history, feelingText);
    if (signal.uncertain) {
      setSignalNote(signal.note);
      setScreen("uncertainty");
    }
  };

  const handleCustomFeeling = () => {
    const input = document.getElementById("custom-feeling-input");
    const feeling = input?.value?.trim() || "I'm feeling something I can't quite name.";
    startConversation(feeling);
  };

  // Keeps talking with Bloom in the same thread, without re-logging a
  // fresh signal for every reply — one meaningful check-in per moment.
  const continueConversation = async () => {
    const input = document.getElementById("chat-reply-input");
    const reply = input?.value?.trim();
    if (!reply) return;
    input.value = "";

    const updated = [...conversation, { role: "user", text: reply }];
    setConversation(updated);
    setShowTyping(true);

    const snippet = updated
      .slice(-4)
      .map((m) => `${m.role === "user" ? "Person" : "Bloom"}: ${m.text}`)
      .join(" | ");
    const context = [summarizeHistory(history), snippet].filter(Boolean).join(" | ");

    const responseText = await getBloomResponse(reply, context);
    setConversation((prev) => [...prev, { role: "bloom", text: responseText }]);
    setShowTyping(false);
  };

  const completeActivity = (type) => {
    addHistoryEntry({ type, date: new Date().toISOString(), feeling: customFeeling });
    setScreen("progress");
  };

  const completeWriteActivity = () => {
    const input = document.getElementById("write-input");
    const text = input?.value?.trim() || "I wrote something";
    addHistoryEntry({ type: "write", content: text, date: new Date().toISOString(), feeling: customFeeling });
    setScreen("progress");
  };

  // Stepping away from an activity is itself a real signal — the README's
  // own example calls out "repeatedly abandoned activities" — so it's
  // tracked the same gentle, non-judgmental way a check-in is.
  const abandonActivity = (type) => {
    addHistoryEntry({ type: "abandoned", activityType: type, date: new Date().toISOString() });
    setScreen("recommendation");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--mist)]">
      <section
        className={`relative mx-auto min-h-screen max-w-6xl overflow-hidden bg-gradient-to-b transition-colors duration-1000 ${WORLD_SKY[timeOfDay].sky}`}
      >
        {/* Persistent identity bar — present from the very first frame,
            not gated behind the welcome animation. Fixes the "nav shows
            up too late" problem at its root. */}
        <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4">
          <button onClick={() => setScreen("welcome")} className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <Wordmark tone={timeOfDay === "night" ? "light" : "dark"} />
          </button>

          {screen === "welcome" && (
            <div className="flex gap-2">
              <button
                onClick={() => setScreen("history")}
                aria-label="History"
                className="rounded-full bg-white/70 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm transition hover:bg-white/90"
              >
                📖
              </button>
              <button
                onClick={() => setScreen("settings")}
                aria-label="Settings"
                className="rounded-full bg-white/70 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm transition hover:bg-white/90"
              >
                ⚙️
              </button>
            </div>
          )}
        </div>

        {/* =========================
            SKY — reflects the real time of day, whether or not
            anyone's here to see it change.
        ========================== */}
        <div className="absolute inset-0">
          {WORLD_SKY[timeOfDay].stars &&
            [...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 animate-sparkle rounded-full bg-white"
                style={{
                  top: `${8 + ((i * 37) % 45)}%`,
                  left: `${5 + ((i * 53) % 90)}%`,
                  animationDelay: `${(i % 5) * 0.6}s`,
                }}
              />
            ))}
          <div className="absolute left-[8%] top-[12%] text-5xl opacity-70 animate-[drift_10s_ease-in-out_infinite]">
            ☁️
          </div>
          <div className="absolute right-[12%] top-[9%] text-4xl opacity-60 animate-[drift_13s_ease-in-out_infinite_reverse]">
            ☁️
          </div>
          <div className="absolute right-[18%] top-[16%] text-5xl">{WORLD_SKY[timeOfDay].orb}</div>
        </div>

        <div className={`absolute bottom-[25%] left-[-10%] h-40 w-[120%] rounded-[50%] transition-colors duration-1000 ${WORLD_SKY[timeOfDay].hills}`} />
        <div className={`absolute bottom-[20%] left-[-15%] h-32 w-[130%] rounded-[50%] transition-colors duration-1000 ${WORLD_SKY[timeOfDay].hillsFar}`} />

        <div className="absolute bottom-[20%] left-[5%] text-7xl">🌳</div>
        <div className="absolute bottom-[22%] right-[7%] text-8xl">🌳</div>

        <div className="absolute bottom-[25%] left-[25%] text-3xl animate-[sway_4s_ease-in-out_infinite]">🌾</div>
        <div className="absolute bottom-[24%] right-[28%] text-3xl animate-[sway_5s_ease-in-out_infinite_reverse]">
          🌾
        </div>
        <div className="absolute bottom-[18%] left-[15%] text-2xl">🌼</div>
        <div className="absolute bottom-[19%] right-[20%] text-2xl">🌷</div>

        <div className="absolute bottom-0 h-[27%] w-full bg-[#78ad70]" />
        <div className="absolute bottom-[21%] left-[20%] text-xl">🌱</div>
        <div className="absolute bottom-[18%] left-[38%] text-xl">🌱</div>
        <div className="absolute bottom-[20%] right-[38%] text-xl">🌱</div>

        <div
          className={`absolute bottom-[20%] left-1/2 z-20 -translate-x-1/2 transition-all duration-1000 ease-out ${
            noticed ? "scale-105" : "animate-[bloomIdle_3s_ease-in-out_infinite]"
          }`}
        >
          <img src="/assets/Bloom.svg" alt="Bloom" className="w-44 drop-shadow-lg" />
        </div>

        <div className="absolute bottom-[30%] left-[12%] text-lg animate-[floatSimple_5s_ease-in-out_infinite]">
          🦋
        </div>
        <div className="absolute bottom-[34%] right-[14%] text-lg animate-[floatSimple_6s_ease-in-out_infinite_reverse]">
          🐝
        </div>

        {/* ==================================================
            SCREEN: WELCOME
        ================================================== */}
        {screen === "welcome" && (
          <>
            {noticed && (
              <div className="absolute left-1/2 top-[16%] z-30 w-[min(90%,440px)] -translate-x-1/2 animate-fadeIn">
                <div className="panel-bubble px-7 py-6 text-center">
                  <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Oh, you're here.</p>
                  {awayNote ? (
                    <p className="mt-2 text-base leading-relaxed text-[var(--moss)]">
                      While you were gone: {awayNote}
                    </p>
                  ) : (
                    <p className="mt-2 text-base leading-relaxed text-[var(--moss)]">
                      I was just enjoying the garden.
                      <br />
                      Come sit with me for a while.
                    </p>
                  )}
                  <button
                    onClick={enterBloom}
                    className="mt-5 rounded-full bg-[var(--canopy)] px-7 py-3 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
                  >
                    Come sit with me →
                  </button>
                </div>
              </div>
            )}

            {/* Fills the empty lower space with something true, not decorative:
                a quiet record of how far the garden has actually come. */}
            {history.length > 0 && (
              <div className="absolute bottom-6 left-1/2 z-30 w-[min(90%,420px)] -translate-x-1/2 animate-fadeIn">
                <button
                  onClick={() => setScreen("progress")}
                  className="flex w-full items-center justify-between rounded-full bg-white/80 px-5 py-3 text-sm shadow-md backdrop-blur-sm transition hover:bg-white/95"
                >
                  <span className="text-[var(--canopy-dark)]">
                    🌱 {history.length} {history.length === 1 ? "moment" : "moments"} in your garden so far
                  </span>
                  <span className="text-[var(--moss)]">View →</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ==================================================
            SCREEN: INTRODUCTION (First Visit)
        ================================================== */}
        {screen === "introduction" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-fadeIn">
              <div className="relative panel p-8">
                <p className="font-display text-3xl font-medium leading-tight text-[var(--canopy-dark)]">
                  I'm not here to keep score.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[var(--moss)]">
                  I'm here to help you understand yourself a little better.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[var(--moss)]">
                  A lot of wellness apps ask you to track everything and keep a streak going. That can turn taking
                  care of yourself into one more responsibility.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[var(--moss)]">
                  Bloom works differently: what you tell me is a signal, not a verdict — and you don't have to
                  perform wellness for me. We work with how you're actually feeling.
                </p>

                <div className="my-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--mist)] px-4 py-2 text-sm text-[var(--moss)]">
                    🌱 No streaks
                  </span>
                  <span className="rounded-full bg-[var(--mist)] px-4 py-2 text-sm text-[var(--moss)]">
                    🌸 No guilt
                  </span>
                  <span className="rounded-full bg-[var(--mist)] px-4 py-2 text-sm text-[var(--moss)]">
                    🌿 No perfect answers
                  </span>
                </div>

                <button
                  onClick={() => setScreen("checkin")}
                  className="w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
                >
                  Let's begin gently
                </button>

                <p className="mt-4 text-center text-xs italic text-[var(--moss)]/70">
                  You can be completely honest with me.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            SCREEN: CHECK-IN
        ================================================== */}
        {screen === "checkin" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-fadeIn">
              <div className="panel p-8">
                <p className="font-display text-3xl font-medium leading-tight text-[var(--canopy-dark)]">
                  Before we do anything...
                </p>
                <p className="mt-4 text-lg leading-relaxed text-[var(--moss)]">
                  Forget what you think you <em>should</em> be feeling.
                </p>
                <p className="mt-3 text-base leading-relaxed text-[var(--moss)]">
                  I just want to know what's actually going on with you.
                </p>

                <div className="mt-7">
                  <p className="mb-3 text-sm font-medium text-[var(--canopy-dark)]">How are you feeling right now?</p>

                  <div className="grid grid-cols-2 gap-3">
                    {PRESET_FEELINGS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => startConversation(preset.label)}
                        className="rounded-2xl border-2 border-[var(--paper-line)] bg-[var(--paper)] p-4 text-left transition-all hover:-translate-y-1 hover:border-[var(--moss)] hover:bg-[var(--mist)]"
                      >
                        <div className="text-2xl">{preset.emoji}</div>
                        <div className="mt-2 font-medium text-[var(--canopy-dark)]">{preset.label}</div>
                      </button>
                    ))}

                    <button
                      onClick={() => setScreen("custom-feeling")}
                      className="col-span-2 rounded-2xl border-2 border-dashed border-[var(--paper-line)] bg-[var(--paper)] p-4 text-center transition-all hover:-translate-y-1 hover:border-[var(--moss)] hover:bg-[var(--mist)]"
                    >
                      <div className="text-2xl">💭</div>
                      <div className="mt-1 font-medium text-[var(--moss)]">Something else</div>
                      <div className="text-xs text-[var(--moss)]/70">Tell me in your own words</div>
                    </button>
                  </div>
                </div>

                <p className="mt-5 text-center text-xs text-[var(--moss)]/70">
                  Pick what feels closest, or tell me exactly. There's no wrong answer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            SCREEN: CUSTOM FEELING (Free text input)
        ================================================== */}
        {screen === "custom-feeling" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-fadeIn">
              <div className="panel p-8">
                <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Tell me in your own words.</p>
                <p className="mt-3 text-sm text-[var(--moss)]">
                  Say it however it comes. You don't need to make it sound a certain way.
                </p>

                <div className="mt-5">
                  <textarea
                    id="custom-feeling-input"
                    placeholder="I'm feeling..."
                    className="min-h-[100px] w-full resize-none rounded-2xl border-2 border-[var(--paper-line)] bg-[var(--mist)]/40 px-5 py-4 text-[var(--ink)] placeholder:text-[var(--moss)]/50 transition-all focus:border-[var(--moss)] focus:outline-none focus:ring-2 focus:ring-[var(--moss)]/20"
                    rows="3"
                    autoFocus
                  />

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => setScreen("checkin")}
                      className="flex-1 rounded-full border-2 border-[var(--paper-line)] px-6 py-3 font-medium text-[var(--moss)] transition-all hover:bg-[var(--mist)]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCustomFeeling}
                      className="flex-1 rounded-full bg-[var(--canopy)] px-6 py-3 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
                    >
                      Send to Bloom
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            SCREEN: REFLECTION — an actual back-and-forth with Bloom,
            not a single fire-and-forget reply.
        ================================================== */}
        {screen === "reflection" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-fadeIn">
              <div className="panel flex max-h-[80vh] flex-col p-6">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className="text-xl">🌱</span>
                  <Wordmark />
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-1 py-2">
                  {conversation.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                          message.role === "user" ? "chat-bubble-user" : "chat-bubble-bloom text-[var(--ink)]"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {showTyping && (
                    <div className="flex justify-start">
                      <div className="chat-bubble-bloom flex gap-1 px-4 py-3">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--moss)]" />
                        <span className="delay-100 h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--moss)]" />
                        <span className="delay-200 h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--moss)]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex gap-2 border-t border-[var(--paper-line)] pt-3">
                  <input
                    id="chat-reply-input"
                    type="text"
                    placeholder="Say more, if you want to..."
                    onKeyDown={(e) => e.key === "Enter" && continueConversation()}
                    className="flex-1 rounded-full border-2 border-[var(--paper-line)] bg-[var(--mist)]/40 px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--moss)]/50 focus:border-[var(--moss)] focus:outline-none"
                  />
                  <button
                    onClick={continueConversation}
                    disabled={showTyping}
                    aria-label="Send"
                    className="rounded-full bg-[var(--canopy)] px-4 py-2.5 text-white transition-all hover:bg-[var(--canopy-dark)] disabled:opacity-50"
                  >
                    ➤
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setScreen("recommendation")}
                    className="rounded-full bg-[var(--canopy)] px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
                  >
                    💬 Talk it through
                  </button>
                  <button
                    onClick={() => setScreen("progress")}
                    className="rounded-full border-2 border-[var(--paper-line)] px-5 py-2 text-sm font-medium text-[var(--moss)] transition-all hover:bg-[var(--mist)]"
                  >
                    🌿 Just sit with me
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          SCREEN: WELLBEING OVERVIEW
      ================================================== */}
      {screen === "wellbeing-overview" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8">
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">How are things?</p>
              <p className="mt-2 text-sm text-[var(--moss)]">Just a gentle look at where you are right now.</p>

              <div className="mt-5 rounded-2xl border border-[var(--paper-line)] bg-[var(--mist)]/40 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--moss)]">Last check-in</span>
                  <span className="text-sm text-[var(--moss)]">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-3xl">
                    {customFeeling === "Pretty okay" && "😌"}
                    {customFeeling === "A bit off" && "😐"}
                    {customFeeling === "Running low" && "😮‍💨"}
                    {customFeeling === "Honestly... rough" && "🫠"}
                    {!PRESET_FEELINGS.some((p) => p.label === customFeeling) && "🌱"}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--canopy-dark)]">{customFeeling || "Getting to know you"}</p>
                    <p className="text-xs text-[var(--moss)]">
                      {customFeeling ? "That's what you shared" : "No data yet"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setScreen("checkin")}
                  className="flex-1 rounded-full bg-[var(--canopy)] px-6 py-3 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
                >
                  Check in now
                </button>
                <button
                  onClick={() => setScreen("welcome")}
                  className="flex-1 rounded-full border-2 border-[var(--paper-line)] px-6 py-3 font-medium text-[var(--moss)] transition-all hover:bg-[var(--mist)]"
                >
                  Stay in garden
                </button>
              </div>

              <button
                onClick={() => setScreen("history")}
                className="mt-4 text-xs text-[var(--moss)] underline-offset-2 hover:underline"
              >
                View past moments →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: RECOMMENDATION
      ================================================== */}
      {screen === "recommendation" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8">
              <div className="text-center">
                <p className="font-display text-xl font-medium text-[var(--canopy-dark)]">
                  {customFeeling === "Pretty okay" && "Let's make this moment last."}
                  {customFeeling === "A bit off" && "A little pause could help."}
                  {customFeeling === "Running low" && "Let's be gentle with you."}
                  {customFeeling === "Honestly... rough" && "You don't have to do much."}
                  {!PRESET_FEELINGS.some((p) => p.label === customFeeling) && "Let's find what fits."}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <button
                  onClick={openActivityBreath}
                  className="w-full rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--moss)] hover:bg-[var(--mist)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌬️</span>
                    <div>
                      <p className="font-medium text-[var(--canopy-dark)]">A slow breath</p>
                      <p className="text-sm text-[var(--moss)]">One guided cycle. No pressure.</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setScreen("activity-notice")}
                  className="w-full rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--moss)] hover:bg-[var(--mist)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👀</span>
                    <div>
                      <p className="font-medium text-[var(--canopy-dark)]">Ground yourself</p>
                      <p className="text-sm text-[var(--moss)]">One thing you see, hear, and feel</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={openActivityWrite}
                  className="w-full rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--moss)] hover:bg-[var(--mist)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✍️</span>
                    <div>
                      <p className="font-medium text-[var(--canopy-dark)]">A few words</p>
                      <p className="text-sm text-[var(--moss)]">A gentle prompt, if you'd like one</p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setScreen("progress")}
                className="mt-5 w-full rounded-full border-2 border-[var(--paper-line)] px-6 py-3 font-medium text-[var(--moss)] transition-all hover:bg-[var(--mist)]"
              >
                Just sit with me instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: ACTIVITY - Slow Breath (real timed cycle)
      ================================================== */}
      {screen === "activity-breath" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8 text-center">
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Follow the circle</p>
              <p className="mt-2 text-sm text-[var(--moss)]">Cycle {breathCycles}. Stop whenever feels right.</p>

              <div className="mx-auto mt-6 flex h-44 w-44 items-center justify-center rounded-full border-4 border-[var(--moss)]/20">
                <div
                  key={breathPhase + breathCycles}
                  className="h-32 w-32 rounded-full bg-[var(--canopy)]/25"
                  style={{
                    animation:
                      breathPhase === "inhale"
                        ? "breatheIn 4s ease-in-out forwards"
                        : breathPhase === "exhale"
                          ? "breatheOut 4s ease-in-out forwards"
                          : "none",
                    transform: breathPhase === "hold" ? "scale(1)" : undefined,
                  }}
                />
              </div>

              <p className="mt-6 font-display text-xl text-[var(--canopy-dark)]">
                {breathPhase === "inhale" && "Breathe in..."}
                {breathPhase === "hold" && "Hold."}
                {breathPhase === "exhale" && "Breathe out..."}
              </p>

              <button
                onClick={() => completeActivity("breath")}
                className="mt-6 w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
              >
                I'm good, that helped
              </button>

              <button
                onClick={() => abandonActivity("breath")}
                className="mt-3 text-sm text-[var(--moss)] underline-offset-2 hover:underline"
              >
                Not right now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: ACTIVITY - Ground yourself
      ================================================== */}
      {screen === "activity-notice" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8">
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Ground yourself</p>
              <p className="mt-2 text-sm text-[var(--moss)]">
                No need to think hard about this. Whatever's actually there is right.
              </p>

              <div className="mt-5 space-y-3">
                <input
                  type="text"
                  placeholder="Something you can see..."
                  className="w-full rounded-xl border-2 border-[var(--paper-line)] bg-[var(--mist)]/40 px-4 py-3 text-[var(--ink)] placeholder:text-[var(--moss)]/50 focus:border-[var(--moss)] focus:outline-none focus:ring-2 focus:ring-[var(--moss)]/20"
                />
                <input
                  type="text"
                  placeholder="Something you can hear..."
                  className="w-full rounded-xl border-2 border-[var(--paper-line)] bg-[var(--mist)]/40 px-4 py-3 text-[var(--ink)] placeholder:text-[var(--moss)]/50 focus:border-[var(--moss)] focus:outline-none focus:ring-2 focus:ring-[var(--moss)]/20"
                />
                <input
                  type="text"
                  placeholder="Something you can feel..."
                  className="w-full rounded-xl border-2 border-[var(--paper-line)] bg-[var(--mist)]/40 px-4 py-3 text-[var(--ink)] placeholder:text-[var(--moss)]/50 focus:border-[var(--moss)] focus:outline-none focus:ring-2 focus:ring-[var(--moss)]/20"
                />
              </div>

              <button
                onClick={() => completeActivity("notice")}
                className="mt-6 w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
              >
                That helped
              </button>

              <button
                onClick={() => abandonActivity("notice")}
                className="mt-3 w-full text-center text-sm text-[var(--moss)] underline-offset-2 hover:underline"
              >
                Not right now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: ACTIVITY - Write (with a gentle rotating prompt)
      ================================================== */}
      {screen === "activity-write" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8">
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">A few words</p>
              <div className="mt-3 rounded-2xl border border-[var(--paper-line)] bg-[var(--mist)]/40 p-4">
                <p className="text-sm italic text-[var(--canopy-dark)]">{writePrompt}</p>
                <p className="mt-1 text-xs text-[var(--moss)]">Or ignore this and write whatever you want.</p>
              </div>

              <textarea
                id="write-input"
                placeholder="Start typing..."
                className="mt-4 min-h-[120px] w-full resize-none rounded-2xl border-2 border-[var(--paper-line)] bg-[var(--mist)]/40 px-5 py-4 text-[var(--ink)] placeholder:text-[var(--moss)]/50 focus:border-[var(--moss)] focus:outline-none focus:ring-2 focus:ring-[var(--moss)]/20"
                rows="4"
              />

              <button
                onClick={completeWriteActivity}
                className="mt-5 w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
              >
                Done writing
              </button>

              <button
                onClick={() => abandonActivity("write")}
                className="mt-3 w-full text-center text-sm text-[var(--moss)] underline-offset-2 hover:underline"
              >
                Not right now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: PROGRESS — real Garden component, driven by history
      ================================================== */}
      {screen === "progress" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8">
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Your garden</p>
              <p className="mt-1 text-sm text-[var(--moss)]">Not about streaks. Just moments you showed up.</p>

              <div className="mt-5">
                <Garden completed={history.length > 0} completionCount={history.length} timeOfDay={timeOfDay} />
              </div>

              <ActivityHistory activities={history.slice(-5).reverse()} />

              <button
                onClick={() => setScreen("welcome")}
                className="mt-5 w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
              >
                Back to garden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: HISTORY
      ================================================== */}
      {screen === "history" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto animate-fadeIn">
            <div className="panel p-8">
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Your history</p>
              <p className="mt-1 text-sm text-[var(--moss)]">Every moment you've shared.</p>

              {history.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-3 text-4xl">🌱</p>
                  <p className="text-[var(--moss)]">No history yet.</p>
                  <p className="text-sm text-[var(--moss)]/70">Your first moment will appear here.</p>
                </div>
              ) : (
                <ActivityHistory activities={history.slice().reverse()} />
              )}

              <button
                onClick={() => setScreen("wellbeing-overview")}
                className="mt-5 w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
              >
                Back to overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: SETTINGS / PRIVACY
      ================================================== */}
      {screen === "settings" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8">
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Settings</p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--mist)]/40 p-4">
                  <p className="font-medium text-[var(--canopy-dark)]">🔒 Privacy</p>
                  <p className="mt-1 text-sm text-[var(--moss)]">
                    Your check-ins stay on your device. Only what you type is sent to Bloom's AI layer to generate a
                    response — nothing else leaves your browser.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (confirm("Delete all your history? This can't be undone.")) {
                      localStorage.removeItem("bloom_history");
                      setHistory([]);
                      setScreen("welcome");
                    }
                  }}
                  className="w-full rounded-2xl border border-red-200 bg-red-50/80 p-4 text-left transition-all hover:bg-red-50"
                >
                  <p className="font-medium text-red-700">🗑️ Clear history</p>
                  <p className="text-sm text-red-600/70">Delete all your moments</p>
                </button>

                <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--mist)]/40 p-4">
                  <p className="font-medium text-[var(--canopy-dark)]">🌱 About Bloom</p>
                  <p className="mt-1 text-sm text-[var(--moss)]">
                    Bloom is a wellness companion, not a therapist. It doesn't diagnose — it helps you notice
                    patterns and take small steps that help you outside the app.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setScreen("welcome")}
                className="mt-5 w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
              >
                Back to garden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: UNCERTAINTY
          Reached when a check-in disagrees with the recent pattern.
          Never says "you're struggling" — only that the signals differ.
      ================================================== */}
      {screen === "uncertainty" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8 text-center">
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">
                I'm holding two things at once.
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--moss)]">
                Sometimes what you say and what I've noticed don't fully agree. I'm not going to assume I know
                better.
              </p>

              <div className="mt-5 rounded-2xl border border-[var(--paper-line)] bg-[var(--mist)]/40 p-5">
                <p className="text-sm italic text-[var(--canopy-dark)]">
                  {signalNote || "You don't always need to explain everything. Just being present is enough."}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setScreen("checkin")}
                  className="rounded-full bg-[var(--canopy)] px-6 py-2.5 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
                >
                  Tell me more
                </button>
                <button
                  onClick={() => setScreen("welcome")}
                  className="rounded-full border-2 border-[var(--paper-line)] px-6 py-2.5 font-medium text-[var(--moss)] transition-all hover:bg-[var(--mist)]"
                >
                  Stay with me
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: EMPTY STATE
      ================================================== */}
      {screen === "empty-state" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8 text-center">
              <p className="mb-2 text-6xl">🌱</p>
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Your garden is new</p>
              <p className="mt-3 text-base text-[var(--moss)]">
                Every garden starts as a seed. Take your time. There's no rush.
              </p>

              <button
                onClick={() => setScreen("checkin")}
                className="mt-5 w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
              >
                Plant something
              </button>

              <button
                onClick={() => setScreen("welcome")}
                className="mt-3 text-sm text-[var(--moss)] underline-offset-2 hover:underline"
              >
                Just sit with me instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SCREEN: ERROR STATE
      ================================================== */}
      {screen === "error" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-lg animate-fadeIn">
            <div className="panel p-8 text-center">
              <p className="mb-2 text-5xl">🌿</p>
              <p className="font-display text-2xl font-medium text-[var(--canopy-dark)]">Something went wrong</p>
              <p className="mt-3 text-base text-[var(--moss)]">But that's okay. Let's try again.</p>

              <button
                onClick={() => {
                  try {
                    localStorage.removeItem("bloom_history");
                  } catch {
                    // nothing more we can do here
                  }
                  setHistory([]);
                  setScreen("welcome");
                }}
                className="mt-5 w-full rounded-full bg-[var(--canopy)] px-8 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--canopy-dark)] active:scale-95"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {screen !== "welcome" && <BottomNav screen={screen} onNavigate={navigate} />}
    </main>
  );
}

export default App;
