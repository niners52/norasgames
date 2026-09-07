// ============================================================
// THE BIOLUMINESCENT FASHION — SHARED GAME STATE
// ============================================================

const DEFAULT_STATE = {
  playerName: '',
  coins: 100,
  xp: 0,
  level: 1,
  selectedStage: null,
  startingModel: null,
  unlockedModels: [],
  outfits: [],
  bestLooks: [],
  magazineCovers: [],
  customMermaid: null,
  makeupLooks: {},
  totalShows: 0,
  highestScore: 0,
};

function getState() {
  return JSON.parse(localStorage.getItem('biolumFashion') || JSON.stringify(DEFAULT_STATE));
}

function saveState(state) {
  localStorage.setItem('biolumFashion', JSON.stringify(state));
}

function addCoins(amount) {
  const state = getState();
  state.coins += amount;
  saveState(state);
  updateHUD();
}

function addXP(amount) {
  const state = getState();
  state.xp += amount;

  // Check level up
  const xpNeeded = 100;
  if (state.xp >= xpNeeded) {
    state.xp -= xpNeeded;
    state.level += 1;
    saveState(state);
    triggerLevelUp(state.level);
  } else {
    saveState(state);
  }
  updateHUD();
}

function triggerLevelUp(newLevel) {
  const messages = {
    2: 'LEVEL 2!! Glass Squid model unlocked!! 🦑',
    3: 'LEVEL 3!! Backstage Lounge unlocked!! 🛋️',
    4: 'LEVEL 4!! Siren model unlocked!! 🎤',
    5: 'LEVEL 5!! Golden Kraken unlocked!! 👑',
    6: 'LEVEL 6!! Custom Mermaid unlocked!! 🧜',
  };

  const msg = messages[newLevel] || 'LEVEL UP!! Keep designing!!';

  const popup = document.createElement('div');
  popup.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    background:linear-gradient(135deg,#041530,#020a1a);
    border:2px solid #ffcc44;border-radius:20px;padding:32px 40px;
    text-align:center;z-index:9999;
    box-shadow:0 0 50px rgba(255,204,68,0.4);
    max-width:90vw;
  `;
  popup.innerHTML = `
    <div style="font-size:3rem;margin-bottom:12px">🌟</div>
    <p style="font-family:'Press Start 2P',cursive;font-size:clamp(0.5rem,2vw,0.8rem);
              color:#ffcc44;text-shadow:0 0 15px rgba(255,204,68,0.8);
              margin-bottom:12px;line-height:1.6">LEVEL UP!!</p>
    <p style="font-family:'Nunito',sans-serif;color:#cce8ff;
              font-size:0.95rem;line-height:1.6;margin-bottom:20px">${msg}</p>
    <button onclick="this.parentElement.remove()" style="
      background:linear-gradient(135deg,#ffcc44,#ff8844);
      border:none;border-radius:20px;padding:12px 24px;
      font-family:'Press Start 2P',cursive;font-size:0.4rem;
      color:#020a1a;cursor:pointer;line-height:1.5;
    ">AMAZING!! ✨</button>
  `;
  document.body.appendChild(popup);

  // Celebration particles
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      const emojis = ['✨','🌟','💫','⭐','🎉'];
      particle.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      particle.style.cssText = `
        position:fixed;font-size:${1+Math.random()*2}rem;
        left:${Math.random()*100}vw;top:100vh;
        z-index:9998;pointer-events:none;
        transition:all ${1.5+Math.random()}s ease-out;
      `;
      document.body.appendChild(particle);
      requestAnimationFrame(() => {
        particle.style.top = `${Math.random()*60}vh`;
        particle.style.opacity = '0';
        particle.style.transform = `rotate(${Math.random()*360}deg) scale(2)`;
      });
      setTimeout(() => particle.remove(), 2500);
    }, i * 80);
  }
}

function updateHUD() {
  const state = getState();
  const coinsEl = document.getElementById('hud-coins');
  const xpEl = document.getElementById('hud-xp');
  const levelEl = document.getElementById('hud-level');
  const xpFill = document.getElementById('xp-fill');

  if (coinsEl) coinsEl.textContent = state.coins;
  if (xpEl) xpEl.textContent = state.xp + '/100';
  if (levelEl) levelEl.textContent = state.level;
  if (xpFill) xpFill.style.width = state.xp + '%';
}

// Bubbles generator
function createBubbles(count) {
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = 5 + Math.random() * 20;
    bubble.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}vw;
      bottom:-${size}px;
      animation-duration:${4+Math.random()*8}s;
      animation-delay:${Math.random()*5}s;
    `;
    document.body.appendChild(bubble);
  }
}
