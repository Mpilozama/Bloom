import { useState, useEffect } from "react";
import Garden from "./components/garden/Garden";

//bloom messagw
const getBloomMessage = (capacity, completed, completionCount) => {
  if (completed) {
    const messages = [
      "🌷 You did it! Look at you, showing up for yourself.",
      "🌷 Another flower blooms because you showed up. Amazing.",
      `🌷 That's ${completionCount} times now. You're building something beautiful.`,
      "🌷 Thank you for trusting me with your garden. It's growing beautifully.",
      "🌷 Every time you show up, your garden gets a little more magical."
    ];
    return messages[completionCount % messages.length];
  }

  if (!capacity) {
    if (completionCount === 0) {
      return "🌱 Hey you. Welcome. No expectations here. Just a garden and a friend. What do you have in you today?";
    }
    if (completionCount === 1) {
      return `🌱 Look who's back! That first flower is blooming because of you. How are you feeling today?`;
    }
    if (completionCount === 2) {
      return `🌱 Two flowers now! Your garden is growing. What kind of day is today?`;
    }
    if (completionCount < 5) {
      return `🌱 ${completionCount} flowers and counting. You're building something special here. What do you need today?`;
    }
    return `🌱 Look at your beautiful garden! ${completionCount} flowers. They're all here because you showed up. What do you have in you today?`;
  }

  switch(capacity) {
    case 'little':
      return "🌱 A little is perfect. Just sit with me for a moment. That's enough.";
    case 'some':
      return "🌿 Some is beautiful. Let's do something gentle together, okay?";
    case 'time':
      return "🌸 You have time? That's lovely. Let's slow down together.";
    default:
      return "🌱 I'm here with you. Whatever you need today.";
  }
};

function App() {
  const [capacity, setCapacity] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [showGardenMessage, setShowGardenMessage] = useState(false);

  // Load saved data on start
  useEffect(() => {
    const saved = localStorage.getItem('bloom_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompletionCount(data.count || 0);
        // If they completed today, show the completed state
        if (data.lastDate === new Date().toDateString()) {
          setCompleted(true);
          setShowGardenMessage(true);
        }
      } catch (e) {
        console.log('No saved data');
      }
    }
  }, []);

  const handleComplete = () => {
    setCompleted(true);
    setShowGardenMessage(true);
    
    const newCount = completionCount + 1;
    setCompletionCount(newCount);
    
    // Save to localStorage
    localStorage.setItem('bloom_data', JSON.stringify({
      count: newCount,
      lastDate: new Date().toDateString()
    }));
  };

  const handleReset = () => {
    setCompleted(false);
    setCapacity(null);
    setShowGardenMessage(false);
    // Don't reset count - that's permanent progress!
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md text-center">

        <Garden completed={completed} completionCount={completionCount} />

        {/* Garden progress message */}
        {completionCount > 0 && !completed && (
          <div className="mt-2 text-sm text-green-600">
            🌱 {completionCount} visit{completionCount > 1 ? 's' : ''} to your garden
          </div>
        )}

        {/* BLOOM'S SPEECH BUBBLE  */}
        <div className="relative mb-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md max-w-xs mx-auto border-2 border-green-200 min-h-[60px] flex items-center justify-center">
            <p className="text-green-800 text-sm font-medium leading-relaxed">
              {getBloomMessage(capacity, completed, completionCount)}
            </p>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 border-r-2 border-b-2 border-green-200 rotate-45"></div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-900">
            Bloom
          </h1>
          <p className="mt-3 text-lg text-green-800">
            A little place to pause, breathe, and be.
          </p>
          {completionCount > 0 && (
            <p className="mt-1 text-sm text-green-600">
              {completionCount} moment{completionCount > 1 ? 's' : ''} of showing up
            </p>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-semibold text-gray-900">
            How much do you have in you today?
          </h2>
          <p className="mt-2 mb-6 text-gray-500">
            There is no right answer.
          </p>

          {!completed ? (
            <>
              <div className="space-y-3">
                <button
                  onClick={() => setCapacity("little")}
                  className="w-full rounded-2xl bg-green-100 px-5 py-4 text-green-900 font-medium hover:bg-green-200 transition transform hover:scale-[1.02]"
                >
                  🌱 A little
                </button>
                <button
                  onClick={() => setCapacity("some")}
                  className="w-full rounded-2xl bg-green-100 px-5 py-4 text-green-900 font-medium hover:bg-green-200 transition transform hover:scale-[1.02]"
                >
                  🌿 Some
                </button>
                <button
                  onClick={() => setCapacity("time")}
                  className="w-full rounded-2xl bg-green-100 px-5 py-4 text-green-900 font-medium hover:bg-green-200 transition transform hover:scale-[1.02]"
                >
                  🌸 I've got time
                </button>
              </div>

              {capacity === "little" && (
                <div className="mt-6 rounded-2xl bg-green-50 p-5 text-left animate-[fadeIn_0.3s_ease-in]">
                  <p className="text-lg font-semibold text-green-900">🐾 Let's make this tiny.</p>
                  <p className="mt-2 text-green-800">Take one slow breath. You don't have to do anything else.</p>
                  <button
                    onClick={handleComplete}
                    className="mt-4 rounded-xl bg-green-700 px-4 py-3 text-white hover:bg-green-800 transition transform hover:scale-[1.02]"
                  >
                    🌱 I did it
                  </button>
                </div>
              )}

              {capacity === "some" && (
                <div className="mt-6 rounded-2xl bg-green-50 p-5 text-left animate-[fadeIn_0.3s_ease-in]">
                  <p className="text-lg font-semibold text-green-900">🐾 Let's do something small together.</p>
                  <p className="mt-2 text-green-800">Look around and notice three things you can see.</p>
                  <button
                    onClick={handleComplete}
                    className="mt-4 rounded-xl bg-green-700 px-4 py-3 text-white hover:bg-green-800 transition transform hover:scale-[1.02]"
                  >
                    🌱 I did it
                  </button>
                </div>
              )}

              {capacity === "time" && (
                <div className="mt-6 rounded-2xl bg-green-50 p-5 text-left animate-[fadeIn_0.3s_ease-in]">
                  <p className="text-lg font-semibold text-green-900">🐾 Lovely. Let's take a little more time.</p>
                  <p className="mt-2 text-green-800">Think of one thing that made today feel difficult and one thing that helped you get through it.</p>
                  <button
                    onClick={handleComplete}
                    className="mt-4 rounded-xl bg-green-700 px-4 py-3 text-white hover:bg-green-800 transition transform hover:scale-[1.02]"
                  >
                    🌱 I did it
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center animate-[fadeIn_0.5s_ease-in]">
              <div className="text-5xl mb-3">🌷</div>
              <p className="text-xl font-semibold text-green-900">
                You did enough for today.
              </p>
              <p className="mt-2 text-green-800">
                Your garden grew because you showed up. 🌱
              </p>
              <p className="mt-1 text-sm text-green-600">
                You've visited {completionCount} time{completionCount > 1 ? 's' : ''}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 text-sm text-green-700 underline hover:text-green-900 transition"
              >
                Start again 🌱
              </button>
            </div>
          )}
        </div>

      </section>

      {/* fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default App;