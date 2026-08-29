import { gardenStates } from './gardenStates';

function Garden({ completed, completionCount = 0 }) {
  // Determine which state to show (capped at 5)
  const stateIndex = Math.min(completionCount, 5);
  const state = gardenStates[stateIndex] || gardenStates[5];

  return (
    <div className={`relative h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-b ${state.background}`}>
      
      {/* Sun - different based on state */}
      <div className={`absolute right-6 top-6 text-4xl transition-all duration-1000 ${completed ? 'rotate-12 scale-110' : ''}`}>
        ☀️
      </div>

      {/* Clouds - more appear as garden grows */}
      {completionCount >= 2 && (
        <div className="absolute left-4 top-4 text-2xl opacity-70">
          ☁️
        </div>
      )}
      {completionCount >= 4 && (
        <div className="absolute left-2/3 top-3 text-xl opacity-50">
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

      {/* Ground - changes with garden state */}
      <div className={`absolute bottom-0 h-16 w-full transition-colors duration-1000 ${state.ground}`} />

      {/* Flowers from state */}
      {state.flowers.map((flower, index) => (
        <div 
          key={index}
          className={`absolute z-10 text-3xl transition-all duration-500 delay-${index * 100}`}
          style={{
            bottom: 8 + Math.random() * 10,
            left: 15 + (index * 15) + Math.random() * 10,
            transform: completed ? 'scale(1)' : 'scale(0)'
          }}
        >
          {flower}
        </div>
      ))}

      {/* Bloom */}
      <img
        src="/assets/Bloom.svg"
        alt="Bloom"
        className="absolute bottom-8 left-1/2 z-20 w-28 -translate-x-1/2 animate-[float_3s_ease-in-out_infinite]"
      />

      {/* Garden state indicator */}
      {completionCount > 0 && (
        <div className="absolute bottom-2 right-2 z-30 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-green-700">
          🌱 Level {stateIndex}
        </div>
      )}
    </div>
  );
}

export default Garden;