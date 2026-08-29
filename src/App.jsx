import { useState } from "react";
import Garden from "./components/garden/Garden";

function App() {
  const [capacity, setCapacity] = useState(null);
  const [completed, setCompleted] = useState(false);

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md text-center">

        <Garden completed={completed} />

        {/* BLOOM'S SPEECH BUBBLE */}
        <div className="relative mb-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md max-w-xs mx-auto border-2 border-green-200">
            <p className="text-green-800 text-sm font-medium leading-relaxed">
              {!capacity && !completed && "🌱 Hey there. What do you have in you today?"}
              {capacity === "little" && !completed && "🌱 That's okay. Let's go slow together."}
              {capacity === "some" && !completed && "🌿 Perfect. Let's do something gentle."}
              {capacity === "time" && !completed && "🌸 Wonderful. Take all the time you need."}
              {completed && "🌷 You showed up. That's everything. I'm so proud of you."}
            </p>
          </div>
          
          {/* Small triangle pointing to Bloom */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 border-r-2 border-b-2 border-green-200 rotate-45"></div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-900">
            Bloom
          </h1>

          <p className="mt-3 text-lg text-green-800">
            A little place to pause, breathe, and be.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-semibold text-gray-900">
            How much do you have in you today?
          </h2>

          <p className="mt-2 mb-6 text-gray-500">
            There is no right answer.
          </p>

          {/* CAPACITY BUTTONS */}
          <div className="space-y-3">
            <button
              onClick={() => setCapacity("little")}
              className="w-full rounded-2xl bg-green-100 px-5 py-4 text-green-900 font-medium hover:bg-green-200 transition"
            >
              🌱 A little
            </button>

            <button
              onClick={() => setCapacity("some")}
              className="w-full rounded-2xl bg-green-100 px-5 py-4 text-green-900 font-medium hover:bg-green-200 transition"
            >
              🌿 Some
            </button>

            <button
              onClick={() => setCapacity("time")}
              className="w-full rounded-2xl bg-green-100 px-5 py-4 text-green-900 font-medium hover:bg-green-200 transition"
            >
              🌸 I've got time
            </button>
          </div>

          {/* LITTLE */}
          {capacity === "little" && !completed && (
            <div className="mt-6 rounded-2xl bg-green-50 p-5 text-left">
              <p className="text-lg font-semibold text-green-900">
                🐾 Let's make this tiny.
              </p>

              <p className="mt-2 text-green-800">
                Take one slow breath. You don't have to do anything else.
              </p>

              <button
                onClick={() => setCompleted(true)}
                className="mt-4 rounded-xl bg-green-100 px-4 py-3 text-green-800 border-2 border-green-300 hover:bg-green-200 transition"
              >
                🌱 I did it
              </button>
            </div>
          )}

          {/* SOME */}
          {capacity === "some" && !completed && (
            <div className="mt-6 rounded-2xl bg-green-50 p-5 text-left">
              <p className="text-lg font-semibold text-green-900">
                🐾 Let's do something small together.
              </p>

              <p className="mt-2 text-green-800">
                Look around and notice three things you can see.
              </p>

              <button
                onClick={() => setCompleted(true)}
                className="mt-4 rounded-xl bg-green-100 px-4 py-3 text-green-800 border-2 border-green-300 hover:bg-green-200 transition"
              >
                🌱 I did it
              </button>
            </div>
          )}

          {/* TIME */}
          {capacity === "time" && !completed && (
            <div className="mt-6 rounded-2xl bg-green-50 p-5 text-left">
              <p className="text-lg font-semibold text-green-900">
                🐾 Lovely. Let's take a little more time.
              </p>

              <p className="mt-2 text-green-800">
                Think of one thing that made today feel difficult and one
                thing that helped you get through it.
              </p>

              <button
                onClick={() => setCompleted(true)}
                className="mt-4 rounded-xl bg-green-100 px-4 py-3 text-green-800 border-2 border-green-300 hover:bg-green-200 transition"
              >
                🌱 I did it
              </button>
            </div>
          )}

          {/* COMPLETION MESSAGE */}
          {completed && (
            <div className="mt-6 rounded-2xl bg-green-100 p-5 text-center">
              <p className="text-2xl">🐾</p>
              <p className="mt-2 text-lg font-semibold text-green-900">
                You did enough for today.
              </p>
              <p className="mt-1 text-green-800">
                Your garden grew because you showed up. 🌱
              </p>
              <button
                onClick={() => {
                  setCompleted(false);
                  setCapacity(null);
                }}
                className="mt-4 text-sm text-green-700 underline hover:text-green-900 transition"
              >
                Start again 🌱
              </button>
            </div>
          )}

        </div>

      </section>
    </main>
  );
}

export default App;