import { useEffect, useState } from "react";

function App() {
  const [screen, setScreen] = useState("welcome");
  const [noticed, setNoticed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNoticed(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#dff1e7]">
      <section className="relative mx-auto min-h-screen max-w-6xl overflow-hidden bg-gradient-to-b from-[#bfe3ee] via-[#dff0e6] to-[#a8d49d]">

        {/* SKY */}
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

        {/* DISTANT HILLS */}
        <div className="absolute bottom-[25%] left-[-10%] h-40 w-[120%] rounded-[50%] bg-[#9dcc9a]" />
        <div className="absolute bottom-[20%] left-[-15%] h-32 w-[130%] rounded-[50%] bg-[#8fbe86]" />

        {/* TREES */}
        <div className="absolute bottom-[20%] left-[5%] text-7xl">
          🌳
        </div>

        <div className="absolute bottom-[22%] right-[7%] text-8xl">
          🌳
        </div>

        {/* GRASS */}
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

        {/* GROUND */}
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

        {/* BLOOM */}
        <div
          className={`
            absolute bottom-[20%] left-1/2 z-20
            -translate-x-1/2
            transition-all duration-1000 ease-out
            ${noticed ? "scale-105" : "animate-[bloomIdle_3s_ease-in-out_infinite]"}
          `}
        >
          <img
            src="/assets/Bloom.svg"
            alt="Bloom"
            className="w-44 drop-shadow-lg"
          />
        </div>

        {/* WELCOME SCREEN */}
        {screen === "welcome" && (
          <>
            {!noticed && (
              <div className="absolute bottom-[39%] left-1/2 -translate-x-1/2 text-sm text-green-900/60">
                Bloom is enjoying a quiet moment...
              </div>
            )}

            <div
              className={`
                absolute left-1/2 top-[11%] z-30 w-[min(90%,420px)]
                -translate-x-1/2
                transition-all duration-1000
                ${
                  noticed
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
                }
              `}
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
                  onClick={() => setScreen("introduction")}
                  className="
                    mt-5 rounded-full bg-[#315f42] px-7 py-3
                    font-medium text-white shadow-md
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:bg-[#264d35]
                  "
                >
                  Come sit with me →
                </button>

              </div>

              <div className="mx-auto -mt-2 h-5 w-5 rotate-45 bg-white/90" />
            </div>
          </>
        )}

        {/* INTRODUCTION SCREEN */}
   {screen === "introduction" && (
  <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
    <div className="w-full max-w-lg animate-[fadeIn_0.8s_ease-out]">
      
      {/* Speech bubble style - feels like Bloom is speaking */}
      <div className="relative rounded-[2rem] bg-white/90 p-7 shadow-xl backdrop-blur-md border border-white/60">
        
        {/* Bloom's face with expression */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl animate-[bloomIdle_3s_ease-in-out_infinite]">🌱</span>
          <span className="text-sm font-medium text-[#78ad70] tracking-wide">Bloom says...</span>
        </div>

        <p className="text-2xl font-semibold text-[#234b36]">
          "I'm so glad you're here."
        </p>

        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[#78ad70]/30 to-transparent" />

        <p className="text-base leading-relaxed text-[#527060]">
          I made this place for people who are tired of wellness apps 
          that feel like work.
        </p>

        <p className="mt-3 text-base leading-relaxed text-[#527060]">
          <span className="font-medium text-[#234b36]">Here's the deal:</span>
          <br />
          You show up when you can. I'll be here when you do.
          No guilt. No pressure. Just us and this garden.
        </p>

        {/* Visual separator with icons */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#78ad70]/20" />
          <span className="text-xs text-[#78ad70] tracking-widest">✦ ✦ ✦</span>
          <div className="h-px flex-1 bg-[#78ad70]/20" />
        </div>

        {/* Values tags */}
        <div className="flex flex-wrap justify-center gap-2 text-sm text-[#527060]">
          <span className="rounded-full bg-[#dff0e6] px-4 py-1.5 shadow-sm">🌱 No streaks</span>
          <span className="rounded-full bg-[#dff0e6] px-4 py-1.5 shadow-sm">🌸 No guilt</span>
          <span className="rounded-full bg-[#dff0e6] px-4 py-1.5 shadow-sm">🌿 Just presence</span>
        </div>

        <button
          onClick={() => setScreen("understanding")}
          className="
            mt-6 w-full rounded-full bg-[#315f42] px-8 py-3.5
            font-medium text-white shadow-md
            transition-all duration-200
            hover:-translate-y-0.5 hover:bg-[#264d35]
            active:scale-95
          "
        >
          ✦ Show me how this works
        </button>

        {/* Small hint of Bloom's personality */}
        <p className="mt-3 text-xs text-[#78ad70]/60 italic">
          (I promise I don't bite. I'm just a friendly sprout.)
        </p>

      </div>

      {/* Speech bubble tail pointing toward Bloom in garden */}
      <div className="mx-auto -mt-2 h-5 w-5 rotate-45 bg-white/90 border-l border-t border-white/60" />
      
      {/* Floating atmosphere elements */}
      <div className="absolute -left-8 top-1/4 text-3xl opacity-30 animate-[float_7s_ease-in-out_infinite]">
        ✦
      </div>
      <div className="absolute -right-4 bottom-1/3 text-2xl opacity-20 animate-[float_5s_ease-in-out_infinite_reverse]">
        ✦
      </div>
    </div>
  </div>
)}

        {/* FUTURE SCREEN PLACEHOLDER */}
        {screen === "understanding" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6">

            <div className="w-full max-w-lg rounded-[2rem] bg-white/85 p-8 text-center shadow-xl backdrop-blur-md">

              <p className="text-2xl font-semibold text-[#234b36]">
                Let's get to know you.
              </p>

              <p className="mt-3 text-[#527060]">
                This is where we'll begin understanding
                what actually matters to you.
              </p>

              <button
                onClick={() => setScreen("welcome")}
                className="mt-6 text-sm text-[#315f42] underline"
              >
                Back
              </button>

            </div>

          </div>
        )}

        {/* ATMOSPHERE */}
        <div className="absolute bottom-[30%] left-[12%] text-lg animate-[float_5s_ease-in-out_infinite]">
          🦋
        </div>

        <div className="absolute bottom-[34%] right-[14%] text-lg animate-[float_6s_ease-in-out_infinite_reverse]">
          🐝
        </div>

      </section>

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
      `}</style>
    </main>
  );
}

export default App;