// Garden states based on completion count.
// Every message here is written to be encouraging at every stage —
// including stage 0. A garden that hasn't grown yet is never framed
// as behind, lacking, or something to feel bad about.
export const gardenStates = {
  0: {
    background: "from-sky-200 via-emerald-50 to-lime-100",
    ground: "bg-gradient-to-t from-lime-400 to-lime-300",
    flowers: [],
    butterflies: 0,
    message: "Every garden starts as a seed.",
  },
  1: {
    background: "from-sky-200 via-emerald-100 to-lime-200",
    ground: "bg-gradient-to-t from-lime-500 to-lime-400",
    flowers: ["🌸"],
    butterflies: 0,
    message: "Something's here now.",
  },
  2: {
    background: "from-sky-300 via-emerald-100 to-lime-200",
    ground: "bg-gradient-to-t from-green-500 to-lime-400",
    flowers: ["🌸", "🌷"],
    butterflies: 1,
    message: "It's taking shape.",
  },
  3: {
    background: "from-amber-100 via-emerald-100 to-lime-300",
    ground: "bg-gradient-to-t from-green-500 to-lime-400",
    flowers: ["🌸", "🌷", "🌻"],
    butterflies: 1,
    message: "Look at all this color.",
  },
  4: {
    background: "from-amber-200 via-rose-50 to-lime-300",
    ground: "bg-gradient-to-t from-green-600 to-lime-500",
    flowers: ["🌸", "🌷", "🌻", "🌺"],
    butterflies: 2,
    message: "This is really coming along.",
  },
  5: {
    background: "from-fuchsia-100 via-amber-100 to-lime-300",
    ground: "bg-gradient-to-t from-green-600 to-lime-500",
    flowers: ["🌸", "🌷", "🌻", "🌺", "🌹", "🌼"],
    butterflies: 3,
    message: "A garden that's fully yours.",
  },
};
