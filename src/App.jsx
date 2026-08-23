
import Garden from "./components/garden/Garden";
import { useState } from "react";

function App() {
  const [capacity, setCapacity] = useState(null);

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md text-center">

        <Garden />

        <div className="mb-8">
          <div className="text-7xl mb-4">
            🐾
          </div>

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

          {capacity === "little" && (
            <p className="mt-6 text-green-800">
              🐾 That's okay. We can keep it tiny today.
            </p>
          )}

          {capacity === "some" && (
            <p className="mt-6 text-green-800">
              🐾 Okay. Let's find something that feels manageable.
            </p>
          )}

          {capacity === "time" && (
            <p className="mt-6 text-green-800">
              🐾 Lovely. We can explore a little more together.
            </p>
          )}

        </div>

      </section>
    </main>
  );
}

export default App;