"use strict";
/* =====================================================================
   MAGIC TOWN — the places you can visit and what's in them
   props:   e = emoji, x/y = position in % of the room, s = size, and what it does:
            a = action when tapped, eat = can be eaten, potion = magic potion
   scenery: things painted in the background that you can't move
   ===================================================================== */
const PLACES = {
  home: {
    name: "Cozy Cottage", emoji: "🏡", card: "linear-gradient(135deg,#ffb3c8,#ff8fb8)",
    walls: ["linear-gradient(#ffd6e6,#ffc2d9)", "linear-gradient(#d6ecff,#bfe0ff)", "linear-gradient(#e8ffd6,#cdf5b8)", "linear-gradient(#fff3c2,#ffe39a)", "repeating-linear-gradient(90deg,#ffe0ef 0 30px,#ffd0e6 30px 60px)", "radial-gradient(circle at 20px 20px,#fff 3px,transparent 4px) 0 0/40px 40px,linear-gradient(#e6d6ff,#d6c2ff)"],
    floor: "repeating-linear-gradient(90deg,#c9915e 0 70px,#b98050 70px 72px)",
    scenery: [{ e: "🪟", x: 22, y: 38, s: 18 }, { e: "🖼️", x: 60, y: 30, s: 11 }, { e: "🪞", x: 86, y: 52, s: 14 }],
    props: [
      { e: "🛏️", x: 18, y: 88, s: 20, a: "sleep" }, { e: "🛋️", x: 50, y: 74, s: 18 }, { e: "💡", x: 36, y: 68, s: 10, a: "light" },
      { e: "🧸", x: 62, y: 90, s: 9, a: "hug" }, { e: "🍪", x: 72, y: 82, s: 6, eat: true }, { e: "🪴", x: 92, y: 72, s: 12 },
      { e: "📺", x: 78, y: 62, s: 12, a: "tv" }, { e: "🪄", x: 40, y: 95, s: 7, a: "sparkle" },
    ],
  },
  school: {
    name: "Wizard School", emoji: "🧙", card: "linear-gradient(135deg,#8a6bff,#5b3cc4)",
    walls: ["linear-gradient(#5b4a8a,#43356e)", "linear-gradient(#3c5a8a,#2c436e)", "repeating-linear-gradient(90deg,#6b5a3a 0 40px,#5e4f33 40px 42px)"],
    floor: "repeating-conic-gradient(#3a2d55 0 25%,#4a3b6a 0 50%) 0 0/60px 60px",
    board: { x: 50, y: 12, w: 40, h: 30, text: "Spell of the day:<br>✨ Abra-Kadabra-Sparkle! ✨" },
    scenery: [{ e: "🕯️", x: 12, y: 30, s: 10 }, { e: "🕯️", x: 88, y: 30, s: 10 }, { e: "🌙", x: 90, y: 14, s: 8 }],
    props: [
      { e: "🦉", x: 12, y: 60, s: 12, a: "owl" }, { e: "📚", x: 26, y: 88, s: 12, a: "book" }, { e: "🔮", x: 50, y: 82, s: 12, a: "orb" },
      { e: "🪄", x: 66, y: 92, s: 9, a: "sparkle" }, { e: "🧪", x: 78, y: 86, s: 8, potion: true }, { e: "🐸", x: 88, y: 94, s: 8, a: "frog" },
      { e: "🎩", x: 38, y: 95, s: 9, a: "hat" },
    ],
  },
  potion: {
    name: "Potion Shop", emoji: "🧪", card: "linear-gradient(135deg,#6fdc8c,#2fa36b)",
    walls: ["linear-gradient(#2f5a4a,#1f4035)", "linear-gradient(#4a2f5a,#351f40)", "repeating-linear-gradient(0deg,#6b4a2b 0 6px,#5a3d23 6px 34px)"],
    floor: "repeating-linear-gradient(45deg,#3d2c22 0 30px,#4a372b 30px 60px)",
    scenery: [{ e: "🍄", x: 10, y: 60, s: 10 }, { e: "🕸️", x: 92, y: 18, s: 12 }, { e: "⚗️", x: 74, y: 40, s: 9 }, { e: "🫙", x: 84, y: 40, s: 9 }, { e: "🧴", x: 64, y: 40, s: 8 }],
    shelf: { y: 40 },
    props: [
      { e: "🫕", x: 40, y: 88, s: 22, a: "cauldron" }, { e: "🧪", x: 64, y: 84, s: 9, potion: true }, { e: "🍶", x: 72, y: 90, s: 9, potion: true },
      { e: "🌿", x: 18, y: 84, s: 9, a: "sparkle" }, { e: "🐈‍⬛", x: 86, y: 92, s: 13, a: "cat" }, { e: "⭐", x: 24, y: 96, s: 7, a: "sparkle" },
    ],
  },
  cafe: {
    name: "Fairy Café", emoji: "🧁", card: "linear-gradient(135deg,#ffd580,#ff9f6b)",
    walls: ["linear-gradient(#fff0d6,#ffe0b8)", "repeating-linear-gradient(90deg,#fff 0 24px,#ffd6e6 24px 48px)", "linear-gradient(#d6f5ff,#c2ecff)"],
    floor: "repeating-conic-gradient(#fff 0 25%,#ffb3c8 0 50%) 0 0/70px 70px",
    board: { x: 70, y: 10, w: 26, h: 26, text: "🧁 Cupcakes<br>🍩 Donuts<br>🧋 Bubble tea" },
    scenery: [{ e: "🪟", x: 22, y: 36, s: 16 }, { e: "🌸", x: 8, y: 48, s: 8 }, { e: "🎀", x: 44, y: 16, s: 8 }],
    props: [
      { e: "☕", x: 44, y: 70, s: 11, a: "coffee" }, { e: "🧁", x: 24, y: 80, s: 8, eat: true }, { e: "🍩", x: 32, y: 86, s: 8, eat: true },
      { e: "🧋", x: 58, y: 82, s: 8, eat: true }, { e: "🍰", x: 70, y: 88, s: 8, eat: true }, { e: "🍓", x: 80, y: 80, s: 7, eat: true },
      { e: "🪑", x: 88, y: 94, s: 12 }, { e: "🍦", x: 14, y: 94, s: 8, eat: true },
    ],
  },
  meadow: {
    name: "Unicorn Meadow", emoji: "🦄", outdoor: true, card: "linear-gradient(135deg,#9be7ff,#8fe0a0)",
    walls: ["linear-gradient(#8fd8ff,#d6f3ff)", "linear-gradient(#ffb38a,#ffd6e0)", "linear-gradient(#1b1a4a,#3a2d7a)"],
    floor: "linear-gradient(#8fe07a,#5cc05c)",
    rainbow: true,
    scenery: [{ e: "☁️", x: 20, y: 22, s: 12 }, { e: "☁️", x: 78, y: 16, s: 10 }, { e: "🌳", x: 88, y: 66, s: 26 }, { e: "🏡", x: 12, y: 66, s: 14 }],
    props: [
      { e: "🦄", x: 50, y: 86, s: 22, a: "unicorn" }, { e: "🥕", x: 30, y: 90, s: 7, eat: true }, { e: "🍎", x: 68, y: 94, s: 7, eat: true },
      { e: "🌷", x: 18, y: 96, s: 8, a: "flower" }, { e: "🌼", x: 78, y: 84, s: 7, a: "flower" }, { e: "🦋", x: 36, y: 60, s: 7, a: "butterfly" },
      { e: "🐰", x: 86, y: 96, s: 9, a: "bunny" },
    ],
  },
  castle: {
    name: "Cloud Castle", emoji: "🏰", outdoor: true, card: "linear-gradient(135deg,#d6c2ff,#ffc2e6)",
    walls: ["linear-gradient(#c2b3ff,#ffd6f0)", "linear-gradient(#ffd6a0,#ffb3d6)", "linear-gradient(#2a1b5a,#5a3a9a)"],
    floor: "radial-gradient(circle at 30px 20px,#fff 22px,transparent 23px) 0 0/60px 40px,linear-gradient(#f4f0ff,#e6dcff)",
    scenery: [{ e: "🏰", x: 50, y: 64, s: 44 }, { e: "☁️", x: 12, y: 30, s: 12 }, { e: "☁️", x: 88, y: 20, s: 14 }, { e: "⭐", x: 30, y: 10, s: 5 }, { e: "⭐", x: 72, y: 8, s: 4 }],
    props: [
      { e: "👑", x: 22, y: 90, s: 9, a: "crown" }, { e: "🎹", x: 78, y: 86, s: 14, a: "piano" }, { e: "🪞", x: 90, y: 80, s: 12, a: "mirror" },
      { e: "🎂", x: 40, y: 96, s: 9, eat: true }, { e: "🎈", x: 10, y: 76, s: 9, a: "balloon" }, { e: "💎", x: 60, y: 96, s: 7, a: "sparkle" },
      { e: "🐉", x: 64, y: 78, s: 14, a: "dragon" },
    ],
  },
};

/* things you can add in Decorate mode */
const DECOR = ["🛋️", "🪑", "🛏️", "🪴", "🌷", "🧸", "🎀", "🕯️", "💡", "🎈", "🌈", "⭐", "🪞", "🎹", "📚", "🖼️", "🧁", "🍩", "🍓",
               "🧪", "🔮", "🪄", "🦄", "🐱", "🐶", "🐰", "🐸", "🦋", "🍄", "💎", "👑", "🎁", "☁️", "🌙", "🎂", "🧋"];
const DECOR_INFO = { "🧁": { eat: 1 }, "🍩": { eat: 1 }, "🍓": { eat: 1 }, "🎂": { eat: 1 }, "🧋": { eat: 1 }, "🧪": { potion: 1 },
                     "🪄": { a: "sparkle" }, "🔮": { a: "orb" }, "💡": { a: "light" }, "🎹": { a: "piano" }, "🪞": { a: "mirror" },
                     "🛏️": { a: "sleep" }, "🧸": { a: "hug" }, "🦄": { a: "unicorn" }, "🐱": { a: "cat" }, "🐶": { a: "dog" }, "🐰": { a: "bunny" },
                     "🐸": { a: "frog" }, "🦋": { a: "butterfly" }, "🎈": { a: "balloon" }, "🎁": { a: "gift" }, "📚": { a: "book" } };

const LINES = ["Hi there! 👋", "I love it here! 💖", "Let's go on an adventure!", "Wanna be best friends? 🥹", "Wheee! ✨", "I feel magical today!",
               "What should we do next?", "Hehe, that tickles!", "Look at my outfit! 💅", "Let's have a tea party! 🫖", "I can do a spell! 🪄", "I'm hungry 🍩"];
