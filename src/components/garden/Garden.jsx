function Garden({ completed, completionCount = 0 }) {
  // Show more flowers based on how many times completed
  const flowers = [
    { emoji: "🌸", pos: "left-1/4 bottom-8" },
    { emoji: "🌷", pos: "left-1/2 bottom-8", show: completed },
    { emoji: "🌻", pos: "left-1/3 bottom-12", show: completed && completionCount >= 1 },
    { emoji: "🌺", pos: "right-1/3 bottom-12", show: completed && completionCount >= 1 },
    { emoji: "🌹", pos: "left-1/5 bottom-14", show: completionCount >= 2 },
    { emoji: "🌼", pos: "right-1/5 bottom-14", show: completionCount >= 2 },
    { emoji: "💐", pos: "left-2/5 bottom-20 text-4xl", show: completionCount >= 3 },
  ];

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-green-100">
      
      {/* Sun - moves based on completion */}
      <div className={`absolute right-6 top-6 text-4xl transition-all duration-1000 ${completed ? 'rotate-12 scale-110' : ''}`}>
        ☀️
      </div>

      {/* Clouds - float in */}
      <div className={`absolute left-4 top-4 text-2xl opacity-70 transition-all duration-1000 ${completed ? 'opacity-100 translate-x-4' : ''}`}>
        ☁️
      </div>
      <div className={`absolute left-2/3 top-3 text-xl opacity-50 transition-all duration-1000 delay-300 ${completed ? 'opacity-100 translate-x-2' : ''}`}>
        ☁️
      </div>

      {/* Trees */}
      <div className="absolute bottom-16 left-6 text-6xl">
        🌳
      </div>
      <div className="absolute bottom-16 right-8 text-6xl">
        🌳
      </div>

      {/* Ground - gets greener */}
      <div className={`absolute bottom-0 h-16 w-full transition-colors duration-1000 ${completed ? 'bg-green-300' : 'bg-green-200'}`} />

      {/* All flowers */}
      {flowers.map((flower, index) => (
        flower.show !== false && (
          <div 
            key={index}
            className={`absolute z-10 text-3xl ${flower.pos} transition-all duration-500 delay-${index * 100} ${completed ? 'scale-100' : 'scale-0'}`}
          >
            {flower.emoji}
          </div>
        )
      ))}

      {/* Bloom */}
      <img
        src="/assets/Bloom.svg"
        alt="Bloom"
        className={`absolute bottom-8 left-1/2 z-20 w-28 -translate-x-1/2 animate-[float_3s_ease-in-out_infinite] transition-all duration-500 ${completed ? 'scale-110' : ''}`}
      />

      {/* Sparkles when completed */}
      {completed && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 text-2xl animate-ping">✨</div>
          <div className="absolute top-1/3 right-1/4 text-xl animate-ping delay-300">✨</div>
          <div className="absolute bottom-1/3 left-1/4 text-2xl animate-ping delay-700">✨</div>
        </div>
      )}
    </div>
  );
}

export default Garden;