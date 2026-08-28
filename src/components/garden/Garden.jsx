function Garden() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-green-100">

      {/* Sun */}
      <div className="absolute right-6 top-6 text-4xl">
        ☀️
      </div>

      {/* Trees */}
      <div className="absolute bottom-16 left-6 text-6xl">
        🌳
      </div>

      <div className="absolute bottom-16 right-8 text-6xl">
        🌳
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 h-16 w-full bg-green-200" />

      {/* Flowers */}
      <div className="absolute bottom-8 left-1/4 z-10 text-3xl">
        🌸
      </div>

      <div className="absolute bottom-10 right-1/4 z-10 text-3xl">
        🌼
      </div>

      {/* Bloom */}
      <img
        src="assets/Bloom.svg"
        alt="Bloom"
        className="absolute bottom-8 left-1/2 z-20 w-28 -translate-x-1/2"
      />

    </div>
  );
}

export default Garden;