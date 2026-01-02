// version 0.1.50

// --- CONFIGURAÇÕES DE PERFORMANCE ---
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const TARGET_FPS = isMobile ? 70 : 70; 
const FRAME_TIME = 1000 / TARGET_FPS;

let lastFrameTime = 0; // Controle de trava de FPS
let lastTime = 0; // Controle de DeltaTime para movimento

const RARITY_LABELS = {
  common: "Comum",
  uncommon: "Raro",
  rare: "Épico",
  legendary: "Lendário",
};

// --- NOVAS CONFIGURAÇÕES DE EVENTOS (MARÉS) ---
const EVENT_TYPES = {
  POSITIVE: [
    {
      id: "smooth_currents",
      name: "Correntes Suaves",
      desc: "Zona de captura +15% maior.",
      icon: "🌟",
      effect: { zoneSize: 1.15 },
    },
    {
      id: "generous_shoal",
      name: "Cardume Generoso",
      desc: "Chance de peixes raros +10%.",
      icon: "🐟",
      effect: { rareChance: 10 },
    },
    {
      id: "tired_fish",
      name: "Peixes Cansados",
      desc: "Barra de progresso sobe mais rápido.",
      icon: "🧘",
      effect: { progressSpeed: 1.2 },
    },
    {
      id: "blessed_line",
      name: "Linha Abençoada",
      desc: "Erros drenam 20% menos a barra.",
      icon: "✨",
      effect: { failPenalty: 0.8 },
    },
  ],
  NEGATIVE: [
    {
      id: "nervous_fish",
      name: "Peixes Nervosos",
      desc: "Peixes mudam de direção freneticamente.",
      icon: "⚠️",
      effect: { fishSpeed: 1.4 },
    },
    {
      id: "astute_fish",
      name: "Peixes Astutos",
      desc: "Estabilidade reduzida e oscilação maior.",
      icon: "🧠",
      effect: { stability: 0.8 },
    },
    {
      id: "worn_line",
      name: "Linha Gasta",
      desc: "Erros causam penalidade 30% maior.",
      icon: "🧵",
      effect: { failPenalty: 1.3 },
    },
    {
      id: "abyss_call",
      name: "Chamado do Abismo",
      desc: "Recuperação lenta se a barra estiver baixa.",
      icon: "🌑",
      effect: { recoveryPenalty: true },
    },
  ],
};

const PRESTIGE_CONTENT = {
  fish_level_1: {
    id: "void_piranha",
    name: "Piranha do Vazio",
    rarity: "legendary",
    price: 3500,
    difficulty: 10,
    minDepth: 8,
    emoji: "✨",
    image: "assets/fish/void_piranha.gif",
  },
  map_level_2: {
    id: "mystic_void",
    name: "Vazio Místico",
    emoji: "🌌",
    fish: [
      "abyssal_serpent",
      "void_ray",
      "nebula_carp",
      "star_shell",
      "cosmic_eel",
    ],
    travelTime: 35,
    searchTime: 12,
    difficulty: 5,
    coordinates: { top: 50, left: 20 },
    icon: "auto_awesome",
  },
  fish_level_2: [
    {
      id: "abyssal_horror",
      name: "Aberração Abissal",
      rarity: "legendary",
      price: 4500,
      difficulty: 11,
      minDepth: 8,
      emoji: "🕳️",
      image: "assets/monsters/abyssal_horror.gif",
    },
    {
      id: "nebula_carp",
      name: "Carpa Nebulosa",
      rarity: "uncommon",
      price: 400,
      difficulty: 6,
      minDepth: 4,
      emoji: "☁️",
      image: "assets/fish/nebula_carp.png",
    },
    {
      id: "cosmic_eel",
      name: "Enguia Cósmica",
      rarity: "common",
      price: 200,
      difficulty: 4,
      minDepth: 1,
      emoji: "⭐",
      image: "assets/fish/cosmic_eel.png",
    },
    {
      id: "anglerfish",
      name: "Peixe-pescador",
      rarity: "rare",
      price: 3500,
      difficulty: 6,
      minDepth: 5,
      emoji: "🏮",
      image: "assets/fish/anglerfish.png",
    },
  ],
};

const audioContext = {
  musicMuted: false,
  soundsMuted: false,
  musicVolume: 0.5,
  soundsVolume: 0.7,
  currentMenuMusic: null,
  menuPlaylist: [
    "assets/sound/menu/menu1.mp3",
    "assets/sound/menu/menu2.mp3",
    "assets/sound/menu/menu3.mp3",
    "assets/sound/menu/menu4.mp3",
    "assets/sound/menu/menu5.mp3",
    "assets/sound/menu/menu6.mp3",
  ],
  playedTracks: [],
  sounds: {
    fishing: new Audio("assets/sound/fishing.mp3"),
    battle: new Audio("assets/sound/battle.mp3"),
    click: new Audio("assets/sound/click.mp3"),
    notification: new Audio("assets/sound/notification.mp3"),
    find: new Audio("assets/sound/find.mp3"),
    travel: new Audio("assets/sound/travel.mp3"),
  },
};
let activeEventAtStart = null;
audioContext.sounds.battle.loop = true;

function injectPrestigeContent() {
  if (gameState.prestigeLevel >= 1) {
    if (!FISH_DATA.find((f) => f.id === PRESTIGE_CONTENT.fish_level_1.id)) {
      FISH_DATA.push(PRESTIGE_CONTENT.fish_level_1);
    }

    const abyssArea = AREAS.find((a) => a.id === "abyss");
    if (
      abyssArea &&
      !abyssArea.fish.includes(PRESTIGE_CONTENT.fish_level_1.id)
    ) {
      abyssArea.fish.push(PRESTIGE_CONTENT.fish_level_1.id);
    }
  }

  if (gameState.prestigeLevel >= 2) {
    if (!AREAS.find((a) => a.id === PRESTIGE_CONTENT.map_level_2.id)) {
      AREAS.push(PRESTIGE_CONTENT.map_level_2);
      PRESTIGE_CONTENT.fish_level_2.forEach((fish) => {
        if (!FISH_DATA.find((f) => f.id === fish.id)) FISH_DATA.push(fish);
      });
    }
  }
}

function playSound(soundKey) {
  if (audioContext.soundsMuted) return;

  const sound = audioContext.sounds[soundKey];
  if (!sound) return;

  sound.volume = audioContext.soundsVolume;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

const FISH_DATA = [
  {
    id: "sardine",
    name: "Sardinha",
    rarity: "common",
    price: 10,
    difficulty: 1,
    minDepth: 1,
    emoji: "🐟",
    image: "assets/fish/sardine.png",
  },
  {
    id: "anchovy",
    name: "Anchova",
    rarity: "common",
    price: 12,
    difficulty: 1,
    minDepth: 1,
    emoji: "🐟",
    image: "assets/fish/anchovy.png",
  },
  {
    id: "herring",
    name: "Arenque",
    rarity: "common",
    price: 15,
    difficulty: 2,
    minDepth: 1,
    emoji: "🐟",
    image: "assets/fish/herring.png",
  },
  {
    id: "mackerel",
    name: "Cavala",
    rarity: "common",
    price: 18,
    difficulty: 2,
    minDepth: 1,
    emoji: "🐠",
    image: "assets/fish/mackerel.png",
  },
  {
    id: "bass",
    name: "Robalo",
    rarity: "uncommon",
    price: 35,
    difficulty: 3,
    minDepth: 2,
    emoji: "🐠",
    image: "assets/fish/bass.png",
  },
  {
    id: "trout",
    name: "Truta",
    rarity: "uncommon",
    price: 40,
    difficulty: 4,
    minDepth: 2,
    emoji: "🐠",
    image: "assets/fish/trout.png",
  },
  {
    id: "salmon",
    name: "Salmão",
    rarity: "uncommon",
    price: 50,
    difficulty: 4,
    minDepth: 3,
    emoji: "🐠",
    image: "assets/fish/salmon.png",
  },
  {
    id: "tuna",
    name: "Atum",
    rarity: "uncommon",
    price: 60,
    difficulty: 5,
    minDepth: 3,
    emoji: "🐟",
    image: "assets/fish/tuna.png",
  },
  {
    id: "swordfish",
    name: "Peixe-Espada",
    rarity: "rare",
    price: 120,
    difficulty: 6,
    minDepth: 5,
    emoji: "🗡️",
    image: "assets/fish/swordfish.png",
  },
  {
    id: "octopus",
    name: "Polvo",
    rarity: "rare",
    price: 150,
    difficulty: 7,
    minDepth: 5,
    emoji: "🐙",
    image: "assets/fish/octopus.png",
  },
  {
    id: "lobster",
    name: "Lagosta",
    rarity: "rare",
    price: 180,
    difficulty: 7,
    minDepth: 6,
    emoji: "🦞",
    image: "assets/fish/lobster.png",
  },
  {
    id: "shark",
    name: "Tubarão",
    rarity: "rare",
    price: 250,
    difficulty: 8,
    minDepth: 7,
    emoji: "🦈",
    image: "assets/fish/shark.png",
  },
  {
    id: "whale",
    name: "Baleia Dourada",
    rarity: "legendary",
    price: 700,
    difficulty: 9,
    minDepth: 8,
    emoji: "🐋",
    image: "assets/fish/whale.gif",
  },
  {
    id: "kraken",
    name: "Kraken Bebê",
    rarity: "legendary",
    price: 1250,
    difficulty: 10,
    minDepth: 9,
    emoji: "🦑",
    image: "assets/fish/kraken.png",
  },
  {
    id: "mermaid_fish",
    name: "Peixe da Sereia",
    rarity: "legendary",
    price: 2000,
    difficulty: 10,
    minDepth: 10,
    emoji: "✨",
    image: "assets/fish/mermaid_fish.gif",
  },
];

const AREAS = [
  {
    id: "shore",
    name: "Costa Rasa",
    emoji: "🏖️",
    fish: ["sardine", "anchovy", "herring", "mackerel"],
    travelTime: 5,
    searchTime: 3,
    difficulty: 1,
    coordinates: { top: 25, left: 20 },
    icon: "beach_access",
  },
  {
    id: "bay",
    name: "Baía Tranquila",
    emoji: "🌊",
    fish: ["sardine", "herring", "bass", "trout"],
    travelTime: 8,
    searchTime: 4,
    difficulty: 2,
    coordinates: { top: 45, left: 35 },
    icon: "sailing",
  },
  {
    id: "reef",
    name: "Recife de Coral",
    emoji: "🪸",
    fish: ["mackerel", "bass", "salmon", "tuna", "octopus"],
    travelTime: 12,
    searchTime: 5,
    difficulty: 3,
    coordinates: { top: 28, left: 83 },
    icon: "scuba_diving",
  },
  {
    id: "deep",
    name: "Mar Profundo",
    emoji: "🌑",
    fish: ["tuna", "swordfish", "lobster", "shark"],
    travelTime: 18,
    searchTime: 7,
    difficulty: 4,
    coordinates: { top: 19, left: 50 },
    icon: "tsunami",
  },
  {
    id: "abyss",
    name: "Abismo Oceânico",
    emoji: "⚫",
    fish: ["shark", "whale", "kraken", "mermaid_fish"],
    travelTime: 25,
    searchTime: 10,
    difficulty: 5,
    coordinates: { top: 48, left: 82 },
    icon: "visibility",
  },
];

const RARITY_CHANCES = {
  shore: { common: 85, uncommon: 12, rare: 2.8, legendary: 0.2 },
  bay: { common: 70, uncommon: 24, rare: 5.5, legendary: 0.5 },
  reef: { common: 50, uncommon: 35, rare: 13, legendary: 2 },
  deep: { common: 30, uncommon: 40, rare: 25, legendary: 5 },
  abyss: { common: 10, uncommon: 30, rare: 40, legendary: 20 },
  mystic_void: { common: 5, uncommon: 25, rare: 45, legendary: 25 },
};

const XP_PER_FISH = { common: 5, uncommon: 15, rare: 40, legendary: 100 };
const XP_PER_LEVEL = 100;

let gameState = {
  money: 0,
  xp: 0,
  level: 1,
  bonusPoints: 0,
  totalFish: 0,
  totalEarned: 0,
  rod: { depth: 1, stability: 1, bait: 1 },
  boat: { capacity: 10, speed: 1, sonar: 1 },
  bonuses: { time: 0, xp: 0, sell: 0, rare: 0 },
  inventory: [],
  caughtSpecies: [],
  caughtCounts: {},
  currentArea: AREAS[0],
  phase: "idle",
  isSelling: false,
  prestigeLevel: 0,
  prestigePoints: 0,
  activeEvents: { positive: null, negative: null, expires: 0 },
};

const BALANCE = {
  baseDifficulty: 0.62,
  baseSellTime: 15,
  xpMultiplier: 2.2,
  firstCatchXP: 100,
  bonusValues: { time: 10, xp: 20, sell: 15, rare: 8 },
  eventInterval: 2.5 * 60 * 1000, // 2.5 minutos
};

// --- FUNÇÕES DE EVENTOS (MARÉS) ---

function updateGlobalEvents() {
  const now = Date.now();
  if (now > gameState.activeEvents.expires) {
    generateNewEvents();
  }
}

function generateNewEvents() {
  const availableAreas = [...AREAS];
  const posArea = availableAreas.splice(
    Math.floor(Math.random() * availableAreas.length),
    1
  )[0];
  const negArea =
    availableAreas[Math.floor(Math.random() * availableAreas.length)];

  const posEvent =
    EVENT_TYPES.POSITIVE[
      Math.floor(Math.random() * EVENT_TYPES.POSITIVE.length)
    ];
  const negEvent =
    EVENT_TYPES.NEGATIVE[
      Math.floor(Math.random() * EVENT_TYPES.NEGATIVE.length)
    ];

  gameState.activeEvents = {
    positive: { areaId: posArea.id, event: posEvent },
    negative: { areaId: negArea.id, event: negEvent },
    expires: Date.now() + BALANCE.eventInterval,
  };

  showToast("🌊 As Marés do Arquipélago mudaram!", "info");
  saveGame();
}

function getActiveEventForArea(areaId) {
  if (gameState.activeEvents.positive?.areaId === areaId)
    return gameState.activeEvents.positive.event;
  if (gameState.activeEvents.negative?.areaId === areaId)
    return gameState.activeEvents.negative.event;
  return null;
}

function showEventInfoModal() {
  const event = getActiveEventForArea(gameState.currentArea.id);
  if (!event) return;

  const modal = document.getElementById("message-modal");
  const title = document.getElementById("msg-modal-title");
  const body = document.getElementById("msg-modal-body");
  const icon = document.getElementById("msg-modal-icon");

  const isPos = gameState.activeEvents.positive?.event.id === event.id;
  title.textContent = isPos ? "Maré Favorável" : "Maré Hostil";
  icon.textContent = event.icon;
  body.innerHTML = `<div class="text-center">
    <p class="font-bold text-lg mb-2 text-white">${event.name}</p>
    <p class="text-gray-400 italic mb-4">"${event.desc}"</p>
    <div class="bg-black/20 p-3 rounded-lg border border-white/5">
      <p class="text-[10px] uppercase font-bold text-primary">Tempo Restante</p>
      <p class="text-white font-mono">${Math.ceil(
        (gameState.activeEvents.expires - Date.now()) / 60000
      )} min</p>
    </div>
  </div>`;
  modal.classList.add("active");
}

// --- FIM MARÉS ---

function loadGame() {
  const saved = localStorage.getItem("fishing-master-save");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      gameState = { ...gameState, ...parsed };
      injectPrestigeContent();
      gameState.currentArea =
        AREAS.find((a) => a.id === parsed.currentArea?.id) || AREAS[0];
      gameState.phase = "idle";
      gameState.isSelling = false;
      updateGlobalEvents(); // Checa eventos ao carregar
      renderAlbumInventory();
    } catch (e) {
      console.error("Failed to load save:", e);
    }
  } else {
    generateNewEvents(); // Primeiro jogo
  }
}

function saveGame() {
  localStorage.setItem("fishing-master-save", JSON.stringify(gameState));
  updateMenuUI();
}

const elements = {
  screens: {
    menu: document.getElementById("menu-screen"),
    game: document.getElementById("game-screen"),
    tutorial: document.getElementById("tutorial-screen"),
    settings: document.getElementById("settings-screen"),
    map: document.getElementById("map-screen"),
  },
  menu: {
    btnStart: document.getElementById("btn-start-game"),
    btnSettings: document.getElementById("btn-settings-menu"),
    btnTutorial: document.getElementById("btn-tutorial-menu"),
    levelDisplay: document.getElementById("menu-level-display"),
    moneyDisplay: document.getElementById("menu-money-display"),
  },
  nav: {
    btnReturnMenu: document.getElementById("btn-return-menu"),
    btnBackTutorial: document.getElementById("btn-back-tutorial"),
    btnBackSettings: document.getElementById("btn-back-settings"),
    btnResetSave: document.getElementById("btn-reset-save"),
    btnOpenMap: document.getElementById("btn-open-map"),
    btnCloseMap: document.getElementById("btn-close-map"),
  },
  fishDetails: {
    modal: document.getElementById("fish-details-modal"),
    card: document.getElementById("fish-details-modal").firstElementChild,
    img: document.getElementById("fish-detail-img"),
    name: document.getElementById("fish-detail-name"),
    rarity: document.getElementById("fish-detail-rarity"),
    price: document.getElementById("fish-detail-price"),
    difficulty: document.getElementById("fish-detail-difficulty"),
    depth: document.getElementById("fish-detail-depth"),
    count: document.getElementById("fish-detail-count"),
    btnClose: document.getElementById("btn-close-fish-details"),
  },
  playerLevel: document.getElementById("player-level"),
  playerMoney: document.getElementById("player-money"),
  xpText: document.getElementById("xp-text"),
  xpFill: document.getElementById("xp-fill"),
  totalFish: document.getElementById("total-fish"),
  totalEarned: document.getElementById("total-earned"),
  boatCapacity: document.getElementById("boat-capacity"),
  capacityFill: document.getElementById("capacity-fill"),
  fishInventory: document.getElementById("fish-inventory"),
  oceanView: document.getElementById("ocean-view"),
  boat: document.getElementById("boat"),
  areaBadge: document.getElementById("area-badge"),
  statusText: document.getElementById("status-text"),
  progressBar: document.getElementById("progress-bar"),
  progressFill: document.getElementById("progress-fill"),
  minigameOverlay: document.getElementById("minigame-overlay"),
  countdown: document.getElementById("countdown"),
  minigameFishEmoji: document.getElementById("minigame-fish-emoji"),
  minigameFishName: document.getElementById("minigame-fish-name"),
  minigameDifficulty: document.getElementById("minigame-difficulty"),
  fishingBar: document.getElementById("fishing-bar"),
  catchZone: document.getElementById("catch-zone"),
  fishMarker: document.getElementById("fish-marker"),
  catchProgressFill: document.getElementById("catch-progress-fill"),
  resultModal: document.getElementById("result-modal"),
  resultEmoji: document.getElementById("result-emoji"),
  resultTitle: document.getElementById("result-title"),
  resultDesc: document.getElementById("result-desc"),
  resultStats: document.getElementById("result-stats"),
  btnCloseResult: document.getElementById("btn-close-result"),
  btnFish: document.getElementById("btn-fish"),
  shopMoney: document.getElementById("shop-money"),
  sellCount: document.getElementById("sell-count"),
  sellValue: document.getElementById("sell-value"),
  btnSell: document.getElementById("btn-sell"),
  sellTimerText: document.getElementById("sell-timer-text"),
  depthDots: document.getElementById("depth-dots"),
  stabilityDots: document.getElementById("stability-dots"),
  baitDots: document.getElementById("bait-dots"),
  capacityDots: document.getElementById("capacity-dots"),
  speedDots: document.getElementById("speed-dots"),
  sonarDots: document.getElementById("sonar-dots"),
  btnDepth: document.getElementById("btn-depth"),
  btnStability: document.getElementById("btn-stability"),
  btnBait: document.getElementById("btn-bait"),
  btnCapacity: document.getElementById("btn-capacity"),
  btnSpeed: document.getElementById("btn-speed"),
  btnSonar: document.getElementById("btn-sonar"),
  bonusPoints: document.getElementById("bonus-points"),
  timeBonus: document.getElementById("time-bonus"),
  xpBonus: document.getElementById("xp-bonus"),
  sellBonus: document.getElementById("sell-bonus"),
  rareBonus: document.getElementById("rare-bonus"),
  levelUpModal: document.getElementById("level-up-modal"),
  newLevel: document.getElementById("new-level"),
  btnCloseModal: document.getElementById("btn-close-modal"),
  toastContainer: document.getElementById("toast-container"),
  currentAreaEmojiDisplay: document.getElementById(
    "current-area-emoji-display"
  ),
  currentAreaNameDisplay: document.getElementById("current-area-name-display"),
  map: {
    container: document.getElementById("map-nodes-container"),
    svg: document.getElementById("map-lines"),
    card: document.getElementById("map-details-card"),
    title: document.getElementById("map-detail-title"),
    stars: document.getElementById("map-detail-stars"),
    time: document.getElementById("map-detail-time"),
    depth: document.getElementById("map-detail-depth"),
    fishCount: document.getElementById("map-detail-fish-count"),
    btnTravel: document.getElementById("btn-travel-confirm"),
  },
};

let selectedMapArea = null;
let fishDecisionTimer = 0;
let fishingSoundPlaying = false;

function showScreen(screenName) {
  Object.values(elements.screens).forEach((screen) =>
    screen.classList.add("hidden-screen")
  );
  elements.screens[screenName].classList.remove("hidden-screen");
}

function updateMenuUI() {
  elements.menu.levelDisplay.textContent = gameState.level;
  elements.menu.moneyDisplay.textContent = `${gameState.money}G`;
}

function updateUI() {
  const previousExpires = gameState.activeEvents.expires;
  updateGlobalEvents(); // Refresh eventos

  if (
    previousExpires !== gameState.activeEvents.expires &&
    !elements.screens.map.classList.contains("hidden-screen")
  ) {
    renderMapNodes();
    // Se tiver uma área selecionada, re-seleciona para atualizar o badge lateral
    if (selectedMapArea) selectMapArea(selectedMapArea);
  }

  elements.playerLevel.textContent = gameState.level;
  elements.playerMoney.textContent = `💰 $${gameState.money.toLocaleString()}`;
  elements.shopMoney.textContent = `💰 $${gameState.money.toLocaleString()}`;

  const mobileLevel = document.getElementById("mobile-level-display");
  const mobileMoney = document.getElementById("mobile-money-display");
  if (mobileLevel) mobileLevel.textContent = gameState.level;
  if (mobileMoney)
    mobileMoney.textContent = `$${gameState.money.toLocaleString()}`;

  const xpForLevel = XP_PER_LEVEL * gameState.level;
  elements.xpText.textContent = `${gameState.xp}/${xpForLevel}`;
  elements.xpFill.style.width = `${(gameState.xp / xpForLevel) * 100}%`;

  elements.totalFish.textContent = gameState.totalFish;
  elements.totalEarned.textContent = `$${gameState.totalEarned.toLocaleString()}`;

  const capacity = gameState.boat.capacity;
  const count = gameState.inventory.length;
  elements.boatCapacity.textContent = `${count}/${capacity}`;
  elements.boatCapacity.classList.toggle("full", count >= capacity);
  elements.capacityFill.style.width = `${(count / capacity) * 100}%`;
  elements.capacityFill.classList.toggle("full", count >= capacity);

  updateFishInventory();
  updateSellSection();
  updateUpgrades();
  updateBonuses();

  // Update Area Badge with Event Info
  const activeEvent = getActiveEventForArea(gameState.currentArea.id);
  elements.currentAreaEmojiDisplay.textContent = gameState.currentArea.emoji;
  elements.currentAreaNameDisplay.textContent = gameState.currentArea.name;

  const badgeEmoji = elements.areaBadge.querySelector(".area-emoji");
  const badgeName = elements.areaBadge.querySelector(".area-name");

  if (activeEvent) {
    badgeEmoji.textContent = activeEvent.icon;
    badgeName.textContent = `${gameState.currentArea.name} (${activeEvent.name})`;
    elements.areaBadge.classList.add(
      "cursor-pointer",
      "hover:scale-105",
      "transition-all"
    );

    // ALTERAÇÃO AQUI: Em vez de showEventInfoModal, usamos a lógica da modal atrativa
    elements.areaBadge.onclick = () => {
      // Forçamos o selectedMapArea ser a área atual para a função de detalhes funcionar
      selectedMapArea = gameState.currentArea;
      getActiveDetailsBonus();
    };

    // Add pulsing effect based on type
    const isPos =
      gameState.activeEvents.positive?.areaId === gameState.currentArea.id;
    elements.areaBadge.style.boxShadow = isPos
      ? "0 0 15px rgba(25, 161, 230, 0.5)"
      : "0 0 15px rgba(239, 68, 68, 0.5)";
  } else {
    badgeEmoji.textContent = gameState.currentArea.emoji;
    badgeName.textContent = gameState.currentArea.name;
    elements.areaBadge.style.boxShadow = "none";
    elements.areaBadge.onclick = null;
  }

  elements.btnFish.disabled = gameState.phase !== "idle" || count >= capacity;
  elements.btnFish.classList.toggle(
    "pulse",
    gameState.phase === "idle" && count < capacity
  );

  const name =
    gameState.playerName || localStorage.getItem("player-name") || "Pescador";
  document.getElementById("player-name-display").textContent = name;
  updatePrestigeUI();
}

function updateFishInventory() {
  if (gameState.inventory.length === 0) {
    elements.fishInventory.innerHTML = `<div class="empty-boat"><span>🎣</span><p>Barco vazio</p></div>`;
  } else {
    elements.fishInventory.innerHTML = gameState.inventory
      .map(
        (fish) =>
          `<div class="fish-item ${fish.rarity}" onclick="showFishDetails('${fish.id}')"><img src="${fish.image}" class="w-8 h-8 object-contain pointer-events-none"></div>`
      )
      .join("");
  }
}

function updateSellSection() {
  const count = gameState.inventory.length;
  const sellBonus = 1 + gameState.bonuses.sell / 100;
  const total = gameState.inventory.reduce(
    (sum, fish) => sum + Math.floor(fish.price * sellBonus),
    0
  );
  elements.sellCount.textContent = `${count} peixes no barco`;
  elements.sellValue.textContent = `$${total.toLocaleString()}`;
  elements.btnSell.disabled = count === 0 || gameState.isSelling;

  if (gameState.isSelling) {
    elements.btnSell.querySelector(".sell-text").textContent = "Vendendo...";
  } else {
    elements.btnSell.querySelector(".sell-text").textContent = "Vender Todos";
    elements.btnSell.querySelector(".sell-progress").style.width = "0%";
    elements.sellTimerText.textContent = "";
  }
}

function updateUpgrades() {
  updateDots(elements.depthDots, gameState.rod.depth, 10);
  updateDots(elements.stabilityDots, gameState.rod.stability, 10);
  updateDots(elements.baitDots, gameState.rod.bait, 10);
  updateUpgradeButton(elements.btnDepth, "depth", gameState.rod.depth, 50);
  updateUpgradeButton(
    elements.btnStability,
    "stability",
    gameState.rod.stability,
    40
  );
  updateUpgradeButton(elements.btnBait, "bait", gameState.rod.bait, 60);

  const capacityLevel = Math.floor((gameState.boat.capacity - 10) / 5) + 1;
  updateDots(elements.capacityDots, capacityLevel, 10);
  updateDots(elements.speedDots, gameState.boat.speed, 10);
  updateDots(elements.sonarDots, gameState.boat.sonar, 10);
  updateUpgradeButton(elements.btnCapacity, "capacity", capacityLevel, 80);
  updateUpgradeButton(elements.btnSpeed, "speed", gameState.boat.speed, 70);
  updateUpgradeButton(elements.btnSonar, "sonar", gameState.boat.sonar, 90);
}

function updateDots(container, level, max) {
  container.innerHTML = Array(max)
    .fill(0)
    .map(
      (_, i) => `<div class="upgrade-dot ${i < level ? "filled" : ""}"></div>`
    )
    .join("");
}

function updateUpgradeButton(btn, type, level, baseCost) {
  const maxLevel = 10;
  if (level >= maxLevel) {
    btn.textContent = "MAX";
    btn.disabled = true;
    btn.classList.add("maxed");
  } else {
    const cost = Math.floor(baseCost * Math.pow(1.5, level - 1));
    btn.textContent = `$${cost}`;
    btn.disabled = gameState.money < cost;
    btn.classList.remove("maxed");
    btn.dataset.cost = cost;
  }
}

function updateBonuses() {
  elements.bonusPoints.textContent = gameState.bonusPoints;
  elements.timeBonus.textContent = `+${gameState.bonuses.time}%`;
  elements.xpBonus.textContent = `+${gameState.bonuses.xp}%`;
  elements.sellBonus.textContent = `+${gameState.bonuses.sell}%`;
  elements.rareBonus.textContent = `+${gameState.bonuses.rare}%`;
  document.querySelectorAll(".bonus-btn").forEach((btn) => {
    btn.disabled = gameState.bonusPoints <= 0;
  });
}

function showToast(message, type = "info") {
  playSound("notification");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getTravelTime(area) {
  const base = area.travelTime;
  const speedReduction = (gameState.boat.speed - 1) * 0.08;
  const bonusReduction = gameState.bonuses.time / 100;
  return Math.max(1, base * (1 - speedReduction - bonusReduction));
}

function getSearchTime() {
  const base = gameState.currentArea.searchTime;
  const sonarReduction = (gameState.boat.sonar - 1) * 0.08;
  const bonusReduction = gameState.bonuses.time / 100;
  return Math.max(1, base * (1 - sonarReduction - bonusReduction));
}

function openMap() {
  updateGlobalEvents();
  showScreen("map");
  renderMapNodes();
  drawMapLines();
  if (gameState.currentArea) selectMapArea(gameState.currentArea);
}

function renderMapNodes() {
  elements.map.container.innerHTML = "";
  AREAS.forEach((area) => {
    // --- MELHORIA C: LÓGICA DE BLOQUEIO POR PRESTÍGIO ---
    let isLocked = false;
    if (area.id === "mystic_void" && gameState.prestigeLevel < 2) {
      isLocked = true;
    }

    const node = document.createElement("div");
    const activeEvent = getActiveEventForArea(area.id);
    const isPos = gameState.activeEvents.positive?.areaId === area.id;
    const isNeg = gameState.activeEvents.negative?.areaId === area.id;

    node.className = `map-node pointer-events-auto ${
      gameState.currentArea.id === area.id ? "active" : ""
    } ${isLocked ? "locked opacity-60" : ""}`;

    node.style.top = `${area.coordinates.top}%`;
    node.style.left = `${area.coordinates.left}%`;
    node.dataset.id = area.id;

    let eventMarker = "";
    if (!isLocked) {
      if (isPos)
        eventMarker = `<div class="absolute -top-6 text-xl animate-bounce">🌟</div>`;
      if (isNeg)
        eventMarker = `<div class="absolute -top-6 text-xl animate-pulse">⚠️</div>`;
    }

    let marker =
      gameState.currentArea.id === area.id
        ? `<div class="current-location-marker"><span class="material-symbols-outlined text-[10px] text-white">sailing</span></div>`
        : "";

    // Conteúdo condicional se estiver bloqueado
    if (isLocked) {
      node.innerHTML = `
        <div class="node-icon border-gray-600 bg-gray-800/80">
          <span class="material-symbols-outlined text-gray-500 text-2xl">lock</span>
        </div>
        <div class="node-label text-gray-500">Prestígio Nvl 2</div>`;

      node.addEventListener("click", () => {
        playSound("click");
        showToast("Área bloqueada! Alcance o Prestígio Nível 2.", "error");
      });
    } else {
      node.innerHTML = `
        ${eventMarker}
        <div class="node-icon" style="border-color: ${
          isPos ? "#19a1e6" : isNeg ? "#ef4444" : "rgba(255,255,255,0.1)"
        }">
          <span class="material-symbols-outlined text-white text-2xl">${
            area.icon
          }</span>
          ${marker}
        </div>
        <div class="node-label">${area.name}</div>`;

      node.addEventListener("click", () => selectMapArea(area));
    }

    elements.map.container.appendChild(node);
  });
}

function drawMapLines() {
  elements.map.svg.innerHTML = "";
  for (let i = 0; i < AREAS.length - 1; i++) {
    const start = AREAS[i],
      end = AREAS[i + 1];
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", `${start.coordinates.left}%`);
    line.setAttribute("y1", `${start.coordinates.top}%`);
    line.setAttribute("x2", `${end.coordinates.left}%`);
    line.setAttribute("y2", `${end.coordinates.top}%`);
    line.setAttribute("class", "map-route-line");
    elements.map.svg.appendChild(line);
  }
}

function selectMapArea(area) {
  playSound("click");
  selectedMapArea = area;
  elements.map.card.classList.add("active");
  elements.map.title.textContent = area.name;
  elements.map.time.textContent = `${getTravelTime(area).toFixed(1)}s`;

  const event = getActiveEventForArea(area.id);
  const badge = document.getElementById("map-detail-badge");
  if (event) {
    badge.textContent = event.name;
    badge.className = `text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
      gameState.activeEvents.positive?.areaId === area.id
        ? "bg-primary/20 text-primary border-primary/20"
        : "bg-red-500/20 text-red-500 border-red-500/20"
    }`;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }

  let stars = "";
  for (let i = 0; i < 5; i++)
    stars += `<span class="material-symbols-outlined ${
      i < area.difficulty ? "star-filled" : "star-empty"
    }">star</span>`;
  elements.map.stars.innerHTML = stars;

  const depthInfo = area.fish.map(
    (id) => FISH_DATA.find((f) => f.id === id)?.minDepth || 0
  );
  elements.map.depth.textContent = `Nível ${Math.min(
    ...depthInfo
  )} - ${Math.max(...depthInfo)}`;
  elements.map.fishCount.textContent = `${area.fish.length} Espécies`;

  document
    .querySelectorAll(".map-node")
    .forEach((n) => n.classList.toggle("active", n.dataset.id === area.id));
}

elements.map.btnTravel.addEventListener("click", () => {
  if (selectedMapArea) {
    playSound("click");
    if (gameState.phase !== "idle") {
      showToast("Você já está ocupado!", "error");
      return;
    }

    gameState.currentArea = selectedMapArea;
    elements.map.card.classList.remove("active");

    if (window.innerWidth <= 768) {
      document
        .querySelectorAll(".mobile-nav-btn, .mobile-fish-btn")
        .forEach((b) => b.classList.remove("active"));
      const gameBtn = document.querySelector(
        '.mobile-fish-btn[data-target="game"]'
      );
      if (gameBtn) gameBtn.classList.add("active");

      document
        .querySelectorAll(".mobile-view")
        .forEach((v) => v.classList.remove("active"));
      const gameView = document.getElementById("mobile-view-game");
      if (gameView) gameView.classList.add("active");
    }

    showScreen("game");
    saveGame();
    updateUI();
    startTravelSequence();
  }
});

elements.nav.btnOpenMap.addEventListener("click", openMap);
elements.nav.btnCloseMap.addEventListener("click", () => {
  elements.map.card.classList.remove("active");
  showScreen("game");
});

function selectRandomFish() {
  const area = gameState.currentArea;
  const chances = RARITY_CHANCES[area.id] || RARITY_CHANCES.shore;
  const activeEvent = getActiveEventForArea(area.id);

  let rareChanceBonus = activeEvent?.effect?.rareChance || 0;
  const baitBonus = (gameState.rod.bait - 1) * 2;
  const rareBonus = gameState.bonuses.rare + rareChanceBonus;

  const adjusted = {
    common: Math.max(10, chances.common - baitBonus - rareBonus),
    uncommon: chances.uncommon + baitBonus * 0.3,
    rare: chances.rare + baitBonus * 0.4 + rareBonus * 0.5,
    legendary: chances.legendary + baitBonus * 0.3 + rareBonus * 0.5,
  };

  const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  let selectedRarity = "common";
  for (const [rarity, chance] of Object.entries(adjusted)) {
    random -= chance;
    if (random <= 0) {
      selectedRarity = rarity;
      break;
    }
  }

  const availableFish = area.fish
    .map((id) => FISH_DATA.find((f) => f.id === id))
    .filter(
      (f) =>
        f && f.rarity === selectedRarity && f.minDepth <= gameState.rod.depth
    );

  if (availableFish.length === 0) {
    const fallback = area.fish
      .map((id) => FISH_DATA.find((f) => f.id === id))
      .filter((f) => f && f.minDepth <= gameState.rod.depth);
    return (
      fallback[Math.floor(Math.random() * fallback.length)] || FISH_DATA[0]
    );
  }
  return availableFish[Math.floor(Math.random() * availableFish.length)];
}

function addXP(amount, fishId = null, difficulty = 1) {
  const xpBonus = 1 + gameState.bonuses.xp / 100;
  let xpGain = Math.floor(amount * xpBonus * BALANCE.xpMultiplier);
  if (fishId && !gameState.caughtSpecies.includes(fishId)) {
    gameState.caughtSpecies.push(fishId);
    xpGain += BALANCE.firstCatchXP * difficulty;
    showToast("✨ Nova Espécie Descoberta! +" + xpGain + " XP", "info");
  }
  gameState.xp += xpGain;
  const xpForLevel = XP_PER_LEVEL * gameState.level;
  if (gameState.xp >= xpForLevel) {
    gameState.xp -= xpForLevel;
    gameState.level++;
    gameState.bonusPoints++;
    elements.newLevel.textContent = gameState.level;
    elements.levelUpModal.classList.add("active");
    playSound("notification");
  }
}

let currentAnimation = null;
function animateProgress(durationMs, onUpdate, onComplete) {
  if (currentAnimation) cancelAnimationFrame(currentAnimation);
  const startTime = performance.now();
  function step(currentTime) {
    const elapsed = currentTime - startTime,
      progress = Math.min(elapsed / durationMs, 1);
    onUpdate(progress * 100);
    if (progress < 1) currentAnimation = requestAnimationFrame(step);
    else {
      currentAnimation = null;
      if (onComplete) onComplete();
    }
  }
  currentAnimation = requestAnimationFrame(step);
}

function stopAnimation() {
  if (currentAnimation) {
    cancelAnimationFrame(currentAnimation);
    currentAnimation = null;
  }
}

function startTravelSequence() {
  if (gameState.isSelling || gameState.phase === "selling") return;
  if (gameState.inventory.length >= gameState.boat.capacity) {
    showToast("Barco cheio! Venda seus peixes.", "error");
    return;
  }
  stopAnimation();
  playSound("travel");
  gameState.phase = "traveling";
  elements.boat.classList.add("traveling");
  elements.progressBar.classList.add("active");
  elements.statusText.textContent = `Viajando para ${gameState.currentArea.name}...`;
  elements.statusText.className = "status-text traveling";
  animateProgress(
    getTravelTime(gameState.currentArea) * 1000,
    (p) => {
      elements.progressFill.style.width = `${p}%`;
    },
    () => {
      audioContext.sounds.travel.pause();
      audioContext.sounds.travel.currentTime = 0;
      startSearching();
    }
  );
}

function startLocalFishing() {
  if (gameState.isSelling || gameState.phase === "selling") return;
  if (gameState.inventory.length >= gameState.boat.capacity) {
    showToast("Barco cheio! Venda seus peixes.", "error");
    return;
  }
  if (gameState.phase === "idle") {
    elements.btnFish.disabled = true;
    elements.btnFish.classList.remove("pulse");
    startSearching();
  }
}

function startSearching() {
  gameState.phase = "searching";
  elements.boat.classList.remove("traveling");
  elements.statusText.textContent = "Procurando peixes...";
  elements.statusText.className = "status-text searching";
  elements.progressFill.style.width = "0%";
  playSound("find");
  animateProgress(
    getSearchTime() * 1000,
    (p) => {
      elements.progressFill.style.width = `${p}%`;
    },
    () => {
      audioContext.sounds.find.pause();
      audioContext.sounds.find.currentTime = 0;
      playSound("notification");
      elements.statusText.textContent = "🎣 PEIXE ENCONTRADO!";
      setTimeout(startCountdown, 1000);
    }
  );
}
function startCountdown() {
  stopMenuMusic();
  currentFish = selectRandomFish();

  // --- MELHORIA A: SNAPSHOT DO EVENTO ---
  activeEventAtStart = getActiveEventForArea(gameState.currentArea.id);

  // --- MELHORIA B: FEEDBACK VISUAL DE MARÉ ---
  elements.minigameOverlay.classList.remove("mare-positiva", "mare-negativa");
  if (activeEventAtStart) {
    const isPos =
      gameState.activeEvents.positive?.event.id === activeEventAtStart.id;
    elements.minigameOverlay.classList.add(
      isPos ? "mare-positiva" : "mare-negativa"
    );
  }

  // Preenchimento de dados do peixe
  document.getElementById("minigame-area-name").textContent =
    gameState.currentArea.name;
  document.getElementById("minigame-area-difficulty").innerHTML =
    getDifficultyStars(gameState.currentArea.difficulty);
  elements.minigameFishEmoji.innerHTML = `<img src="${currentFish.image}" class="w-16 h-16 object-contain">`;
  elements.minigameFishName.textContent = currentFish.name;
  elements.minigameDifficulty.innerHTML = getDifficultyStars(
    currentFish.difficulty
  );

  if (fishMarkerInner) {
    fishMarkerInner.innerHTML = `<img src="${currentFish.image}" class="w-12 h-12 object-contain">`;
  }

  // --- POSICIONAMENTO INICIAL (CENTRALIZADO) ---
  // Resetamos as variáveis lógicas
  zonePosition = 50;
  fishPosition = 50;
  catchProgress = 30;

  const barHeight = elements.fishingBar.clientHeight;
  const zoneHeight = elements.catchZone.clientHeight;

  // Cálculo para centralizar perfeitamente
  const initialZoneY = barHeight / 2 - zoneHeight / 2;
  const initialFishY = barHeight / 2;

  // Aplicamos o transform imediatamente
  elements.catchZone.style.transform = `translate3d(0, ${initialZoneY}px, 0)`;
  elements.fishMarker.style.transform = `translate3d(-50%, ${initialFishY}px, 0) translateY(-50%)`;
  elements.catchProgressFill.style.height = "30%";

  // --- ESCONDER ELEMENTOS PARA A CONTAGEM ---
  // Garantimos que a barra e o peixe fiquem invisíveis durante o 3, 2, 1
  elements.fishingBar.style.opacity = "0";
  elements.fishMarker.style.opacity = "0";
  elements.catchProgressFill.parentElement.style.opacity = "0"; // Barra de progresso lateral

  if (!audioContext.musicMuted) {
    audioContext.sounds.battle.volume = audioContext.musicVolume;
    audioContext.sounds.battle.play().catch(() => {});
  }

  if (!audioContext.soundsMuted) {
    audioContext.sounds.fishing.loop = true;
    audioContext.sounds.fishing.volume = 0;
    audioContext.sounds.fishing.play().catch(() => {});
  }

  elements.minigameOverlay.classList.add("active");
  elements.countdown.classList.add("active");

  let count = 3;
  elements.countdown.textContent = count;

  const countInterval = setInterval(() => {
    count--;
    if (count > 0) {
      elements.countdown.textContent = count;
    } else {
      clearInterval(countInterval);
      elements.countdown.textContent = "FISGOU!";

      // --- MOSTRAR ELEMENTOS E INICIAR ---
      setTimeout(() => {
        elements.countdown.classList.remove("active");
        elements.minigameOverlay.classList.add("game-active");

        // Torna visível com uma transição suave
        elements.fishingBar.style.opacity = "1";
        elements.fishMarker.style.opacity = "1";
        elements.catchProgressFill.parentElement.style.opacity = "1";

        startMinigame();
      }, 500);
    }
  }, 500);
}

let currentFish = null,
  minigameActive = false,
  isHolding = false,
  zonePosition = 50,
  fishPosition = 50,
  fishVelocity = 0,
  fishDirection = 1,
  catchProgress = 30,
  minigameLoop = null,
  minigameStartTime = 0;
// ------------------------------------

let barHeight = 0;
let zoneHeight = 0;

const fishMarkerInner = document.getElementById("fish-marker-inner");

let lastHoldingState = false;

function updateFishingSoundOptimized() {
  if (isHolding !== lastHoldingState) {
    audioContext.sounds.fishing.volume = isHolding ? 0.6 : 0.0;
    lastHoldingState = isHolding;
  }
}

function startMinigame() {
  gameState.phase = "fishing";
  document.body.classList.add("minigame-focus");
  zonePosition = 50;
  fishPosition = 50;
  fishVelocity = 0;
  fishDirection = Math.random() > 0.5 ? 1 : -1;
  catchProgress = 30;
  isHolding = false;
  fishDecisionTimer = 0;
  minigameActive = true;
  minigameStartTime = performance.now();

  // --- MELHORIA A: USANDO SNAPSHOT (activeEventAtStart) EM VEZ DO GLOBAL ---
  const stabilityMod = activeEventAtStart?.effect?.stability || 1;
  const prestigeStability = gameState.prestigeLevel >= 1 ? 1.5 : 0;
  const finalHeightPct = Math.min(
    40,
    (20 + (gameState.rod.stability - 1 + prestigeStability) * 1.5) *
      (activeEventAtStart?.effect?.zoneSize || 1)
  );
  elements.catchZone.style.height = `${finalHeightPct}%`;

  let lastTime = performance.now();

  barHeight = elements.fishingBar.clientHeight;
  zoneHeight = elements.catchZone.clientHeight;

  function gameLoop(currentTime) {
    if (!minigameActive) return;

    // 1. TRAVA DE FPS (Apenas processa se passou o tempo do TARGET_FPS)
    const elapsedSinceLastFrame = currentTime - lastFrameTime;
    if (elapsedSinceLastFrame < FRAME_TIME) {
      minigameLoop = requestAnimationFrame(gameLoop);
      return;
    }

    // 2. CÁLCULO DE DELTA TIME (Consistência de movimento)
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);

    // Atualiza os timestamps sincronizados
    lastFrameTime = currentTime - (elapsedSinceLastFrame % FRAME_TIME);
    lastTime = currentTime;

    // 3. OTIMIZAÇÕES DE ÁUDIO E LÓGICA
    updateFishingSoundOptimized();

    let fishDiffBase = currentFish.difficulty;
    let difficulty = Math.max(
      1,
      fishDiffBase * 0.62 - gameState.rod.stability / 4
    );

    // Lógica de decisão do peixe
    fishDecisionTimer += deltaTime;
    if (fishDecisionTimer > 0.15) {
      fishDecisionTimer = 0;
      const fishSpeedMod = activeEventAtStart?.effect?.fishSpeed || 1;
      if (Math.random() < 0.25 + difficulty * 0.05) {
        fishDirection = Math.random() > 0.5 ? 1 : -1;
        fishVelocity =
          (Math.random() * 120 + 60) * (difficulty / 3) * fishSpeedMod;
      }
    }

    // 4. MOVIMENTAÇÃO COM ACELERAÇÃO DE HARDWARE (GPU)
    fishPosition += fishVelocity * fishDirection * deltaTime;
    fishPosition = Math.max(5, Math.min(95, fishPosition));
    zonePosition += (isHolding ? -185 : 75) * deltaTime;
    zonePosition = Math.max(0, Math.min(100, zonePosition));

    const zoneYPx = (zonePosition / 100) * (barHeight - zoneHeight);
    const fishYPx = (fishPosition / 100) * barHeight;

    // Usando translate3d para evitar Reflow no Mobile
    elements.catchZone.style.transform = `translate3d(0, ${zoneYPx}px, 0)`;
    elements.fishMarker.style.transform = `translate3d(-50%, ${fishYPx}px, 0) translateY(-50%)`;

    if (fishMarkerInner)
      fishMarkerInner.style.transform =
        fishDirection > 0 ? "scaleX(1)" : "scaleX(-1)";

    // 5. PROGRESSO COM SCALE (GPU) EM VEZ DE HEIGHT
    const inZone =
      fishPosition >= (zoneYPx / barHeight) * 100 &&
      fishPosition <= ((zoneYPx + zoneHeight) / barHeight) * 100;

    const progressSpeed = activeEventAtStart?.effect?.progressSpeed || 1;
    const failPenalty = activeEventAtStart?.effect?.failPenalty || 1;

    catchProgress = Math.max(
      0,
      Math.min(
        100,
        catchProgress + (inZone ? 0.45 * progressSpeed : -0.3 * failPenalty)
      )
    );

    // OTIMIZAÇÃO: Alterar height no mobile é lento, scaleY é instantâneo
    elements.catchProgressFill.style.transform = `scaleY(${
      catchProgress / 100
    })`;

    if (catchProgress >= 100) endMinigame(true);
    else if (catchProgress <= 0) endMinigame(false);
    else minigameLoop = requestAnimationFrame(gameLoop);
  }
  minigameLoop = requestAnimationFrame(gameLoop);
}
function endMinigame(success) {
  minigameActive = false;
  audioContext.sounds.battle.pause();
  audioContext.sounds.battle.currentTime = 0;
  fishingSoundPlaying = false;
  audioContext.sounds.fishing.pause();
  audioContext.sounds.fishing.currentTime = 0;
  document.body.classList.remove("minigame-focus");
  if (minigameLoop) cancelAnimationFrame(minigameLoop);
  elements.minigameOverlay.classList.remove("active");
  setTimeout(
    () => elements.minigameOverlay.classList.remove("game-active"),
    300
  );

  if (success && currentFish) {
    gameState.inventory.push({ ...currentFish });
    gameState.totalFish++;
    gameState.caughtCounts[currentFish.id] =
      (gameState.caughtCounts[currentFish.id] || 0) + 1;
    addXP(
      XP_PER_FISH[currentFish.rarity],
      currentFish.id,
      currentFish.difficulty
    );
    renderAlbumInventory();
    showResultModal(true);
  } else showResultModal(false);

  gameState.phase = "idle";
  elements.statusText.textContent = "Pronto para pescar";
  if (!audioContext.musicMuted) playMenuMusic();
  saveGame();
  updateUI();
}

function getDifficultyStars(count) {
  let stars = "";
  for (let i = 0; i < 5; i++) stars += i < count ? "★" : "☆";
  return stars;
}

function showResultModal(success) {
  elements.resultModal.classList.add("active");
  playSound("notification");
  if (success) {
    elements.resultStats.hidden = false;
    elements.resultEmoji.innerHTML = `<img src="${currentFish.image}" class="w-32 h-32 mx-auto object-contain">`;
    elements.resultTitle.textContent = "Pesca Sucesso!";
    elements.resultTitle.style.color = "var(--success)";
    elements.resultDesc.textContent = `Você pescou um(a) ${currentFish.name}!`;
    const xp = Math.floor(
      XP_PER_FISH[currentFish.rarity] *
        (1 + gameState.bonuses.xp / 100) *
        BALANCE.xpMultiplier
    );
    elements.resultStats.innerHTML = `<div class="result-stat-row"><span>Raridade:</span> <span class="result-stat-val ${
      currentFish.rarity
    }">${RARITY_LABELS[
      currentFish.rarity
    ].toUpperCase()}</span></div><div class="result-stat-row"><span>Valor:</span> <span class="result-stat-val gold">$${
      currentFish.price
    }</span></div><div class="result-stat-row"><span>XP:</span> <span class="result-stat-val">+${xp}</span></div>`;
  } else {
    elements.resultEmoji.textContent = "🐡";
    elements.resultTitle.textContent = "Escapou!";
    elements.resultTitle.style.color = "var(--error)";
    elements.resultDesc.textContent = "O peixe foi mais esperto desta vez...";
    elements.resultStats.hidden = true;
  }
}

elements.btnCloseResult.addEventListener("click", () =>
  elements.resultModal.classList.remove("active")
);

function handleHoldStart() {
  if (minigameActive) isHolding = true;
}
function handleHoldEnd() {
  isHolding = false;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    handleHoldStart();
  }
});
document.addEventListener("keyup", (e) => {
  if (e.code === "Space") handleHoldEnd();
});
document.addEventListener("pointerdown", (e) => {
  if (gameState.phase === "fishing") handleHoldStart();
});
document.addEventListener("pointerup", handleHoldEnd);

function sellAllFish() {
  if (
    gameState.inventory.length === 0 ||
    gameState.isSelling ||
    gameState.phase !== "idle"
  )
    return;
  const sellTime = Math.max(
    3000,
    BALANCE.baseSellTime * 1000 - (gameState.boat.speed - 1) * 1000
  );
  gameState.isSelling = true;
  gameState.phase = "selling";
  animateProgress(
    sellTime,
    (p) => {
      const timeLeft = sellTime * (1 - p / 100);
      elements.btnSell.querySelector(".sell-progress").style.width = `${
        100 - p
      }%`;
      elements.sellTimerText.textContent = `Vendendo... ${(
        timeLeft / 1000
      ).toFixed(1)}s`;
    },
    () => completeSell()
  );
}

function completeSell() {
  gameState.phase = "idle";
  const sellBonus = 1 + gameState.bonuses.sell / 100;
  const total = gameState.inventory.reduce(
    (sum, fish) => sum + Math.floor(fish.price * sellBonus),
    0
  );
  gameState.money += total;
  gameState.totalEarned += total;
  gameState.inventory = [];
  gameState.isSelling = false;
  showToast(`Vendeu peixes por $${total.toLocaleString()}!`, "success");
  saveGame();
  updateUI();
}

function buyUpgrade(type, category) {
  if (gameState.isSelling) return;
  let currentLevel, baseCost;
  if (category === "rod") {
    currentLevel = gameState.rod[type];
    baseCost = { depth: 50, stability: 40, bait: 60 }[type];
  } else {
    currentLevel =
      type === "capacity"
        ? Math.floor((gameState.boat.capacity - 10) / 5) + 1
        : gameState.boat[type];
    baseCost = { capacity: 80, speed: 70, sonar: 90 }[type];
  }
  if (currentLevel >= 10) return;
  const cost = Math.floor(baseCost * Math.pow(1.5, currentLevel - 1));
  if (gameState.money < cost) {
    showToast("Dinheiro insuficiente!", "error");
    return;
  }

  gameState.money -= cost;
  if (category === "rod") gameState.rod[type]++;
  else {
    if (type === "capacity") gameState.boat.capacity += 5;
    else gameState.boat[type]++;
  }
  saveGame();
  updateUI();
}

function addBonus(type) {
  if (gameState.bonusPoints <= 0) return;
  gameState.bonuses[type] += BALANCE.bonusValues[type];
  gameState.bonusPoints--;
  saveGame();
  updateUI();
}

elements.menu.btnStart.addEventListener("click", () => {
  showScreen("game");
  updateUI();
});
elements.menu.btnSettings.addEventListener("click", () =>
  showScreen("settings")
);
elements.menu.btnTutorial.addEventListener("click", () =>
  showScreen("tutorial")
);
elements.nav.btnReturnMenu.addEventListener("click", () => {
  showScreen("menu");
  updateMenuUI();
});
elements.nav.btnBackTutorial.addEventListener("click", () =>
  showScreen("menu")
);
elements.nav.btnBackSettings.addEventListener("click", () =>
  showScreen("menu")
);
elements.nav.btnResetSave.addEventListener("click", () => {
  playSound("click");
  document.getElementById("reset-confirm-modal").classList.add("active");
});
elements.btnFish.addEventListener("click", startLocalFishing);
elements.btnSell.addEventListener("click", () => {
  if (!elements.btnSell.disabled) playSound("click");
  sellAllFish();
});

document.getElementById("btn-reset-final").addEventListener("click", () => {
  localStorage.removeItem("fishing-master-save");
  location.reload();
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    playSound("click");
    const tab = btn.dataset.tab;
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${tab}`).classList.add("active");
  });
});

elements.btnDepth.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("depth", "rod");
});
elements.btnStability.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("stability", "rod");
});
elements.btnBait.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("bait", "rod");
});
elements.btnCapacity.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("capacity", "boat");
});
elements.btnSpeed.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("speed", "boat");
});
elements.btnSonar.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("sonar", "boat");
});

document.getElementById("bonus-time").addEventListener("click", () => {
  playSound("click");
  addBonus("time");
});
document.getElementById("bonus-xp").addEventListener("click", () => {
  playSound("click");
  addBonus("xp");
});
document.getElementById("bonus-sell").addEventListener("click", () => {
  playSound("click");
  addBonus("sell");
});
document.getElementById("bonus-rare").addEventListener("click", () => {
  playSound("click");
  addBonus("rare");
});
elements.btnCloseModal.addEventListener("click", () =>
  elements.levelUpModal.classList.remove("active")
);

document
  .querySelectorAll(
    ".mobile-nav-btn[data-target], .mobile-fish-btn[data-target]"
  )
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      playSound("click");
      const target = btn.dataset.target;
      document
        .querySelectorAll(".mobile-nav-btn, .mobile-fish-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document
        .querySelectorAll(".mobile-view")
        .forEach((v) => v.classList.remove("active"));
      const view = document.getElementById(`mobile-view-${target}`);
      if (view) view.classList.add("active");
    });
  });

const btnMobileMapNav = document.getElementById("btn-mobile-map-nav");
if (btnMobileMapNav)
  btnMobileMapNav.addEventListener("click", () => {
    playSound("click");
    openMap();
  });
const btnMobileMenuNav = document.getElementById("btn-mobile-menu-nav");
if (btnMobileMenuNav)
  btnMobileMenuNav.addEventListener("click", () => {
    playSound("click");
    showScreen("menu");
    updateMenuUI();
  });

function switchInventoryTab(tab) {
  playSound("click");
  const cargo = document.getElementById("inventory-cargo-view"),
    album = document.getElementById("inventory-album-view");
  const bCargo = document.getElementById("tab-btn-cargo"),
    bAlbum = document.getElementById("tab-btn-album");
  if (tab === "cargo") {
    cargo.classList.remove("hidden");
    album.classList.add("hidden");
    bCargo.classList.add("border-primary", "text-primary");
    bCargo.classList.remove("border-transparent", "text-gray-500");
    bAlbum.classList.remove("border-primary", "text-primary");
    bAlbum.classList.add("border-transparent", "text-gray-500");
  } else {
    cargo.classList.add("hidden");
    album.classList.remove("hidden");
    bAlbum.classList.add("border-primary", "text-primary");
    bAlbum.classList.remove("border-transparent", "text-gray-500");
    bCargo.classList.remove("border-primary", "text-primary");
    bCargo.classList.add("border-transparent", "text-gray-500");
    renderAlbumInventory();
  }
}

function renderAlbumInventory() {
  const container = document.getElementById("album-list-container");
  if (!container) return;
  document.getElementById(
    "album-progression-text"
  ).textContent = `${gameState.caughtSpecies.length}/${FISH_DATA.length}`;
  container.innerHTML = FISH_DATA.map((fish) => {
    const isCaught = gameState.caughtSpecies.includes(fish.id);
    return `<div onclick="showFishDetails('${
      fish.id
    }')" class="relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
      isCaught
        ? "bg-surface-dark border-primary/30 shadow-lg"
        : "bg-black/40 border-white/5 opacity-40"
    }">
      ${
        isCaught
          ? `<div class="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg z-10 border border-white/10">x${
              gameState.caughtCounts[fish.id] || 0
            }</div>`
          : ""
      }
      <div class="w-12 h-12 flex items-center justify-center mb-2"><img src="${
        fish.image
      }" class="w-full h-full object-contain ${
      isCaught ? "" : "brightness-0 opacity-20"
    }"></div>
      <span class="text-[12px] font-bold uppercase text-center leading-tight ${
        isCaught ? "text-white" : "text-gray-500"
      }">${isCaught ? fish.name : "???"}</span>
      ${
        isCaught
          ? `<span class="text-[8px] text-primary/80 font-black mt-1 uppercase tracking-tighter">${
              RARITY_LABELS[fish.rarity]
            }</span>`
          : ""
      }
      ${
        !isCaught
          ? '<span class="absolute inset-0 flex items-center justify-center text-2xl text-white/5 font-black">?</span>'
          : ""
      }
    </div>`;
  }).join("");
}

function playMenuMusic() {
  if (audioContext.musicMuted) return;
  if (audioContext.currentMenuMusic && !audioContext.currentMenuMusic.paused)
    return;
  if (!audioContext.currentMenuMusic) {
    const available = audioContext.menuPlaylist.filter(
      (m) => !audioContext.playedTracks.includes(m)
    );
    if (available.length === 0) {
      audioContext.playedTracks = [];
      return playMenuMusic();
    }
    const track = available[Math.floor(Math.random() * available.length)];
    audioContext.playedTracks.push(track);
    const audio = new Audio(track);
    audio.loop = true;
    audio.volume = audioContext.musicVolume;
    audioContext.currentMenuMusic = audio;
  }
  audioContext.currentMenuMusic.play().catch(() => {});
}

function stopMenuMusic() {
  if (audioContext.currentMenuMusic) {
    audioContext.currentMenuMusic.pause();
    audioContext.currentMenuMusic = null;
  }
}

document.addEventListener(
  "click",
  () => {
    if (!audioContext.currentMenuMusic && gameState.phase === "idle")
      playMenuMusic();
  },
  { once: true }
);

document.getElementById("volume-music").addEventListener("input", (e) => {
  audioContext.musicVolume = e.target.value;
  if (audioContext.currentMenuMusic)
    audioContext.currentMenuMusic.volume = e.target.value;
  audioContext.sounds.battle.volume = e.target.value;
});

document
  .getElementById("btn-mute-music")
  .addEventListener("click", function () {
    audioContext.musicMuted = !audioContext.musicMuted;
    this.textContent = audioContext.musicMuted ? "Mutado" : "Ativo";
    if (audioContext.musicMuted) {
      stopMenuMusic();
      audioContext.sounds.battle.pause();
    } else {
      if (gameState.phase === "fishing") audioContext.sounds.battle.play();
      else playMenuMusic();
    }
  });

document
  .getElementById("volume-sounds")
  .addEventListener(
    "input",
    (e) => (audioContext.soundsVolume = e.target.value)
  );
document
  .getElementById("btn-mute-sounds")
  .addEventListener("click", function () {
    audioContext.soundsMuted = !audioContext.soundsMuted;
    this.textContent = audioContext.soundsMuted ? "Mutado" : "Ativo";
  });

window.addEventListener("load", () => {
  document.getElementById("setup-nickname").value =
    localStorage.getItem("player-name") || "";
  const status = document.getElementById("loading-status");
  setTimeout(() => (status.textContent = "Limpando o convés..."), 700);
  setTimeout(() => (status.textContent = "Afinando os instrumentos..."), 1400);
  setTimeout(() => {
    document.getElementById("step-loading").classList.add("hidden");
    document.getElementById("step-config").classList.remove("hidden");
  }, 2000);
});

const btnMusicSetup = document.getElementById("setup-music"),
  btnSoundsSetup = document.getElementById("setup-sounds");
btnMusicSetup.addEventListener("click", () => {
  audioContext.musicMuted = !audioContext.musicMuted;
  updateAudioButtons();
});
btnSoundsSetup.addEventListener("click", () => {
  audioContext.soundsMuted = !audioContext.soundsMuted;
  updateAudioButtons();
});

function updateAudioButtons() {
  btnMusicSetup.classList.toggle("opacity-50", audioContext.musicMuted);
  btnMusicSetup.querySelector("span:last-child").textContent = `Música: ${
    audioContext.musicMuted ? "OFF" : "ON"
  }`;
  btnSoundsSetup.classList.toggle("opacity-50", audioContext.soundsMuted);
  btnSoundsSetup.querySelector("span:last-child").textContent = `Sons: ${
    audioContext.soundsMuted ? "OFF" : "ON"
  }`;
  document.getElementById("btn-mute-music").textContent =
    audioContext.musicMuted ? "Mutado" : "Ativo";
  document.getElementById("btn-mute-sounds").textContent =
    audioContext.soundsMuted ? "Mutado" : "Ativo";
}

document.getElementById("btn-go-to-menu").addEventListener("click", () => {
  const nick =
    document.getElementById("setup-nickname").value.trim() || "Pescador";
  gameState.playerName = nick;
  localStorage.setItem("player-name", nick);

  // --- Ação de Áudio aqui ---
  warmUpAudio();
  // --------------------------

  document.getElementById("initial-flow").classList.add("hidden");
  showScreen("menu");
  updateMenuUI();
});

function checkPrestigeEligibility() {
  const nextLevel = gameState.prestigeLevel + 1;
  if (nextLevel > 2)
    return {
      maxed: true,
      eligible: false,
      reqs: { upgrades: true, legendaries: true },
      currentLegendaries: 3,
      neededLegendaries: 3,
    };
  const allUpgradesMaxed =
    gameState.rod.depth >= 10 &&
    gameState.rod.stability >= 10 &&
    gameState.rod.bait >= 10 &&
    gameState.boat.capacity >= 55 &&
    gameState.boat.speed >= 10 &&
    gameState.boat.sonar >= 10;
  const legendaryCaught = FISH_DATA.filter(
    (f) => f.rarity === "legendary" && gameState.caughtSpecies.includes(f.id)
  ).length;
  const reqLendaries = nextLevel === 1 ? 2 : 3;
  return {
    maxed: false,
    eligible: allUpgradesMaxed && legendaryCaught >= reqLendaries,
    reqs: {
      upgrades: allUpgradesMaxed,
      legendaries: legendaryCaught >= reqLendaries,
    },
    neededLegendaries: reqLendaries,
    currentLegendaries: legendaryCaught,
  };
}

function updatePrestigeUI() {
  const status = checkPrestigeEligibility();
  const container = document.getElementById("prestige-requirements");
  const btn = document.getElementById("btn-prestige-action");
  if (status.maxed) {
    container.innerHTML = `<div class="bg-primary/10 p-3 rounded-xl border border-primary/30 text-center"><span class="material-symbols-outlined text-primary mb-1">construction</span><p class="text-[10px] font-bold text-white uppercase">Conteúdo vindo por aí!</p></div>`;
    btn.disabled = true;
    btn.classList.add("disabled");
    btn.textContent = "ÁPICE ATINGIDO";
    return;
  }
  container.innerHTML = `<div class="flex justify-between text-[10px]"><span>Melhorias no Máximo:</span><span class="${
    status.reqs.upgrades ? "text-green-400" : "text-red-400"
  }">${
    status.reqs.upgrades ? "✓" : "✗"
  }</span></div><div class="flex justify-between text-[10px]"><span>Lendários Diferentes:</span><span class="${
    status.reqs.legendaries ? "text-green-400" : "text-red-400"
  }">${status.currentLegendaries}/${status.neededLegendaries}</span></div>`;
  if (status.eligible) {
    btn.disabled = false;
    btn.classList.remove("disabled");
    btn.textContent = `RENASCER PARA NÍVEL ${gameState.prestigeLevel + 1}`;
  } else {
    btn.disabled = true;
    btn.classList.add("disabled");
    btn.textContent = "Requisitos não atendidos";
  }
}

function createPrestigeParticles() {
  const overlay = document.getElementById("flash-overlay");
  if (overlay) overlay.classList.add("flash-active");
  playSound("notification");
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement("div");
    particle.className = "prestige-particle";
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.backgroundColor =
      Math.random() > 0.5 ? "#19a1e6" : "#ffffff";
    particle.style.animationDelay = `${Math.random() * 1}s`;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
  }
}

function performPrestige() {
  const nextLevel = gameState.prestigeLevel + 1;
  createPrestigeParticles();
  setTimeout(() => {
    gameState.prestigeLevel = nextLevel;
    gameState.money = 0;
    gameState.xp = 0;
    gameState.level = 1;
    gameState.rod = { depth: 1, stability: 1, bait: 1 };
    gameState.boat = { capacity: 10, speed: 1, sonar: 1 };
    gameState.inventory = [];
    gameState.caughtSpecies = [];
    gameState.caughtCounts = {};
    gameState.totalFish = 0;
    gameState.totalEarned = 0;
    gameState.bonusPoints = 0;
    gameState.bonuses = { time: 0, xp: 0, sell: 0, rare: 0 };
    saveGame();
    injectPrestigeContent();
    location.reload();
  }, 1500);
}

document.getElementById("btn-prestige-action").addEventListener("click", () => {
  playSound("click");
  document.getElementById("prestige-confirm-modal").classList.add("active");
});
document
  .getElementById("btn-prestige-confirm")
  .addEventListener("click", () => {
    document
      .getElementById("prestige-confirm-modal")
      .classList.remove("active");
    performPrestige();
  });

function showFishDetails(fishId) {
  const fish =
    FISH_DATA.find((f) => f.id === fishId) ||
    PRESTIGE_CONTENT.fish_level_2.find((f) => f.id === fishId);
  if (!fish) return;

  const isCaught = gameState.caughtSpecies.includes(fish.id);
  playSound("click");

  // Aplica o efeito visual se não foi pego
  elements.fishDetails.img.src = fish.image;
  if (!isCaught) {
    elements.fishDetails.img.classList.add("brightness-0", "opacity-20");
  } else {
    elements.fishDetails.img.classList.remove("brightness-0", "opacity-20");
  }

  elements.fishDetails.name.textContent = isCaught ? fish.name : "???";
  elements.fishDetails.price.textContent = isCaught ? `$${fish.price}` : "$???";
  elements.fishDetails.depth.textContent = isCaught
    ? `${fish.minDepth * 10}m`
    : "???m";
  elements.fishDetails.count.textContent = gameState.caughtCounts[fish.id] || 0;

  elements.fishDetails.difficulty.innerHTML = isCaught
    ? getDifficultyStars(fish.difficulty)
    : "?????";
  elements.fishDetails.rarity.textContent = isCaught
    ? RARITY_LABELS[fish.rarity]
    : "Desconhecido";

  elements.fishDetails.rarity.className = `text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
    isCaught ? fish.rarity : "bg-gray-600"
  }`;
  elements.fishDetails.modal.classList.add("active");
  elements.fishDetails.card.style.transform = "translateY(0)";
}

function closeFishDetails() {
  elements.fishDetails.card.style.transform = "translateY(100%)";
  setTimeout(() => {
    elements.fishDetails.modal.classList.remove("active");
  }, 300);
}

elements.fishDetails.btnClose.addEventListener("click", closeFishDetails);

function unlockAllAudio() {
  Object.values(audioContext.sounds).forEach((sound) => {
    sound.muted = true;
    sound
      .play()
      .then(() => {
        sound.pause();
        sound.currentTime = 0;
        sound.muted = false;
      })
      .catch((err) => console.log("Erro no desbloqueio:", err));
  });

  if (!audioContext.musicMuted && gameState.phase === "idle") {
    playMenuMusic();
  }

  // Remove manualmente todos para evitar conflitos
  eventsToUnlock.forEach((event) => {
    document.removeEventListener(event, unlockAllAudio);
  });
}

// Lista de eventos para garantir captura no Android
const eventsToUnlock = ["pointerdown", "touchstart", "click"];
eventsToUnlock.forEach((event) => {
  document.addEventListener(event, unlockAllAudio);
});

function warmUpAudio() {
  // Itera por todos os sons configurados no seu audioContext
  Object.values(audioContext.sounds).forEach((sound) => {
    // Configuramos o volume como 0 e o som como mudo por segurança
    sound.muted = true;
    sound.volume = 0;

    // Toca e pausa imediatamente
    sound
      .play()
      .then(() => {
        sound.pause();
        sound.currentTime = 0;
        sound.muted = false; // Restaura para uso futuro
        sound.volume = audioContext.soundsVolume; // Restaura o volume padrão
      })
      .catch((err) => {
        console.warn("Áudio ainda bloqueado pelo sistema:", err);
      });
  });

  // Se a música estiver ativa, já inicia a trilha do menu
  if (!audioContext.musicMuted) {
    playMenuMusic();
  }
}

function updateFishingSound() {
  if (audioContext.soundsMuted) return;
  const sound = audioContext.sounds.fishing;
  if (isHolding && !fishingSoundPlaying) {
    sound.loop = true;
    sound.volume = audioContext.soundsVolume;
    sound.play().catch(() => {});
    fishingSoundPlaying = true;
  } else if (!isHolding && fishingSoundPlaying) {
    sound.pause();
    sound.currentTime = 0;
    fishingSoundPlaying = false;
  }
}

document.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);

let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (e) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault(); // Bloqueia double-tap zoom
    }
    lastTouchEnd = now;
  },
  false
);

document.addEventListener(
  "contextmenu",
  (e) => {
    e.preventDefault();
  },
  false
);

const areaFishModal = document.getElementById("area-fish-modal");
const areaFishList = document.getElementById("area-fish-list");

document
  .getElementById("map-detail-fish-types")
  .addEventListener("click", () => {
    if (!selectedMapArea) return;
    playSound("click");

    areaFishList.innerHTML = selectedMapArea.fish
      .map((fishId) => {
        const fish = FISH_DATA.find((f) => f.id === fishId);
        const isCaught = gameState.caughtSpecies.includes(fishId);

        return `
            <div class="flex flex-col items-center p-3 bg-white/5 rounded-2xl border border-white/5 ${
              isCaught ? "" : "opacity-40"
            }">
                <img src="${fish.image}" class="w-10 h-10 object-contain mb-2 ${
          isCaught ? "" : "brightness-0"
        }">
                <span class="text-[9px] font-bold text-white text-center leading-tight uppercase truncate w-full">
                    ${isCaught ? fish.name : "???"}
                </span>
                ${
                  isCaught
                    ? `<span class="text-[7px] text-primary font-black uppercase mt-1">${
                        RARITY_LABELS[fish.rarity]
                      }</span>`
                    : ""
                }
            </div>
        `;
      })
      .join("");

    areaFishModal.classList.remove("pointer-events-none");
    areaFishModal.firstElementChild.style.transform = "translateY(0)";
  });

document.getElementById("btn-close-area-fish").addEventListener("click", () => {
  areaFishModal.firstElementChild.style.transform = "translateY(100%)";
  setTimeout(() => areaFishModal.classList.add("pointer-events-none"), 300);
});

// --- MODAL DE DETALHES DO BÔNUS (MARÉ) ---
const eventModal = document.getElementById("event-details-modal");

function getActiveDetailsBonus() {
  const event = getActiveEventForArea(selectedMapArea.id);
  if (!event) return;

  playSound("click");
  const isPos = gameState.activeEvents.positive?.event.id === event.id;

  document.getElementById("event-detail-type-title").textContent = isPos
    ? "Maré Favorável"
    : "Maré Hostil";
  document.getElementById("event-detail-icon").textContent = event.icon;
  document.getElementById("event-detail-name").textContent = event.name;
  document.getElementById("event-detail-desc").textContent = event.desc;

  // Timer simples
  const minutesLeft = Math.ceil(
    (gameState.activeEvents.expires - Date.now()) / 60000
  );
  document.getElementById(
    "event-detail-timer"
  ).textContent = `${minutesLeft}m restantes`;

  eventModal.classList.remove("pointer-events-none");
  eventModal.firstElementChild.style.transform = "translateY(0)";
}

document.getElementById("map-detail-badge").addEventListener("click", (e) => {
  e.stopPropagation(); // Evita conflitos de clique no card
  getActiveDetailsBonus();
});

document
  .getElementById("btn-close-event-details")
  .addEventListener("click", () => {
    eventModal.firstElementChild.style.transform = "translateY(100%)";
    setTimeout(() => eventModal.classList.add("pointer-events-none"), 300);
  });

// Inicialização
loadGame();
updateMenuUI();
// Loop de verificação de marés a cada 30 segundos
setInterval(updateUI, 30000);
