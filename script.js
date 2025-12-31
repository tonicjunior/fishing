const RARITY_LABELS = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Raro",
  legendary: "Lendário",
};

const PRESTIGE_CONTENT = {
  fish_level_1: {
    id: "abyssal_serpent",
    name: "Serpente Abissal",
    rarity: "legendary",
    price: 2500,
    difficulty: 10,
    minDepth: 8,
    emoji: "🐍",
    image: "assets/fish/abyssal_serpent.png",
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
      id: "void_ray",
      name: "Raia do Vazio",
      rarity: "rare",
      price: 800,
      difficulty: 8,
      minDepth: 5,
      emoji: "✨",
      image: "assets/fish/void_ray.png",
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
      id: "",
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
      rarity: "legendary",
      price: 3500,
      difficulty: 10,
      minDepth: 9,
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

function injectPrestigeContent() {
  // Se prestígio >= 1, adiciona o lendário extra se ele ainda não estiver no array global
  if (gameState.prestigeLevel >= 1) {
    if (!FISH_DATA.find((f) => f.id === PRESTIGE_CONTENT.fish_level_1.id)) {
      FISH_DATA.push(PRESTIGE_CONTENT.fish_level_1);
    }
  }

  // Se prestígio >= 2, adiciona o novo mapa e os 4 peixes exclusivos
  if (gameState.prestigeLevel >= 2) {
    if (!AREAS.find((a) => a.id === PRESTIGE_CONTENT.map_level_2.id)) {
      AREAS.push(PRESTIGE_CONTENT.map_level_2);
      PRESTIGE_CONTENT.fish_level_2.forEach((fish) => {
        if (!FISH_DATA.find((f) => f.id === fish.id)) FISH_DATA.push(fish);
      });
    }
  }
}

// FUNÇÃO ÚNICA DE SOM (Unificada)
function playSound(soundKey) {
  if (audioContext.soundsMuted) return;

  const sound = audioContext.sounds[soundKey];
  if (sound) {
    sound.volume = audioContext.soundsVolume;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
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
    image: "assets/fish/whale.png",
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
};

const PRESTIGE_CONFIG = {
  1: {
    requiredLendaries: 2,
    rarityBonus: 8, // +8% chance
    stabilityBonus: 1, // +1 nível extra
    newFish: "ghost_ray",
  },
  2: {
    requiredLendaries: 3,
    newMap: "mystic_ocean",
  },
};

const BALANCE = {
  baseDifficulty: 0.62,
  baseSellTime: 15,
  xpMultiplier: 2.2,
  firstCatchXP: 100,
  bonusValues: { time: 10, xp: 20, sell: 15, rare: 8 },
};

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
    } catch (e) {
      console.error("Failed to load save:", e);
    }
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

  elements.currentAreaEmojiDisplay.textContent = gameState.currentArea.emoji;
  elements.currentAreaNameDisplay.textContent = gameState.currentArea.name;
  elements.areaBadge.querySelector(".area-emoji").textContent =
    gameState.currentArea.emoji;
  elements.areaBadge.querySelector(".area-name").textContent =
    gameState.currentArea.name;

  elements.btnFish.disabled = gameState.phase !== "idle" || count >= capacity;
  elements.btnFish.classList.toggle(
    "pulse",
    gameState.phase === "idle" && count < capacity
  );

  const name =
    gameState.playerName || localStorage.getItem("player-name") || "CORNO";
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
          `<div class="fish-item ${fish.rarity}" title="${fish.name}"><img src="${fish.image}" class="w-8 h-8 object-contain"></div>`
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
  const modal = document.getElementById("message-modal");
  const title = document.getElementById("msg-modal-title");
  const body = document.getElementById("msg-modal-body");
  const icon = document.getElementById("msg-modal-icon");
  const configs = {
    success: { title: "Sucesso!", icon: "✅" },
    error: { title: "Ops!", icon: "❌" },
    info: { title: "Informação", icon: "ℹ️" },
    upgrade: { title: "Melhoria!", icon: "🛠️" },
  };
  const config = configs[type] || configs.info;
  title.textContent = config.title;
  icon.textContent = config.icon;
  body.textContent = message;
  modal.classList.add("active");
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
  showScreen("map");
  renderMapNodes();
  drawMapLines();
  if (gameState.currentArea) selectMapArea(gameState.currentArea);
}

function renderMapNodes() {
  elements.map.container.innerHTML = "";
  AREAS.forEach((area) => {
    const node = document.createElement("div");
    node.className = `map-node pointer-events-auto ${
      gameState.currentArea.id === area.id ? "active" : ""
    }`;
    node.style.top = `${area.coordinates.top}%`;
    node.style.left = `${area.coordinates.left}%`;
    node.dataset.id = area.id;
    let marker =
      gameState.currentArea.id === area.id
        ? `<div class="current-location-marker"><span class="material-symbols-outlined text-[10px] text-white">sailing</span></div>`
        : "";
    node.innerHTML = `<div class="node-icon"><span class="material-symbols-outlined text-white text-2xl">${area.icon}</span>${marker}</div><div class="node-label">${area.name}</div>`;
    node.addEventListener("click", () => selectMapArea(area));
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

// GATILHO DE SALVAMENTO: MUDANÇA DE ÁREA
elements.map.btnTravel.addEventListener("click", () => {
  if (selectedMapArea) {
    playSound("click");
    if (gameState.phase !== "idle") {
      showToast("Você já está ocupado!", "error");
      return;
    }
    gameState.currentArea = selectedMapArea;
    elements.map.card.classList.remove("active");
    showScreen("game");
    saveGame(); // Salvamento aqui
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
  const chances = RARITY_CHANCES[area.id];
  const baitBonus = (gameState.rod.bait - 1) * 2;
  const rareBonus = gameState.bonuses.rare;
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

function startFishing() {
  if (gameState.phase !== "idle") return;
  elements.btnFish.disabled = true;
  elements.btnFish.classList.remove("pulse");
  startTravelSequence();
}

function startTravelSequence() {
  if (gameState.isSelling || gameState.phase === "selling") {
    showToast("Aguarde a venda terminar!", "error");
    return;
  }
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
      // Parar som de viagem ao chegar
      audioContext.sounds.travel.pause();
      audioContext.sounds.travel.currentTime = 0;
      startSearching();
    }
  );
}

function startLocalFishing() {
  if (gameState.isSelling || gameState.phase === "selling") {
    showToast("Aguarde a venda terminar!", "error");
    return;
  }
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
      // Parar som de procurando
      audioContext.sounds.find.pause();
      audioContext.sounds.find.currentTime = 0;

      // Som de peixe encontrado (opcional: usar o notification ou o find sem loop)
      playSound("notification");

      elements.statusText.textContent = "🎣 PEIXE ENCONTRADO!";
      elements.statusText.classList.add("pulse");
      setTimeout(() => {
        elements.statusText.classList.remove("pulse");
        startCountdown();
      }, 1000);
    }
  );
}

function startCountdown() {
  stopMenuMusic();
  playSound("battle");
  elements.minigameFishEmoji.innerHTML = "";
  elements.minigameFishName.textContent = "Calculando...";
  elements.minigameDifficulty.innerHTML = "";
  elements.minigameOverlay.classList.add("active");
  elements.countdown.classList.add("active");
  let count = 3;
  elements.countdown.textContent = count;
  const countInterval = setInterval(() => {
    count--;
    if (count > 0) elements.countdown.textContent = count;
    else {
      clearInterval(countInterval);
      elements.countdown.textContent = "GO!";
      setTimeout(() => {
        elements.countdown.classList.remove("active");
        elements.minigameOverlay.classList.add("game-active");
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

function startMinigame() {
  gameState.phase = "fishing";
  currentFish = selectRandomFish();
  document.body.classList.add("minigame-focus");
  elements.minigameFishEmoji.innerHTML = `<img src="${currentFish.image}" class="w-20 h-20 object-contain mx-auto">`;
  elements.minigameFishName.textContent = currentFish.name;
  elements.minigameDifficulty.innerHTML = getDifficultyStars(
    currentFish.difficulty
  );
  const fishInner = document.getElementById("fish-marker-inner");
  if (fishInner)
    fishInner.innerHTML = `<img src="${currentFish.image}" class="w-16 h-16 object-contain">`;

  zonePosition = 50;
  fishPosition = 50;
  fishVelocity = 0;
  fishDirection = 1;
  catchProgress = 30;
  isHolding = false;
  minigameActive = true;
  minigameStartTime = performance.now();
  const prestigeStability = gameState.prestigeLevel >= 1 ? 1.5 : 0; // Ex: +1.5 níveis de estabilidade
  const finalHeightPct = Math.min(
    40,
    20 + (gameState.rod.stability - 1 + prestigeStability) * 1.5
  );
  elements.catchZone.style.height = `${finalHeightPct}%`;

  let lastTime = performance.now();
  function gameLoop(currentTime) {
    if (!minigameActive) return;
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;
    const difficulty = Math.max(
      1,
      currentFish.difficulty * BALANCE.baseDifficulty -
        gameState.rod.stability / 4
    );
    if (currentTime - minigameStartTime > 1000) {
      if (Math.random() < 0.02 + difficulty * 0.005) {
        fishDirection = Math.random() > 0.5 ? 1 : -1;
        fishVelocity = (Math.random() * 100 + 50) * (difficulty / 3);
      }
      fishPosition += fishVelocity * fishDirection * deltaTime;
      if (fishPosition <= 0 || fishPosition >= 100) {
        fishDirection *= -1;
        fishPosition = Math.max(0, Math.min(100, fishPosition));
      }
    }
    zonePosition += (isHolding ? -185 : 75) * deltaTime;
    zonePosition = Math.max(0, Math.min(100, zonePosition));
    const maxTop = 100 - finalHeightPct;
    elements.catchZone.style.top = `${(zonePosition / 100) * maxTop}%`;
    elements.fishMarker.style.top = `${Math.max(
      5,
      Math.min(95, fishPosition)
    )}%`;
    const inner = document.getElementById("fish-marker-inner");
    if (inner) inner.style.transform = `scaleX(${fishDirection > 0 ? 1 : -1})`;
    const vTop = (zonePosition / 100) * maxTop;
    const inZone =
      fishPosition >= vTop && fishPosition <= vTop + finalHeightPct;
    elements.catchZone.classList.toggle("catching", inZone);
    catchProgress = Math.max(
      0,
      Math.min(100, catchProgress + (inZone ? 0.4 : -0.25))
    );
    elements.catchProgressFill.style.height = `${catchProgress}%`;
    if (catchProgress >= 100) endMinigame(true);
    else if (catchProgress <= 0) endMinigame(false);
    else minigameLoop = requestAnimationFrame(gameLoop);
  }
  minigameLoop = requestAnimationFrame(gameLoop);
}

// GATILHO DE SALVAMENTO: FIM DE PESCA
function endMinigame(success) {
  minigameActive = false;
  audioContext.sounds.travel.pause();
  audioContext.sounds.find.pause();
  audioContext.sounds.battle.pause();
  audioContext.sounds.battle.currentTime = 0;
  audioContext.sounds.fishing.pause();
  document.body.classList.remove("minigame-focus");
  if (minigameLoop) cancelAnimationFrame(minigameLoop);
  if (window.navigator.vibrate)
    window.navigator.vibrate(success ? 50 : [50, 50, 50]);
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
    showResultModal(true);
  } else showResultModal(false);

  gameState.phase = "idle";
  elements.statusText.textContent = "Pronto para pescar";
  if (!audioContext.musicMuted) playMenuMusic();

  saveGame(); // Salvamento aqui
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
  if (minigameActive) {
    isHolding = true;
    if (!audioContext.soundsMuted)
      audioContext.sounds.fishing.play().catch(() => {});
  }
}
function handleHoldEnd() {
  isHolding = false;
  audioContext.sounds.fishing.pause();
  audioContext.sounds.fishing.currentTime = 0;
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
document.addEventListener("mousedown", () => handleHoldStart());
document.addEventListener("mouseup", handleHoldEnd);
document.addEventListener("pointerdown", handleHoldStart);
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

// GATILHO DE SALVAMENTO: VENDA
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
  showToast(
    `Vendeu todos os peixes por $${total.toLocaleString()}!`,
    "success"
  );
  saveGame(); // Salvamento aqui
  updateUI();
}

// GATILHO DE SALVAMENTO: UPGRADE
function buyUpgrade(type, category) {
  if (gameState.isSelling) {
    showToast("Aguarde a venda terminar!", "error");
    return;
  }
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

  if (currentLevel >= 10) {
    showToast("Já está no nível máximo!", "error");
    return;
  }
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

  saveGame(); // Salvamento aqui
  updateUI();
}

// GATILHO DE SALVAMENTO: BONUS
function addBonus(type) {
  if (gameState.bonusPoints <= 0) return;
  gameState.bonuses[type] += BALANCE.bonusValues[type];
  gameState.bonusPoints--;
  saveGame(); // Salvamento aqui
  updateUI();
}

// NAVEGAÇÃO E MENUS
elements.menu.btnStart.addEventListener("click", () => {
  // CORREÇÃO: Removido stopMenuMusic() para a música continuar ao entrar no jogo
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
  if (confirm("Tem certeza?")) {
    localStorage.removeItem("fishing-master-save");
    location.reload();
  }
});

elements.btnFish.addEventListener("click", startLocalFishing);
elements.btnSell.addEventListener("click", () => {
  if (!elements.btnSell.disabled) playSound("click");
  sellAllFish();
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
  playSound("click"); // <-- Adicionado
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

// MOBILE NAV
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
    return `<div class="relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
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

// ÁUDIO E CONFIGURAÇÕES
function playMenuMusic() {
  if (audioContext.musicMuted) return;

  // Se já existe uma música tocando, não faz nada
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

// FLUXO INICIAL
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
}

document.getElementById("btn-go-to-menu").addEventListener("click", () => {
  const nick =
    document.getElementById("setup-nickname").value.trim() || "CORNO";
  gameState.playerName = nick;
  localStorage.setItem("player-name", nick);
  document.getElementById("initial-flow").classList.add("hidden");
  showScreen("menu");
  updateMenuUI();
  if (!audioContext.musicMuted) playMenuMusic();
});

function checkPrestigeEligibility() {
  const nextLevel = gameState.prestigeLevel + 1;

  // Se já passou do nível 2, retorna um estado de "Fim de Jogo"
  if (nextLevel > 2) {
    return {
      maxed: true,
      eligible: false,
      reqs: { upgrades: true, legendaries: true },
      currentLegendaries: 3,
      neededLegendaries: 3,
    };
  }

  // 1. Verificar Melhorias (Vara nível 10 e Barco nível 10)
  const allUpgradesMaxed =
    gameState.rod.depth >= 10 &&
    gameState.rod.stability >= 10 &&
    gameState.rod.bait >= 10 &&
    gameState.boat.capacity >= 55 &&
    gameState.boat.speed >= 10 &&
    gameState.boat.sonar >= 10;

  // 2. Verificar Lendários Diferentes pescados
  const legendaryCaught = FISH_DATA.filter(
    (f) => f.rarity === "legendary" && gameState.caughtSpecies.includes(f.id)
  ).length;

  const reqLendaries = nextLevel === 1 ? 2 : 3;

  const requirements = {
    upgrades: allUpgradesMaxed,
    legendaries: legendaryCaught >= reqLendaries,
  };

  return {
    maxed: false,
    eligible: requirements.upgrades && requirements.legendaries,
    reqs: requirements,
    neededLegendaries: reqLendaries,
    currentLegendaries: legendaryCaught,
  };
}

function updatePrestigeUI() {
  const status = checkPrestigeEligibility();
  const container = document.getElementById("prestige-requirements");
  const btn = document.getElementById("btn-prestige-action");

  // Se atingiu o nível máximo de prestígio disponível
  if (status.maxed) {
    container.innerHTML = `
        <div class="bg-primary/10 p-3 rounded-xl border border-primary/30 text-center">
            <span class="material-symbols-outlined text-primary mb-1">construction</span>
            <p class="text-[10px] font-bold text-white uppercase">Conteúdo vindo por aí!</p>
            <p class="text-[9px] text-gray-400">Você atingiu o ápice atual. Novos horizontes estão sendo mapeados...</p>
        </div>
    `;
    btn.disabled = true;
    btn.classList.add("disabled");
    btn.textContent = "ÁPICE ATINGIDO";
    return;
  }

  // Interface normal para níveis 0 e 1
  container.innerHTML = `
        <div class="flex justify-between text-[10px]">
            <span>Melhorias no Máximo:</span>
            <span class="${
              status.reqs.upgrades ? "text-green-400" : "text-red-400"
            }">
                ${status.reqs.upgrades ? "✓" : "✗"}
            </span>
        </div>
        <div class="flex justify-between text-[10px]">
            <span>Lendários Diferentes:</span>
            <span class="${
              status.reqs.legendaries ? "text-green-400" : "text-red-400"
            }">
                ${status.currentLegendaries}/${status.neededLegendaries}
            </span>
        </div>
    `;

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

function performPrestige() {
  const nextLevel = gameState.prestigeLevel + 1;

  // Executa a animação visual primeiro
  createPrestigeParticles();

  // Aguarda o tempo da animação (1.5s) para realizar o reset e reload
  setTimeout(() => {
    // RESET TOTAL DO ESTADO
    gameState.prestigeLevel = nextLevel;
    gameState.money = 0;
    gameState.xp = 0;
    gameState.level = 1;
    gameState.rod = { depth: 1, stability: 1, bait: 1 };
    gameState.boat = { capacity: 10, speed: 1, sonar: 1 };
    gameState.inventory = [];

    // LIMPEZA COMPLETA DO ÁLBUM E ESTATÍSTICAS
    gameState.caughtSpecies = [];
    gameState.caughtCounts = {};
    gameState.totalFish = 0;
    gameState.totalEarned = 0;
    gameState.bonusPoints = 0;
    gameState.bonuses = { time: 0, xp: 0, sell: 0, rare: 0 };

    // Salva o estado resetado antes do reload
    saveGame();

    // Injeta os novos peixes/mapas desbloqueados pelo novo nível de prestígio
    injectPrestigeContent();

    // Recarrega a página para limpar todos os caches visuais e aplicar o reset
    location.reload();
  }, 1500);
}

function createPrestigeParticles() {
  const overlay = document.getElementById("flash-overlay");
  if (overlay) overlay.classList.add("flash-active");

  // Tocar um som épico se houver (opcional)
  playSound("notification");

  for (let i = 0; i < 80; i++) {
    // Aumentei para 80 para ser mais impactante
    const particle = document.createElement("div");
    particle.className = "prestige-particle";

    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    // Cores variando entre o azul primário e branco
    particle.style.backgroundColor =
      Math.random() > 0.5 ? "#19a1e6" : "#ffffff";
    particle.style.animationDelay = `${Math.random() * 1}s`;

    document.body.appendChild(particle);

    // Limpeza da memória
    setTimeout(() => particle.remove(), 2000);
  }
}

function performPrestige() {
  const nextLevel = gameState.prestigeLevel + 1;

  // 1. Iniciar Animação Visual
  createPrestigeParticles();

  // 2. Reset Total com Limpeza do Álbum
  setTimeout(() => {
    gameState.prestigeLevel = nextLevel;
    gameState.money = 0;
    gameState.xp = 0;
    gameState.level = 1;
    gameState.rod = { depth: 1, stability: 1, bait: 1 };
    gameState.boat = { capacity: 10, speed: 1, sonar: 1 };
    gameState.inventory = [];

    // LIMPEZA DO ÁLBUM (Como solicitado)
    gameState.caughtSpecies = [];
    gameState.caughtCounts = {};
    gameState.totalFish = 0;
    gameState.totalEarned = 0;
    gameState.bonusPoints = 0;
    gameState.bonuses = { time: 0, xp: 0, sell: 0, rare: 0 };

    saveGame();
    injectPrestigeContent();
    location.reload();
  }, 1500); // Tempo para a animação aparecer antes de recarregar
}

// Evento do botão da aba Prestígio (Abre a Modal em vez de Alerta)
document.getElementById("btn-prestige-action").addEventListener("click", () => {
  // Som de clique ao abrir a modal
  playSound("click");
  document.getElementById("prestige-confirm-modal").classList.add("active");
});

document
  .getElementById("btn-prestige-confirm")
  .addEventListener("click", () => {
    // Fecha a modal imediatamente para não atrapalhar a visão das partículas
    document
      .getElementById("prestige-confirm-modal")
      .classList.remove("active");

    // Inicia o processo de renascimento com animação
    performPrestige();
  });

loadGame();
updateMenuUI();
