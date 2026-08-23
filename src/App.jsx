import { useState } from "react";

function App() {
  const [capacity, setCapacity] = useState(null);

  return (
    <main>
      <h1>Welcome to Bloom 🌸</h1>

      <p>How much do you have in you today?</p>

      <button onClick={() => setCapacity("little")}>
        A little
      </button>

      <button onClick={() => setCapacity("some")}>
        Some
      </button>

      <button onClick={() => setCapacity("time")}>
        I've got time
      </button>

      {capacity === "little" && (
        <p>🐾 That's okay. We can keep it tiny today.</p>
      )}

      {capacity === "some" && (
        <p>🐾 Okay. Let's find something that feels manageable.</p>
      )}

      {capacity === "time" && (
        <p>🐾 Lovely. We can explore a little more together.</p>
      )}
    </main>
  );
}

export default App;