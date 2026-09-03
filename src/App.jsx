import { useEffect, useState } from "react";

function App() {
  const [screen, setScreen] = useState("welcome");
  const [noticed, setNoticed] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [customFeeling, setCustomFeeling] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [bloomResponse, setBloomResponse] = useState("");

  useEffect(() => {
    const hasVisited = localStorage.getItem("bloom_has_visited");

    if (hasVisited) {
      setIsFirstVisit(false);
    }

    const timer = setTimeout(() => {
      setNoticed(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const enterBloom = () => {
    localStorage.setItem("bloom_has_visited", "true");

    if (isFirstVisit) {
      setScreen("introduction");
    } else {
      setScreen("checkin");
    }
  };

  const handleCustomFeeling = () => {
    const input = document.getElementById('custom-feeling-input');
    const feeling = input?.value?.trim() || "I'm feeling something I can't quite name.";
    setCustomFeeling(feeling);
    localStorage.setItem('bloom_custom_feeling', feeling);
    
    // Show typing effect
    setShowTyping(true);
    
    // Simulate Bloom "thinking" and responding
    setTimeout(() => {
      const responses = [
        "Thank you for sharing that. It takes courage to put feelings into words. I'm here with you.",
        "I hear you. That's real and it matters. You don't have to carry it alone.",
        "That's a lot to hold. Thank you for trusting me with it. Let's sit with this together.",
        "I don't have answers for you. But I have presence. And I'm right here."
      ];
      setBloomResponse(responses[Math.floor(Math.random() * responses.length)]);
      setShowTyping(false);
      setScreen("reflection-custom");
    }, 1500);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#dff1e7]">

      <section className="relative mx-auto min-h-screen max-w-6xl overflow-hidden bg-gradient-to-b from-[#bfe3ee] via-[#dff0e6] to-[#a8d49d]">

        {/* =========================
            SKY
        ========================== */}

        <div className="absolute inset-0">

          <div className="absolute left-[8%] top-[12%] text-5xl opacity-70 animate-[drift_10s_ease-in-out_infinite]">
            ☁️
          </div>

          <div className="absolute right-[12%] top-[9%] text-4xl opacity-60 animate-[drift_13s_ease-in-out_infinite_reverse]">
            ☁️
          </div>

          <div className="absolute right-[18%] top-[16%] text-5xl">
            ☀️
          </div>

        </div>

        {/* =========================
            DISTANT HILLS
        ========================== */}

        <div className="absolute bottom-[25%] left-[-10%] h-40 w-[120%] rounded-[50%] bg-[#9dcc9a]" />
        <div className="absolute bottom-[20%] left-[-15%] h-32 w-[130%] rounded-[50%] bg-[#8fbe86]" />

        {/* =========================
            TREES
        ========================== */}

        <div className="absolute bottom-[20%] left-[5%] text-7xl">
          🌳
        </div>

        <div className="absolute bottom-[22%] right-[7%] text-8xl">
          🌳
        </div>

        {/* =========================
            GRASS & FLOWERS
        ========================== */}

        <div className="absolute bottom-[25%] left-[25%] text-3xl animate-[sway_4s_ease-in-out_infinite]">
          🌾
        </div>

        <div className="absolute bottom-[24%] right-[28%] text-3xl animate-[sway_5s_ease-in-out_infinite_reverse]">
          🌾
        </div>

        <div className="absolute bottom-[18%] left-[15%] text-2xl">
          🌼
        </div>

        <div className="absolute bottom-[19%] right-[20%] text-2xl">
          🌷
        </div>

        {/* =========================
            GROUND
        ========================== */}

        <div className="absolute bottom-0 h-[27%] w-full bg-[#78ad70]" />

        <div className="absolute bottom-[21%] left-[20%] text-xl">
          🌱
        </div>

        <div className="absolute bottom-[18%] left-[38%] text-xl">
          🌱
        </div>

        <div className="absolute bottom-[20%] right-[38%] text-xl">
          🌱
        </div>

        {/* =========================
            BLOOM
        ========================== */}

        <div
          className={`
            absolute bottom-[20%] left-1/2 z-20
            -translate-x-1/2
            transition-all duration-1000 ease-out
            ${
              noticed
                ? "scale-105"
                : "animate-[bloomIdle_3s_ease-in-out_infinite]"
            }
          `}
        >

          <img
            src="/assets/Bloom.svg"
            alt="Bloom"
            className="w-44 drop-shadow-lg"
          />

        </div>

        {/* ==================================================
            ATMOSPHERE
        ================================================== */}

        <div className="absolute bottom-[30%] left-[12%] text-lg animate-[float_5s_ease-in-out_infinite]">
          🦋
        </div>

        <div className="absolute bottom-[34%] right-[14%] text-lg animate-[float_6s_ease-in-out_infinite_reverse]">
          🐝
        </div>

        {/* ==================================================
            SCREEN: WELCOME
        ================================================== */}

        {screen === "welcome" && (
          <>
            {!noticed && (
              <div className="absolute bottom-[39%] left-1/2 -translate-x-1/2 text-sm text-green-900/60">
                Bloom is enjoying a quiet moment...
              </div>
            )}

            {noticed && (
              <div
                className="
                  absolute left-1/2 top-[10%] z-30
                  w-[min(90%,420px)]
                  -translate-x-1/2
                  animate-[fadeIn_0.8s_ease-out]
                "
              >
                <div className="rounded-[2rem] bg-white/90 px-7 py-6 text-center shadow-xl backdrop-blur-md">
                  <p className="text-2xl font-semibold text-[#234b36]">
                    Oh, you're here.
                  </p>

                  <p className="mt-2 text-base leading-relaxed text-[#527060]">
                    I was just enjoying the garden.
                    <br />
                    Come sit with me for a while.
                  </p>

                  <button
                    onClick={enterBloom}
                    className="
                      mt-5 rounded-full bg-[#315f42]
                      px-7 py-3 font-medium text-white
                      shadow-md transition-all duration-200
                      hover:-translate-y-0.5
                      hover:bg-[#264d35]
                      active:scale-95
                    "
                  >
                    Come sit with me →
                  </button>
                </div>

                <div className="mx-auto -mt-2 h-5 w-5 rotate-45 bg-white/90" />
              </div>
            )}
          </>
        )}

        {/* ==================================================
            SCREEN: INTRODUCTION (First Visit)
        ================================================== */}

        {screen === "introduction" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-[fadeIn_0.8s_ease-out]">
              <div className="relative rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-3xl animate-[bloomIdle_3s_ease-in-out_infinite]">
                    🌱
                  </span>
                  <span className="text-sm font-medium tracking-wide text-[#78ad70]">
                    Bloom
                  </span>
                </div>

                <p className="text-3xl font-semibold leading-tight text-[#234b36]">
                  I'm not here to keep score.
                </p>

                <p className="mt-4 text-base leading-relaxed text-[#527060]">
                  I'm here to help you understand yourself a little better.
                </p>

                <p className="mt-4 text-base leading-relaxed text-[#527060]">
                  There are plenty of wellness apps that ask you to track
                  everything, keep streaks, and constantly check in.
                </p>

                <p className="mt-4 text-base leading-relaxed text-[#527060]">
                  But sometimes that turns taking care of yourself into
                  another responsibility.
                </p>

                <div className="my-6 rounded-2xl bg-[#edf7ef] p-5">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#78ad70]">
                    What makes Bloom different?
                  </p>
                  <p className="mt-2 text-lg leading-relaxed text-[#315f42]">
                    You don't have to perform wellness for me.
                    <br />
                    <span className="font-semibold">
                      We work with how you're actually feeling.
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#dff0e6] px-4 py-2 text-sm text-[#527060]">
                    🌱 No streaks
                  </span>
                  <span className="rounded-full bg-[#dff0e6] px-4 py-2 text-sm text-[#527060]">
                    🌸 No guilt
                  </span>
                  <span className="rounded-full bg-[#dff0e6] px-4 py-2 text-sm text-[#527060]">
                    🌿 No perfect answers
                  </span>
                </div>

                <button
                  onClick={() => setScreen("checkin")}
                  className="
                    mt-7 w-full rounded-full
                    bg-[#315f42] px-8 py-4
                    font-medium text-white shadow-md
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#264d35]
                    active:scale-95
                  "
                >
                  Let's begin gently ✦
                </button>

                <p className="mt-4 text-center text-xs italic text-[#78ad70]/70">
                  You can be completely honest with me.
                </p>
              </div>

              <div className="mx-auto -mt-2 h-5 w-5 rotate-45 bg-white/90" />
            </div>
          </div>
        )}

        {/* ==================================================
            SCREEN: CHECK-IN (With "Something else")
        ================================================== */}

        {screen === "checkin" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-[fadeIn_0.8s_ease-out]">
              <div className="rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-3xl">🌱</span>
                  <span className="text-sm font-medium tracking-wide text-[#78ad70]">Bloom</span>
                </div>

                <h1 className="text-3xl font-semibold leading-tight text-[#234b36]">
                  Before we do anything...
                </h1>

                <p className="mt-4 text-lg leading-relaxed text-[#527060]">
                  Forget what you think you <em>should</em> be feeling.
                </p>

                <p className="mt-3 text-base leading-relaxed text-[#527060]">
                  I just want to know what's actually going on with you.
                </p>

                <div className="mt-7">
                  <p className="mb-3 text-sm font-medium text-[#315f42]">
                    How are you feeling right now?
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setCustomFeeling("Pretty okay");
                        setScreen("reflection");
                      }}
                      className="
                        rounded-2xl border-2 border-[#dff0e6]
                        bg-[#f5fbf6] p-4 text-left
                        transition-all hover:-translate-y-1
                        hover:border-[#78ad70]
                        hover:bg-[#edf7ef]
                      "
                    >
                      <div className="text-2xl">😌</div>
                      <div className="mt-2 font-medium text-[#315f42]">Pretty okay</div>
                    </button>

                    <button
                      onClick={() => {
                        setCustomFeeling("A bit off");
                        setScreen("reflection");
                      }}
                      className="
                        rounded-2xl border-2 border-[#dff0e6]
                        bg-[#f5fbf6] p-4 text-left
                        transition-all hover:-translate-y-1
                        hover:border-[#78ad70]
                        hover:bg-[#edf7ef]
                      "
                    >
                      <div className="text-2xl">😐</div>
                      <div className="mt-2 font-medium text-[#315f42]">A bit off</div>
                    </button>

                    <button
                      onClick={() => {
                        setCustomFeeling("Running low");
                        setScreen("reflection");
                      }}
                      className="
                        rounded-2xl border-2 border-[#dff0e6]
                        bg-[#f5fbf6] p-4 text-left
                        transition-all hover:-translate-y-1
                        hover:border-[#78ad70]
                        hover:bg-[#edf7ef]
                      "
                    >
                      <div className="text-2xl">😮‍💨</div>
                      <div className="mt-2 font-medium text-[#315f42]">Running low</div>
                    </button>

                    <button
                      onClick={() => {
                        setCustomFeeling("Honestly... rough");
                        setScreen("reflection");
                      }}
                      className="
                        rounded-2xl border-2 border-[#dff0e6]
                        bg-[#f5fbf6] p-4 text-left
                        transition-all hover:-translate-y-1
                        hover:border-[#78ad70]
                        hover:bg-[#edf7ef]
                      "
                    >
                      <div className="text-2xl">🫠</div>
                      <div className="mt-2 font-medium text-[#315f42]">Honestly... rough</div>
                    </button>

                    {/* SOMETHING ELSE - spans full width */}
                    <button
                      onClick={() => setScreen("custom-feeling")}
                      className="
                        col-span-2 rounded-2xl border-2 border-dashed border-[#b8d4ae]
                        bg-[#f5fbf6] p-4 text-center
                        transition-all hover:-translate-y-1
                        hover:border-[#78ad70]
                        hover:bg-[#edf7ef]
                      "
                    >
                      <div className="text-2xl">💭</div>
                      <div className="mt-1 font-medium text-[#527060]">Something else</div>
                      <div className="text-xs text-[#78ad70]">Tell me in your own words</div>
                    </button>
                  </div>
                </div>

                <p className="mt-5 text-center text-xs text-[#78ad70]">
                  Pick what feels closest. Or tell me exactly.
                  <br />
                  There's no wrong answer.
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
            <div className="w-full max-w-lg animate-[fadeIn_0.8s_ease-out]">
              <div className="rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-3xl">🌱</span>
                  <span className="text-sm font-medium tracking-wide text-[#78ad70]">Bloom</span>
                </div>

                <h1 className="text-2xl font-semibold text-[#234b36]">
                  Tell me in your own words.
                </h1>

                <p className="mt-3 text-sm text-[#527060]">
                  Say it however it comes. You don't need to make it sound a certain way.
                  No judgment. No pressure.
                </p>

                <div className="mt-5">
                  <textarea
                    id="custom-feeling-input"
                    placeholder="I'm feeling..."
                    className="
                      w-full rounded-2xl border-2 border-[#dff0e6]
                      bg-[#f5fbf6] px-5 py-4 text-[#234b36]
                      placeholder:text-[#b8d4ae]
                      focus:border-[#78ad70] focus:outline-none
                      focus:ring-2 focus:ring-[#78ad70]/20
                      min-h-[100px] resize-none
                      transition-all
                    "
                    rows="3"
                    autoFocus
                  />

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => setScreen("checkin")}
                      className="
                        flex-1 rounded-full border-2 border-[#dff0e6]
                        px-6 py-3 font-medium text-[#527060]
                        transition-all hover:bg-[#f5fbf6]
                      "
                    >
                      Back
                    </button>

                    <button
                      onClick={handleCustomFeeling}
                      className="
                        flex-1 rounded-full bg-[#315f42]
                        px-6 py-3 font-medium text-white
                        shadow-md transition-all
                        hover:-translate-y-0.5 hover:bg-[#264d35]
                        active:scale-95
                      "
                    >
                      Send to Bloom ✦
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-[#78ad70]/70">
                  Bloom will read what you wrote and respond gently.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            SCREEN: REFLECTION (Standard)
        ================================================== */}

        {screen === "reflection" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-[fadeIn_0.8s_ease-out]">
              <div className="rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
                <div className="text-center">
                  <div className="mb-4 text-5xl animate-[bloomIdle_3s_ease-in-out_infinite]">
                    🌱
                  </div>

                  <h1 className="text-2xl font-semibold text-[#234b36]">
                    Thank you for being honest.
                  </h1>

                  <div className="mt-4 rounded-2xl bg-[#edf7ef] p-5 text-left">
                    <p className="text-sm font-medium text-[#78ad70]">You said:</p>
                    <p className="mt-2 text-base italic text-[#315f42]">
                      "{customFeeling}"
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#f5fbf6] p-5 text-left border border-[#dff0e6]">
                    <p className="text-sm font-medium text-[#78ad70]">Bloom says:</p>
                    <p className="mt-2 text-base leading-relaxed text-[#315f42]">
                      I hear you. That's real and it matters.
                      You don't have to carry it alone.
                    </p>
                  </div>

                  <p className="mt-4 text-sm text-[#527060]">
                    What would help most right now?
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setScreen("welcome")}
                      className="
                        rounded-full bg-[#315f42] px-6 py-2.5
                        font-medium text-white shadow-md
                        transition-all hover:-translate-y-0.5
                        hover:bg-[#264d35] active:scale-95
                      "
                    >
                      💬 Talk it through
                    </button>

                    <button
                      onClick={() => setScreen("welcome")}
                      className="
                        rounded-full border-2 border-[#dff0e6]
                        px-6 py-2.5 font-medium text-[#527060]
                        transition-all hover:bg-[#f5fbf6]
                      "
                    >
                      🌿 Just sit with me
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            SCREEN: REFLECTION - CUSTOM (Bloom responds)
        ================================================== */}

        {screen === "reflection-custom" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-[fadeIn_0.8s_ease-out]">
              <div className="rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
                <div className="text-center">
                  <div className="mb-4 text-5xl animate-[bloomIdle_3s_ease-in-out_infinite]">
                    🌱
                  </div>

                  <h1 className="text-2xl font-semibold text-[#234b36]">
                    I hear you.
                  </h1>

                  <div className="mt-4 rounded-2xl bg-[#edf7ef] p-5 text-left">
                    <p className="text-sm font-medium text-[#78ad70]">You said:</p>
                    <p className="mt-2 text-base italic text-[#315f42]">
                      "{customFeeling}"
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#f5fbf6] p-5 text-left border border-[#dff0e6]">
                    <p className="text-sm font-medium text-[#78ad70]">Bloom says:</p>
                    <p className="mt-2 text-base leading-relaxed text-[#315f42]">
                      {showTyping ? "..." : bloomResponse}
                    </p>
                    {showTyping && (
                      <div className="mt-2 flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#78ad70] animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-[#78ad70] animate-bounce delay-100" />
                        <span className="h-2 w-2 rounded-full bg-[#78ad70] animate-bounce delay-200" />
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-sm text-[#527060]">
                    What would help most right now?
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setScreen("welcome")}
                      className="
                        rounded-full bg-[#315f42] px-6 py-2.5
                        font-medium text-white shadow-md
                        transition-all hover:-translate-y-0.5
                        hover:bg-[#264d35] active:scale-95
                      "
                    >
                      💬 Talk it through
                    </button>

                    <button
                      onClick={() => setScreen("welcome")}
                      className="
                        rounded-full border-2 border-[#dff0e6]
                        px-6 py-2.5 font-medium text-[#527060]
                        transition-all hover:bg-[#f5fbf6]
                      "
                    >
                      🌿 Just sit with me
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

       </section>















       {/* ==================================================
            SCREEN: WELLBEING OVERVIEW
            Shows user's current state at a glance
        ================================================== */}

        {screen === "wellbeing-overview" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-[fadeIn_0.8s_ease-out]">
              <div className="rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
                
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-3xl">🌱</span>
                  <span className="text-sm font-medium tracking-wide text-[#78ad70]">Bloom</span>
                </div>

                <h1 className="text-2xl font-semibold text-[#234b36]">
                  How are things?
                </h1>

                <p className="mt-2 text-sm text-[#527060]">
                  Just a gentle look at where you are right now.
                </p>

                {/* Current state card */}
                <div className="mt-5 rounded-2xl bg-[#f5fbf6] p-5 border border-[#dff0e6]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#78ad70]">Last check-in</span>
                    <span className="text-sm text-[#527060]">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-3xl">
                      {customFeeling === "Pretty okay" && "😌"}
                      {customFeeling === "A bit off" && "😐"}
                      {customFeeling === "Running low" && "😮‍💨"}
                      {customFeeling === "Honestly... rough" && "🫠"}
                      {!["Pretty okay", "A bit off", "Running low", "Honestly... rough"].includes(customFeeling) && "🌱"}
                    </span>
                    <div>
                      <p className="font-medium text-[#234b36]">
                        {customFeeling || "Getting to know you"}
                      </p>
                      <p className="text-xs text-[#78ad70]">
                        {customFeeling ? "That's what you shared" : "No data yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => setScreen("checkin")}
                    className="
                      flex-1 rounded-full bg-[#315f42] px-6 py-3
                      font-medium text-white shadow-md
                      transition-all hover:-translate-y-0.5
                      hover:bg-[#264d35] active:scale-95
                    "
                  >
                    Check in now
                  </button>
                  
                  <button
                    onClick={() => setScreen("welcome")}
                    className="
                      flex-1 rounded-full border-2 border-[#dff0e6]
                      px-6 py-3 font-medium text-[#527060]
                      transition-all hover:bg-[#f5fbf6]
                    "
                  >
                    Stay in garden
                  </button>
                </div>

                {/* View history link */}
                <button
                  onClick={() => setScreen("history")}
                  className="mt-4 text-xs text-[#78ad70] underline-offset-2 hover:underline"
                >
                  View past moments →
                </button>

              </div>
            </div>
          </div>
        )}


      {/* =========================
          ANIMATIONS
      ========================== */}

      <style>{`

        @keyframes bloomIdle {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-7px);
          }
        }

        @keyframes drift {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(25px);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

      `}</style>

    </main>
  );
}

export default App;