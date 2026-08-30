function Garden({ completed, completionCount = 0 }) {
  const stateIndex = Math.min(completionCount, 5);
  
  // Get flowers based on count - THIS IS THE KEY
  const flowerPositions = [
    { emoji: '🌸', bottom: 8, left: 15 },
    { emoji: '🌷', bottom: 10, left: 35 },
    { emoji: '🌻', bottom: 12, left: 55 },
    { emoji: '🌺', bottom: 8, left: 75 },
    { emoji: '🌹', bottom: 14, left: 25 },
    { emoji: '🌼', bottom: 10, left: 65 },
  ];

  // This determines how many flowers to show
  const flowersToShow = Math.min(completionCount + 1, flowerPositions.length);

  const backgrounds = [
    'from-sky-100 to-green-100',
    'from-sky-100 to-green-200',
    'from-sky-200 to-green-300',
    'from-amber-100 to-green-300',
    'from-amber-200 to-green-400',
    'from-pink-100 to-green-400'
  ];
  
  const groundColors = [
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-400',
    'bg-green-500',
    'bg-green-500'
  ];

  return (
    <div className={`relative h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-b ${backgrounds[stateIndex]}`}>
      
      {/* Sun - changes color based on progress */}
      <div className={`absolute right-6 top-6 transition-all duration-1000 ${completed ? 'scale-110' : ''}`}>
        <span className={`text-4xl ${completionCount >= 3 ? 'text-yellow-400' : ''}`}>
          ☀️
        </span>
      </div>

      {/* Clouds - appear as garden grows */}
      {completionCount >= 2 && (
        <div className="absolute left-4 top-4 text-2xl opacity-70 animate-[float_8s_ease-in-out_infinite]">
          ☁️
        </div>
      )}
      {completionCount >= 4 && (
        <div className="absolute left-2/3 top-3 text-xl opacity-50 animate-[float_10s_ease-in-out_infinite]">
          ☁️
        </div>
      )}

      {/* Trees */}
      <div className="absolute bottom-16 left-6 text-6xl">
        🌳
      </div>
      <div className="absolute bottom-16 right-8 text-6xl">
        🌳
      </div>

      {/* Ground */}
      <div className={`absolute bottom-0 h-16 w-full transition-colors duration-1000 ${groundColors[stateIndex]}`} />

      {/* FLOWERS - THIS IS WHERE THEY RENDER */}
      {flowerPositions.slice(0, flowersToShow).map((flower, index) => (
        <div 
          key={index}
          className={`absolute z-10 text-3xl transition-all duration-500 ${completed ? 'scale-100' : 'scale-100'}`}
          style={{
            bottom: `${flower.bottom}%`,
            left: `${flower.left}%`,
          }}
        >
          {flower.emoji}
        </div>
      ))}

      {/* Bloom */}
      <img
        src="/assets/Bloom.svg"
        alt="Bloom"
        className="absolute bottom-8 left-1/2 z-20 w-28 -translate-x-1/2 animate-[float_3s_ease-in-out_infinite]"
      />

      {/* Level indicator */}
      {completionCount > 0 && (
        <div className="absolute bottom-2 right-2 z-30 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-green-700">
          🌱 Level {stateIndex + 1}
        </div>
      )}
    </div>
  );
}

export default Garden;