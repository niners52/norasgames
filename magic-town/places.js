"use strict";
/* =====================================================================
   MAGIC TOWN — every place, every room, and the houses you can pick
   props:   e = emoji, x/y = spot in the room (%), s = size, and what it does:
            a = action when tapped, eat = food, potion = magic potion
   scenery: painted in the background, can't be moved
   ===================================================================== */
const PLANKS  = "repeating-linear-gradient(90deg,#c9915e 0 70px,#b98050 70px 72px)";
const CARPET  = "radial-gradient(circle at 12px 12px,#ffd0e6 2px,transparent 3px) 0 0/24px 24px,linear-gradient(#ffb3d1,#ff9cc4)";
const TILES   = "repeating-conic-gradient(#fff 0 25%,#dbeeff 0 50%) 0 0/50px 50px";
const CHECK   = "repeating-conic-gradient(#fff 0 25%,#ffb3c8 0 50%) 0 0/70px 70px";
const STONE   = "repeating-conic-gradient(#3a2d55 0 25%,#4a3b6a 0 50%) 0 0/60px 60px";
const GOLD    = "repeating-conic-gradient(#ffe39a 0 25%,#ffd06b 0 50%) 0 0/60px 60px";
const GRASS   = "linear-gradient(#8fe07a,#5cc05c)";
const HAY     = "repeating-linear-gradient(100deg,#e8c55a 0 6px,#d9b44a 6px 12px)";
const CLOUDS  = "radial-gradient(circle at 30px 20px,#fff 22px,transparent 23px) 0 0/60px 40px,linear-gradient(#f4f0ff,#e6dcff)";

const PLACES = {
  home: {
    name: "Cozy Cottage", emoji: "🏡", card: "linear-gradient(135deg,#ffb3c8,#ff8fb8)",
    rooms: [
      { id: "living", name: "Living Room", emoji: "🛋️",
        walls: ["linear-gradient(#ffd6e6,#ffc2d9)", "linear-gradient(#d6ecff,#bfe0ff)", "linear-gradient(#e8ffd6,#cdf5b8)", "repeating-linear-gradient(90deg,#ffe0ef 0 30px,#ffd0e6 30px 60px)"],
        floor: PLANKS,
        scenery: [{ e: "🪟", x: 22, y: 38, s: 18 }, { e: "🖼️", x: 60, y: 30, s: 11 }],
        props: [{ e: "🛋️", x: 50, y: 74, s: 18, a: "sofa" }, { e: "📺", x: 80, y: 64, s: 12, a: "tv" }, { e: "💡", x: 34, y: 70, s: 10, a: "light" },
                { e: "🧸", x: 60, y: 94, s: 9, a: "hug" }, { k: "table", key: "t1", x: 78, y: 95 }, { e: "🍪", on: "t1", dx: -5, s: 6, eat: true },
                { e: "🌷", on: "t1", dx: 5, s: 7, a: "flower" }, { e: "🪴", x: 94, y: 74, s: 12 },
                { e: "🪄", x: 40, y: 96, s: 7, a: "sparkle" }] },
      { id: "bedroom", name: "Bedroom", emoji: "🛏️",
        walls: ["linear-gradient(#e6d6ff,#d6c2ff)", "radial-gradient(circle at 20px 20px,#fff 3px,transparent 4px) 0 0/40px 40px,linear-gradient(#ffd6ec,#ffc2e0)", "linear-gradient(#cfefff,#b3e3ff)"],
        floor: CARPET,
        scenery: [{ e: "🪟", x: 70, y: 36, s: 16 }, { e: "⭐", x: 30, y: 20, s: 6 }, { e: "🌙", x: 44, y: 16, s: 6 }],
        props: [{ e: "🛏️", x: 30, y: 88, s: 24, a: "sleep" }, { k: "nightstand", key: "n1", x: 56, y: 94 }, { e: "💡", on: "n1", dx: 0, s: 8, a: "light" },
                { e: "🪞", x: 90, y: 68, s: 14, a: "mirror" }, { k: "shelf", key: "s1", x: 70, y: 52 }, { e: "📚", on: "s1", dx: -4, s: 8, a: "book" },
                { e: "🎀", on: "s1", dx: 5, s: 6, a: "sparkle" }, { e: "🧸", x: 78, y: 96, s: 9, a: "hug" }] },
      { id: "kitchen", name: "Kitchen", emoji: "🍳",
        walls: ["repeating-conic-gradient(#fff 0 25%,#d8f5e6 0 50%) 0 0/40px 40px", "linear-gradient(#fff3c2,#ffe39a)", "linear-gradient(#ffe0d6,#ffcdbd)"],
        floor: CHECK,
        scenery: [{ e: "🪟", x: 50, y: 34, s: 16 }, { e: "🧲", x: 84, y: 30, s: 6 }],
        props: [{ k: "counter", key: "c1", x: 28, y: 90 }, { e: "🍳", on: "c1", dx: -8, s: 10, a: "cook" }, { e: "🫖", on: "c1", dx: 7, s: 9, a: "tea" },
                { e: "🧁", on: "c1", dx: 0, s: 7, eat: true }, { k: "table", key: "t2", x: 72, y: 95 }, { e: "🥞", on: "t2", dx: -5, s: 8, eat: true },
                { e: "🍕", on: "t2", dx: 5, s: 8, eat: true }, { e: "🍎", x: 52, y: 96, s: 7, eat: true }, { e: "🥛", x: 92, y: 90, s: 8, eat: true }] },
      { id: "bathroom", name: "Bathroom", emoji: "🛁",
        walls: ["repeating-conic-gradient(#e6f7ff 0 25%,#c8ecff 0 50%) 0 0/44px 44px", "linear-gradient(#e8fff4,#c8f5e0)", "linear-gradient(#ffe6f2,#ffd0e6)"],
        floor: TILES,
        scenery: [{ e: "🪞", x: 26, y: 42, s: 14 }, { e: "🪟", x: 76, y: 32, s: 12 }],
        props: [{ e: "🛁", x: 34, y: 90, s: 26, a: "bath" }, { e: "🚽", x: 82, y: 90, s: 16, a: "flush" }, { k: "shelf", key: "s1", x: 60, y: 52 },
                { e: "🧼", on: "s1", dx: -5, s: 7, a: "soap" }, { e: "🪥", on: "s1", dx: 5, s: 7, a: "brush" }, { e: "🦆", x: 58, y: 96, s: 8, a: "duck" }] },
    ],
  },

  school: {
    name: "Wizard School", emoji: "🧙", card: "linear-gradient(135deg,#8a6bff,#5b3cc4)",
    rooms: [
      { id: "classroom", name: "Classroom", emoji: "🪄",
        walls: ["linear-gradient(#5b4a8a,#43356e)", "linear-gradient(#3c5a8a,#2c436e)", "repeating-linear-gradient(90deg,#6b5a3a 0 40px,#5e4f33 40px 42px)"],
        floor: STONE,
        board: { x: 50, y: 12, w: 40, h: 30, text: "Spell of the day:<br>✨ Abra-Kadabra-Sparkle! ✨" },
        scenery: [{ e: "🕯️", x: 12, y: 30, s: 10 }, { e: "🕯️", x: 88, y: 30, s: 10 }],
        props: [{ e: "🦉", x: 12, y: 60, s: 12, a: "owl" }, { e: "📚", x: 26, y: 88, s: 12, a: "book" }, { e: "🔮", x: 50, y: 82, s: 12, a: "orb" },
                { e: "🪄", x: 66, y: 92, s: 9, a: "sparkle" }, { e: "🧪", x: 78, y: 86, s: 8, potion: true }, { e: "🐸", x: 88, y: 94, s: 8, a: "frog" },
                { e: "🎩", x: 38, y: 95, s: 9, a: "hat" }] },
      { id: "library", name: "Library", emoji: "📚",
        walls: ["repeating-linear-gradient(0deg,#6b4a2b 0 8px,#5a3d23 8px 60px)", "linear-gradient(#4a3a6a,#35284f)"],
        floor: "repeating-linear-gradient(90deg,#7a4e2c 0 60px,#6b4426 60px 62px)",
        scenery: [{ e: "📚", x: 14, y: 30, s: 12 }, { e: "📚", x: 34, y: 30, s: 12 }, { e: "📚", x: 66, y: 30, s: 12 }, { e: "📚", x: 86, y: 30, s: 12 },
                  { e: "📚", x: 24, y: 52, s: 12 }, { e: "📚", x: 76, y: 52, s: 12 }],
        props: [{ k: "table", key: "t4", x: 52, y: 94 }, { e: "📖", on: "t4", dx: -4, s: 10, a: "book" }, { e: "🕯️", on: "t4", dx: 6, s: 8, a: "sparkle" }, { e: "🦉", x: 50, y: 56, s: 11, a: "owl" },
                { e: "🔭", x: 84, y: 90, s: 14, a: "telescope" }, { e: "🌍", x: 32, y: 95, s: 10, a: "globe" }, { e: "🪄", x: 64, y: 96, s: 7, a: "sparkle" }] },
      { id: "hall", name: "Great Hall", emoji: "🍽️",
        walls: ["linear-gradient(#6a4a8a,#4a3268)", "linear-gradient(#8a4a5a,#683240)"],
        floor: STONE,
        scenery: [{ e: "🕯️", x: 18, y: 16, s: 7 }, { e: "🕯️", x: 36, y: 12, s: 7 }, { e: "🕯️", x: 56, y: 18, s: 7 }, { e: "🕯️", x: 76, y: 12, s: 7 }, { e: "🕯️", x: 90, y: 20, s: 7 }],
        props: [{ e: "🍗", x: 30, y: 86, s: 9, eat: true }, { e: "🥧", x: 46, y: 90, s: 9, eat: true }, { e: "🍇", x: 62, y: 86, s: 8, eat: true },
                { e: "🧃", x: 76, y: 92, s: 8, eat: true }, { e: "🎂", x: 54, y: 97, s: 9, eat: true }, { e: "🪑", x: 14, y: 95, s: 12, a: "sofa" },
                { e: "🔔", x: 88, y: 66, s: 10, a: "bell" }] },
    ],
  },

  potion: {
    name: "Potion Shop", emoji: "🧪", card: "linear-gradient(135deg,#6fdc8c,#2fa36b)",
    rooms: [
      { id: "shop", name: "Shop", emoji: "🧪",
        walls: ["linear-gradient(#2f5a4a,#1f4035)", "linear-gradient(#4a2f5a,#351f40)", "repeating-linear-gradient(0deg,#6b4a2b 0 6px,#5a3d23 6px 34px)"],
        floor: "repeating-linear-gradient(45deg,#3d2c22 0 30px,#4a372b 30px 60px)",
        shelf: { y: 40 },
        scenery: [{ e: "🍄", x: 10, y: 60, s: 10 }, { e: "🕸️", x: 92, y: 18, s: 12 }, { e: "⚗️", x: 74, y: 40, s: 9 }, { e: "🫙", x: 84, y: 40, s: 9 }, { e: "🧴", x: 64, y: 40, s: 8 }],
        props: [{ e: "🫕", x: 40, y: 88, s: 22, a: "cauldron" }, { e: "🧪", x: 64, y: 84, s: 9, potion: true }, { e: "🍶", x: 72, y: 90, s: 9, potion: true },
                { e: "🌿", x: 18, y: 84, s: 9, a: "sparkle" }, { e: "🐈‍⬛", x: 86, y: 92, s: 13, a: "cat" }, { e: "⭐", x: 24, y: 96, s: 7, a: "sparkle" }] },
      { id: "lab", name: "Secret Lab", emoji: "⚗️",
        walls: ["repeating-linear-gradient(0deg,#2a4a3a 0 28px,#22402f 28px 30px)", "linear-gradient(#2a2250,#1a1538)"],
        floor: STONE,
        scenery: [{ e: "⚗️", x: 30, y: 40, s: 10 }, { e: "🧬", x: 70, y: 30, s: 10 }, { e: "🕸️", x: 8, y: 16, s: 10 }],
        props: [{ e: "🫕", x: 50, y: 90, s: 24, a: "cauldron" }, { e: "🧪", x: 24, y: 86, s: 9, potion: true }, { e: "🧪", x: 74, y: 92, s: 9, potion: true },
                { e: "🍄", x: 12, y: 95, s: 9, a: "sparkle" }, { e: "🦇", x: 84, y: 54, s: 10, a: "bat" }, { e: "🔮", x: 88, y: 90, s: 11, a: "orb" }] },
    ],
  },

  cafe: {
    name: "Fairy Café", emoji: "🧁", card: "linear-gradient(135deg,#ffd580,#ff9f6b)",
    rooms: [
      { id: "cafe", name: "Café", emoji: "🧁",
        walls: ["linear-gradient(#fff0d6,#ffe0b8)", "repeating-linear-gradient(90deg,#fff 0 24px,#ffd6e6 24px 48px)", "linear-gradient(#d6f5ff,#c2ecff)"],
        floor: CHECK,
        board: { x: 70, y: 10, w: 26, h: 26, text: "🧁 Cupcakes<br>🍩 Donuts<br>🧋 Bubble tea" },
        scenery: [{ e: "🪟", x: 22, y: 36, s: 16 }, { e: "🌸", x: 8, y: 48, s: 8 }, { e: "🎀", x: 44, y: 16, s: 8 }],
        props: [{ k: "table", key: "t3", x: 46, y: 93 }, { e: "☕", on: "t3", dx: -5, s: 9, a: "coffee" }, { e: "🍰", on: "t3", dx: 5, s: 8, eat: true },
                { k: "counter", key: "c3", x: 20, y: 86 }, { e: "🧁", on: "c3", dx: -6, s: 8, eat: true }, { e: "🍩", on: "c3", dx: 6, s: 8, eat: true },
                { e: "🧋", x: 66, y: 90, s: 8, eat: true }, { e: "🍓", x: 76, y: 84, s: 7, eat: true },
                { e: "🪑", x: 88, y: 95, s: 12, a: "sofa" }, { e: "🍦", x: 14, y: 95, s: 8, eat: true }] },
      { id: "bakery", name: "Bakery Kitchen", emoji: "🥐",
        walls: ["linear-gradient(#fff8e6,#ffecc2)", "repeating-conic-gradient(#fff 0 25%,#ffe6cc 0 50%) 0 0/40px 40px"],
        floor: PLANKS,
        scenery: [{ e: "🪟", x: 70, y: 34, s: 14 }, { e: "🧺", x: 20, y: 44, s: 9 }],
        props: [{ k: "counter", key: "c2", x: 40, y: 92 }, { e: "🍳", on: "c2", dx: -11, s: 10, a: "cook" }, { e: "🥐", on: "c2", dx: -3, s: 8, eat: true },
                { e: "🍞", on: "c2", dx: 4, s: 8, eat: true }, { e: "🥧", on: "c2", dx: 11, s: 8, eat: true }, { e: "🍪", x: 76, y: 95, s: 7, eat: true },
                { e: "🧁", x: 88, y: 88, s: 8, eat: true }, { k: "shelf", key: "s2", x: 24, y: 50 }, { e: "🫖", on: "s2", dx: 0, s: 9, a: "tea" }] },
    ],
  },

  meadow: {
    name: "Unicorn Meadow", emoji: "🦄", card: "linear-gradient(135deg,#9be7ff,#8fe0a0)",
    rooms: [
      { id: "meadow", name: "Meadow", emoji: "🌈",
        walls: ["linear-gradient(#8fd8ff,#d6f3ff)", "linear-gradient(#ffb38a,#ffd6e0)", "linear-gradient(#1b1a4a,#3a2d7a)"],
        floor: GRASS, rainbow: true,
        scenery: [{ e: "☁️", x: 20, y: 22, s: 12 }, { e: "☁️", x: 78, y: 16, s: 10 }, { e: "🌳", x: 88, y: 66, s: 26 }, { e: "🏡", x: 12, y: 66, s: 14 }],
        props: [{ art: "unicorn", x: 50, y: 92, a: "unicorn" }, { e: "🥕", x: 30, y: 90, s: 7, eat: true }, { e: "🍎", x: 68, y: 94, s: 7, eat: true },
                { e: "🌷", x: 18, y: 96, s: 8, a: "flower" }, { e: "🌼", x: 78, y: 84, s: 7, a: "flower" }, { e: "🦋", x: 36, y: 60, s: 7, a: "butterfly" },
                { e: "🐰", x: 86, y: 96, s: 9, a: "bunny" }, { e: "🪁", x: 64, y: 40, s: 10, a: "kite" }] },
      { id: "stable", name: "Unicorn Stable", emoji: "🐴",
        walls: ["repeating-linear-gradient(90deg,#b5452f 0 46px,#9e3a27 46px 48px)", "repeating-linear-gradient(90deg,#9a6b3f 0 46px,#875c34 46px 48px)"],
        floor: HAY,
        scenery: [{ e: "🪟", x: 50, y: 34, s: 14 }, { e: "🧺", x: 88, y: 50, s: 9 }],
        props: [{ art: "horse", x: 26, y: 92, a: "horse" }, { art: "unicorn", x: 72, y: 92, a: "unicorn" }, { e: "🥕", x: 48, y: 95, s: 7, eat: true },
                { e: "🍎", x: 12, y: 96, s: 7, eat: true }, { e: "🌾", x: 90, y: 94, s: 12, a: "sparkle" }, { e: "🐓", x: 58, y: 70, s: 9, a: "rooster" }] },
    ],
  },

  castle: {
    name: "Cloud Castle", emoji: "🏰", card: "linear-gradient(135deg,#d6c2ff,#ffc2e6)",
    rooms: [
      { id: "gate", name: "Castle Gate", emoji: "🏰",
        walls: ["linear-gradient(#c2b3ff,#ffd6f0)", "linear-gradient(#ffd6a0,#ffb3d6)", "linear-gradient(#2a1b5a,#5a3a9a)"],
        floor: CLOUDS,
        scenery: [{ e: "🏰", x: 50, y: 64, s: 44 }, { e: "☁️", x: 12, y: 30, s: 12 }, { e: "☁️", x: 88, y: 20, s: 14 }, { e: "⭐", x: 30, y: 10, s: 5 }],
        props: [{ e: "👑", x: 22, y: 90, s: 9, a: "crown" }, { e: "🎈", x: 10, y: 76, s: 9, a: "balloon" }, { e: "💎", x: 60, y: 96, s: 7, a: "sparkle" },
                { e: "🐉", x: 80, y: 84, s: 14, a: "dragon" }, { e: "🎂", x: 40, y: 96, s: 9, eat: true }] },
      { id: "throne", name: "Throne Room", emoji: "👑",
        walls: ["linear-gradient(#b0305a,#801a40)", "linear-gradient(#6a3ab0,#4a2080)"],
        floor: GOLD,
        scenery: [{ e: "🕯️", x: 14, y: 32, s: 10 }, { e: "🕯️", x: 86, y: 32, s: 10 }, { e: "👑", x: 50, y: 14, s: 9 }],
        props: [{ e: "🪑", x: 50, y: 80, s: 22, a: "throne" }, { e: "👑", x: 24, y: 94, s: 9, a: "crown" }, { e: "🐉", x: 82, y: 88, s: 14, a: "dragon" },
                { e: "💎", x: 36, y: 97, s: 7, a: "sparkle" }, { e: "🎺", x: 66, y: 95, s: 9, a: "trumpet" }] },
      { id: "ballroom", name: "Ballroom", emoji: "🪩",
        walls: ["linear-gradient(#ffd6f0,#ffb3e0)", "linear-gradient(#ffe9a8,#ffd06b)"],
        floor: "linear-gradient(135deg,#fff 0%,#e6dcff 50%,#fff 100%)",
        scenery: [{ e: "🕯️", x: 12, y: 30, s: 9 }, { e: "🕯️", x: 88, y: 30, s: 9 }],
        props: [{ e: "🪩", x: 50, y: 26, s: 12, a: "disco" }, { e: "🎹", x: 18, y: 88, s: 16, a: "piano" }, { e: "🎻", x: 82, y: 92, s: 10, a: "violin" },
                { e: "🎂", x: 60, y: 97, s: 9, eat: true }, { e: "🎈", x: 92, y: 74, s: 9, a: "balloon" }, { e: "🧃", x: 40, y: 96, s: 7, eat: true }] },
      { id: "royalbed", name: "Princess Bedroom", emoji: "👸",
        walls: ["linear-gradient(#f0d6ff,#e0c2ff)", "radial-gradient(circle at 20px 20px,#fff 3px,transparent 4px) 0 0/40px 40px,linear-gradient(#ffd6ec,#ffc2e0)"],
        floor: CARPET,
        scenery: [{ e: "🪟", x: 64, y: 34, s: 14 }, { e: "✨", x: 30, y: 20, s: 7 }],
        props: [{ e: "🛏️", x: 34, y: 88, s: 26, a: "sleep" }, { e: "🪞", x: 82, y: 70, s: 14, a: "mirror" }, { e: "👗", x: 64, y: 93, s: 12, a: "dress" },
                { e: "🧸", x: 14, y: 95, s: 9, a: "hug" }, { e: "💡", x: 92, y: 92, s: 9, a: "light" }] },
    ],
  },
};

/* the empty lot where your own house goes */
const LOT = {
  id: "lot", name: "Empty Lot", emoji: "🪧",
  walls: ["linear-gradient(#9fe0ff,#dff5ff)"], floor: GRASS,
  board: { x: 50, y: 14, w: 42, h: 18, text: "🏠 Your house goes here!<br>Tap the sign 🪧" },
  scenery: [{ e: "☁️", x: 16, y: 40, s: 11 }, { e: "☁️", x: 84, y: 36, s: 9 }, { e: "🌳", x: 10, y: 68, s: 22 }, { e: "🌳", x: 90, y: 68, s: 24 }],
  props: [{ e: "🪧", x: 50, y: 82, s: 22, a: "sign" }, { e: "🌷", x: 30, y: 95, s: 7, a: "flower" }, { e: "🌼", x: 70, y: 93, s: 7, a: "flower" }],
};

/* houses you can pick */
const HOUSE_STYLES = {
  candy: { name: "Candy House", emoji: "🍭", desc: "Lollipops and chocolate floors", card: "linear-gradient(135deg,#ffb3d9,#ffd6a0)",
    walls: ["linear-gradient(#ffd6ec,#ffc2e0)", "repeating-linear-gradient(90deg,#fff 0 24px,#ff9ccf 24px 48px)",
            "repeating-linear-gradient(45deg,#fff3c2 0 20px,#ffe08a 20px 40px)", "radial-gradient(circle at 15px 15px,#fff 4px,transparent 5px) 0 0/30px 30px,linear-gradient(#b3ecff,#9be0ff)"],
    floor: "repeating-conic-gradient(#7a4526 0 25%,#9a5a33 0 50%) 0 0/60px 60px",
    scenery: [{ e: "🍭", x: 8, y: 24, s: 10 }, { e: "🍬", x: 92, y: 18, s: 8 }], accents: ["🍬", "🍫"] },
  tree: { name: "Treehouse", emoji: "🌳", desc: "Way up high in a giant tree", card: "linear-gradient(135deg,#a8d88a,#9a6b3f)",
    walls: ["repeating-linear-gradient(90deg,#9a6b3f 0 46px,#875c34 46px 48px)", "linear-gradient(#cdeeb0,#a8d88a)",
            "repeating-linear-gradient(0deg,#b07a45 0 22px,#9a6b3f 22px 24px)", "linear-gradient(#bfe8d0,#9fd6b8)"],
    floor: "repeating-linear-gradient(90deg,#6e4a2a 0 60px,#5e3f23 60px 62px)",
    scenery: [{ e: "🍃", x: 8, y: 22, s: 9 }, { e: "🪺", x: 90, y: 26, s: 9 }], accents: ["🍄", "🐿️"] },
  mushroom: { name: "Mushroom Cottage", emoji: "🍄", desc: "A cozy red mushroom home", card: "linear-gradient(135deg,#ff6b6b,#ffe8bd)",
    walls: ["radial-gradient(circle at 25px 25px,#fff 9px,transparent 10px) 0 0/70px 70px,linear-gradient(#ff6b6b,#e84a4a)", "linear-gradient(#fff4dc,#ffe8bd)",
            "linear-gradient(#e6f5c8,#d0eba6)", "radial-gradient(circle at 20px 20px,#fff 6px,transparent 7px) 0 0/50px 50px,linear-gradient(#ffb3b3,#ff9a9a)"],
    floor: "linear-gradient(#6fbf5a,#4f9e3f)",
    scenery: [{ e: "🐌", x: 8, y: 58, s: 8 }, { e: "🐞", x: 90, y: 24, s: 7 }], accents: ["🌼", "🍄"] },
  ice: { name: "Ice Palace", emoji: "❄️", desc: "Sparkly snow and shiny ice", card: "linear-gradient(135deg,#bfe8ff,#e6f7ff)",
    walls: ["linear-gradient(#e6f7ff,#bfe8ff)", "linear-gradient(#d8e6ff,#b8ccff)", "repeating-linear-gradient(60deg,#e6f7ff 0 30px,#d0efff 30px 60px)", "linear-gradient(#c8f0ff,#a0e0ff)"],
    floor: "linear-gradient(#f4fbff,#d6f0ff)",
    scenery: [{ e: "❄️", x: 8, y: 22, s: 9 }, { e: "❄️", x: 92, y: 30, s: 7 }], accents: ["⛄", "🐧"] },
  beach: { name: "Beach House", emoji: "🐚", desc: "Seashells and an ocean breeze", card: "linear-gradient(135deg,#8fe3da,#f4dca0)",
    walls: ["linear-gradient(#bff3ee,#8fe3da)", "repeating-linear-gradient(90deg,#fff 0 30px,#9fdcff 30px 60px)", "linear-gradient(#fff1d0,#ffe0a8)", "linear-gradient(#c8fff0,#a0f0dc)"],
    floor: "linear-gradient(#f4dca0,#e6c47e)",
    scenery: [{ e: "🌴", x: 6, y: 62, s: 14 }, { e: "🐚", x: 92, y: 24, s: 8 }], accents: ["🐚", "🦀"] },
  star: { name: "Star Tower", emoji: "🌙", desc: "A tower up in the night sky", card: "linear-gradient(135deg,#2a1b5a,#6a4ab0)",
    walls: ["radial-gradient(circle at 20px 30px,#fff 1.5px,transparent 2.5px) 0 0/60px 60px,linear-gradient(#2a1b5a,#4a2f8a)",
            "radial-gradient(circle at 30px 20px,#ffe066 2px,transparent 3px) 0 0/70px 70px,linear-gradient(#1b1a4a,#3a2d7a)",
            "linear-gradient(#3a2d7a,#5a45a8)", "radial-gradient(circle at 20px 20px,#fff 1.5px,transparent 2.5px) 0 0/40px 40px,linear-gradient(#26305a,#3a4a8a)"],
    floor: "repeating-conic-gradient(#2a2250 0 25%,#3a3070 0 50%) 0 0/60px 60px",
    scenery: [{ e: "🌙", x: 8, y: 24, s: 10 }, { e: "🪐", x: 90, y: 24, s: 10 }], accents: ["🚀", "⭐"] },
};

/* the kinds of rooms a house can have */
const HOUSE_ROOMS = {
  living:   { name: "Living Room", emoji: "🛋️", wallIdx: 0,
    scenery: [{ e: "🪟", x: 26, y: 38, s: 16 }, { e: "🖼️", x: 62, y: 30, s: 10 }],
    props: [{ e: "🛋️", x: 48, y: 76, s: 18, a: "sofa" }, { e: "📺", x: 82, y: 62, s: 12, a: "tv" }, { e: "🪴", x: 18, y: 76, s: 11 },
            { e: "💡", x: 32, y: 70, s: 9, a: "light" }, { k: "table", key: "t1", x: 76, y: 95 }, { e: "🍪", on: "t1", dx: -4, s: 6, eat: true },
            { e: "🧸", on: "t1", dx: 5, s: 7, a: "hug" }] },
  bedroom:  { name: "Bedroom", emoji: "🛏️", wallIdx: 1,
    scenery: [{ e: "🪟", x: 70, y: 36, s: 14 }],
    props: [{ e: "🛏️", x: 30, y: 88, s: 24, a: "sleep" }, { e: "🪞", x: 88, y: 68, s: 13, a: "mirror" }, { k: "nightstand", key: "n1", x: 56, y: 94 },
            { e: "💡", on: "n1", dx: 0, s: 8, a: "light" }, { k: "shelf", key: "s1", x: 72, y: 50 }, { e: "📚", on: "s1", dx: -4, s: 8, a: "book" },
            { e: "🧸", x: 76, y: 96, s: 8, a: "hug" }] },
  kitchen:  { name: "Kitchen", emoji: "🍳", wallIdx: 2,
    scenery: [{ e: "🪟", x: 50, y: 34, s: 14 }],
    props: [{ k: "counter", key: "c1", x: 28, y: 90 }, { e: "🍳", on: "c1", dx: -8, s: 10, a: "cook" }, { e: "🫖", on: "c1", dx: 7, s: 9, a: "tea" },
            { k: "table", key: "t2", x: 72, y: 95 }, { e: "🥞", on: "t2", dx: -5, s: 8, eat: true }, { e: "🍕", on: "t2", dx: 5, s: 8, eat: true },
            { e: "🍎", x: 52, y: 96, s: 7, eat: true }, { e: "🥛", x: 90, y: 92, s: 8, eat: true }] },
  bathroom: { name: "Bathroom", emoji: "🛁", wallIdx: 3,
    scenery: [{ e: "🪞", x: 26, y: 42, s: 13 }, { e: "🪟", x: 80, y: 30, s: 11 }],
    props: [{ e: "🛁", x: 34, y: 90, s: 26, a: "bath" }, { e: "🚽", x: 82, y: 90, s: 15, a: "flush" }, { k: "shelf", key: "s1", x: 60, y: 52 },
            { e: "🧼", on: "s1", dx: -5, s: 7, a: "soap" }, { e: "🪥", on: "s1", dx: 5, s: 7, a: "brush" }, { e: "🦆", x: 58, y: 96, s: 8, a: "duck" }] },
  playroom: { name: "Playroom", emoji: "🧸", wallIdx: 0,
    scenery: [{ e: "🖼️", x: 50, y: 28, s: 10 }],
    props: [{ k: "table", key: "t1", x: 38, y: 94 }, { e: "🎨", on: "t1", dx: -5, s: 9, a: "paint" }, { e: "🧩", on: "t1", dx: 5, s: 8, a: "puzzle" }, { e: "🪀", x: 64, y: 86, s: 8, a: "yoyo" },
            { e: "🎈", x: 84, y: 74, s: 9, a: "balloon" }, { e: "🪁", x: 16, y: 58, s: 10, a: "kite" }, { e: "🧸", x: 78, y: 95, s: 9, a: "hug" }] },
  music:    { name: "Music Room", emoji: "🎹", wallIdx: 1,
    scenery: [{ e: "🎶", x: 30, y: 24, s: 8 }, { e: "🎵", x: 70, y: 20, s: 8 }],
    props: [{ e: "🎹", x: 30, y: 88, s: 18, a: "piano" }, { e: "🎸", x: 58, y: 90, s: 12, a: "guitar" }, { e: "🥁", x: 80, y: 92, s: 12, a: "drum" },
            { e: "🎺", x: 14, y: 95, s: 8, a: "trumpet" }, { e: "🪩", x: 50, y: 30, s: 10, a: "disco" }] },
};

/* things you can add in Decorate mode */
const DECOR = ["🛋️", "🪑", "🛏️", "🪴", "🌷", "🧸", "🎀", "🕯️", "💡", "🎈", "🌈", "⭐", "🪞", "🎹", "📚", "🖼️", "🧁", "🍩", "🍓",
               "🧪", "🔮", "🪄", "🦄", "🐎", "🐱", "🐶", "🐰", "🐸", "🦋", "🍄", "💎", "👑", "🎁", "☁️", "🌙", "🎂", "🧋", "🛁", "🎨", "🧩", "🪩", "🎸"];
const DECOR_INFO = { "🧁": { eat: 1 }, "🍩": { eat: 1 }, "🍓": { eat: 1 }, "🎂": { eat: 1 }, "🧋": { eat: 1 }, "🧪": { potion: 1 },
                     "🪄": { a: "sparkle" }, "🔮": { a: "orb" }, "💡": { a: "light" }, "🎹": { a: "piano" }, "🪞": { a: "mirror" }, "🛋️": { a: "sofa" }, "🪑": { a: "sofa" },
                     "🛏️": { a: "sleep" }, "🧸": { a: "hug" }, "🦄": { a: "unicorn", art: "unicorn" }, "🐎": { a: "horse", art: "horse" }, "🐱": { a: "cat" }, "🐶": { a: "dog" }, "🐰": { a: "bunny" },
                     "🐸": { a: "frog" }, "🦋": { a: "butterfly" }, "🎈": { a: "balloon" }, "🎁": { a: "gift" }, "📚": { a: "book" },
                     "🛁": { a: "bath" }, "🎨": { a: "paint" }, "🧩": { a: "puzzle" }, "🪩": { a: "disco" }, "🎸": { a: "guitar" }, "⭐": { a: "sparkle" }, "💎": { a: "sparkle" } };

const LINES = ["Hi there! 👋", "I love it here! 💖", "Let's go on an adventure!", "Wanna be best friends? 🥹", "Wheee! ✨", "I feel magical today!",
               "What should we do next?", "Hehe, that tickles!", "Look at my outfit! 💅", "Let's have a tea party! 🫖", "I can do a spell! 🪄", "I'm hungry 🍩"];
