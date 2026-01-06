const CURRENT_VERSION = "0.2.56";
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const TARGET_FPS = isMobile ? 70 : 70;
const FRAME_TIME = 1000 / TARGET_FPS;

const RARITY_LABELS = {
  common: "Comum",
  uncommon: "Raro",
  rare: "Épico",
  legendary: "Lendário",
};

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
      id: "abyssal",
      name: "Aberração Abissal",
      rarity: "legendary",
      price: 4500,
      difficulty: 11,
      minDepth: 8,
      emoji: "🕳️",
      image: "assets/fish/abyssal.gif",
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

const BALANCE = {
  baseDifficulty: 0.62,
  baseSellTime: 15,
  xpMultiplier: 2.2,
  firstCatchXP: 100,
  fishSlowValue: 2,
  bonusValues: { fishSlow: 1, xp: 20, sell: 15, rare: 8 },
  eventInterval: 2.5 * 60 * 1000, // 2.5 minutos
};

const XP_PER_FISH = { common: 5, uncommon: 15, rare: 40, legendary: 100 };
const XP_PER_LEVEL = 100;

const elements = {
  repescagem: {
    overlay: document.getElementById("repescagem-overlay"),
    pointer: document.getElementById("repescagem-pointer"),
    zones: document.getElementById("repescagem-zones"),
    btn: document.getElementById("repescagem-btn"),
    message: document.getElementById("repescagem-message"),
    attempts: document.getElementById("repescagem-attempts"),
  },
  screens: {
    menu: document.getElementById("menu-screen"),
    game: document.getElementById("game-screen"),
    settings: document.getElementById("settings-screen"),
    map: document.getElementById("map-screen"),
  },
  menu: {
    btnStart: document.getElementById("btn-start-game"),
    btnSettings: document.getElementById("btn-settings-menu"),
    levelDisplay: document.getElementById("menu-level-display"),
    moneyDisplay: document.getElementById("menu-money-display"),
  },
  nav: {
    btnReturnMenu: document.getElementById("btn-return-menu"),
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
  speedDots: document.getElementById("speed-dots"),
  sonarDots: document.getElementById("sonar-dots"),
  btnDepth: document.getElementById("btn-depth"),
  btnStability: document.getElementById("btn-stability"),
  btnBait: document.getElementById("btn-bait"),
  btnSpeed: document.getElementById("btn-speed"),
  btnSonar: document.getElementById("btn-sonar"),
  bonusPoints: document.getElementById("bonus-points"),
  fishSlowBonus: document.getElementById("bonus-fishSpeed"),
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

const fishMarkerInner = document.getElementById("fish-marker-inner");
const eventModal = document.getElementById("event-details-modal");
const areaFishModal = document.getElementById("area-fish-modal");
const areaFishList = document.getElementById("area-fish-list");

let activeEventAtStart = null;
let lastFrameTime = 0;
let lastTime = 0;
let gameState = getDefaultGameState();

let selectedMapArea = null;
let fishDecisionTimer = 0;
let fishingSoundPlaying = false;
let currentAnimation = null;
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
let barHeight = 0;
let zoneHeight = 0;
let lastHoldingState = false;
let repescagemActive = false;
let pointerAngle = 0;
let successZones = { white: { start: 0, end: 0 }, gold: { start: 0, end: 0 } };
let currentRepescagemAttempts = 0;
let successfulHits = 0;
let repescagemTimer = 20;
let repescagemTimerInterval = null;
let repescagemPaused = false;
let repescagemBlinkInterval = null;
let lastPointerAngle = 0;


function getDefaultGameState() {
  return {
    money: 0,
    xp: 0,
    level: 1,
    bonusPoints: 0,
    totalFish: 0,
    totalEarned: 0,
    rod: { depth: 1, stability: 1, bait: 1 },
    boat: { repescagem: 1, capacity: 5, speed: 1, sonar: 1 },
    bonuses: { fishSlow: 0, xp: 0, sell: 0, rare: 0 },
    inventory: [],
    caughtSpecies: [],
    caughtCounts: {},
    currentArea: AREAS[0], 
    phase: "idle",
    isSelling: false,
    prestigeLevel: 0,
    prestigePoints: 0,
    activeEvents: { positive: null, negative: null, expires: 0 },
    lastVersionSeen: CURRENT_VERSION,
    antilag: false,
    repescagemAttempted: false,
  };
}