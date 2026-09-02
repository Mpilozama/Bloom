import { useEffect, useState } from "react";

function App() {
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

        {/* Sky */}
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

        {/* Distant hills */}
        <div className="absolute bottom-[25%] left-[-10%] h-40 w-[120%] rounded-[50%] bg-[#9dcc9a]" />

        <div className="absolute bottom-[20%] left-[-15%] h-32 w-[130%] rounded-[50%] bg-[#8fbe86]" />

        {/* Trees / environment */}
        <div className="absolute bottom-[20%] left-[5%] text-7xl opacity-90">
          🌳
        </div>

        <div className="absolute bottom-[22%] right-[7%] text-8xl opacity-90">
          🌳
        </div>

        {/* Little environmental details */}
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

        {/* Ground */}
        <div className="absolute bottom-0 h-[27%] w-full bg-[#78ad70]" />

        <div className="absolute bottom-[21%] left-[20%] text-xl opacity-70">
          🌱
        </div>

        <div className="absolute bottom-[18%] left-[38%] text-xl opacity-70">
          🌱
        </div>

        <div className="absolute bottom-[20%] right-[38%] text-xl opacity-70">
          🌱
        </div>

        {/* Bloom */}
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

        {/* Bloom's initial activity hint */}
        {!noticed && (
          <div className="absolute bottom-[39%] left-1/2 -translate-x-1/2 text-sm text-green-900/60">
            Bloom is enjoying a quiet moment...
          </div>
        )}

        {/* Welcome dialogue */}
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
            <p className="text-2xl font-semibold tracking-tight text-[#234b36]">
              Oh, you're here.
            </p>

            <p className="mt-2 text-base leading-relaxed text-[#527060]">
              I was just enjoying the garden.
              <br />
              Come sit with me for a while.
            </p>

            <button
              onClick={() => alert("Screen 2 coming next")}
              className="
                mt-5 rounded-full bg-[#315f42] px-7 py-3
                font-medium text-white shadow-md
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-[#264d35]
                focus:outline-none focus:ring-4 focus:ring-[#315f42]/20
              "
            >
              Come sit with me →
            </button>
          </div>

          {/* Speech bubble tail */}
          <div className="mx-auto -mt-2 h-5 w-5 rotate-45 bg-white/90" />
        </div>

        {/* Tiny atmosphere */}
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
      `}</style>
    </main>
  );
}

export default App;