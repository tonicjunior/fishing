const FISH_DATA = [
  {
    id: "sardine",
    name: "Sardinha",
    rarity: "common",
    price: 10,
    difficulty: 1,
    minDepth: 1,
    emoji: "🐟",
  },
  {
    id: "anchovy",
    name: "Anchova",
    rarity: "common",
    price: 12,
    difficulty: 1,
    minDepth: 1,
    emoji: "🐟",
  },
  {
    id: "herring",
    name: "Arenque",
    rarity: "common",
    price: 15,
    difficulty: 2,
    minDepth: 1,
    emoji: "🐟",
  },
  {
    id: "mackerel",
    name: "Cavala",
    rarity: "common",
    price: 18,
    difficulty: 2,
    minDepth: 1,
    emoji: "🐠",
  },
  {
    id: "bass",
    name: "Robalo",
    rarity: "uncommon",
    price: 35,
    difficulty: 3,
    minDepth: 2,
    emoji: "🐠",
  },
  {
    id: "trout",
    name: "Truta",
    rarity: "uncommon",
    price: 40,
    difficulty: 4,
    minDepth: 2,
    emoji: "🐠",
  },
  {
    id: "salmon",
    name: "Salmão",
    rarity: "uncommon",
    price: 50,
    difficulty: 4,
    minDepth: 3,
    emoji: "🐠",
  },
  {
    id: "tuna",
    name: "Atum",
    rarity: "uncommon",
    price: 60,
    difficulty: 5,
    minDepth: 3,
    emoji: "🐟",
  },
  {
    id: "swordfish",
    name: "Peixe-Espada",
    rarity: "rare",
    price: 120,
    difficulty: 6,
    minDepth: 5,
    emoji: "🗡️",
  },
  {
    id: "octopus",
    name: "Polvo",
    rarity: "rare",
    price: 150,
    difficulty: 7,
    minDepth: 5,
    emoji: "🐙",
  },
  {
    id: "lobster",
    name: "Lagosta",
    rarity: "rare",
    price: 180,
    difficulty: 7,
    minDepth: 6,
    emoji: "🦞",
  },
  {
    id: "shark",
    name: "Tubarão",
    rarity: "rare",
    price: 250,
    difficulty: 8,
    minDepth: 7,
    emoji: "🦈",
  },
  {
    id: "whale",
    name: "Baleia Dourada",
    rarity: "legendary",
    price: 700,
    difficulty: 9,
    minDepth: 8,
    emoji: "🐋",
  },
  {
    id: "kraken",
    name: "Kraken Bebê",
    rarity: "legendary",
    price: 1250,
    difficulty: 10,
    minDepth: 9,
    emoji: "🦑",
  },
  {
    id: "mermaid_fish",
    name: "Peixe da Sereia",
    rarity: "legendary",
    price: 2000,
    difficulty: 10,
    minDepth: 10,
    emoji: "✨",
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
    coordinates: { top: 35, left: 70 },
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
    coordinates: { top: 52, left: 82 },
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
  currentArea: AREAS[0],
  phase: "idle",
  isSelling: false,
};

function loadGame() {
  const saved = localStorage.getItem("fishing-master-save");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      gameState = { ...gameState, ...parsed };
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

  saveGame();
}

function updateFishInventory() {
  if (gameState.inventory.length === 0) {
    elements.fishInventory.innerHTML = `<div class="empty-boat"><span>🎣</span><p>Barco vazio</p><p class="small">Vá pescar!</p></div>`;
  } else {
    elements.fishInventory.innerHTML = gameState.inventory
      .map(
        (fish) =>
          `<div class="fish-item ${fish.rarity}" title="${fish.name} - $${fish.price}">${fish.emoji}</div>`
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
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
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

// --- Map Logic ---

function openMap() {
  showScreen("map");
  renderMapNodes();
  drawMapLines();
  if (gameState.currentArea) {
    selectMapArea(gameState.currentArea);
  }
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

    let marker = "";
    if (gameState.currentArea.id === area.id) {
      marker = `<div class="current-location-marker"><span class="material-symbols-outlined text-[10px] text-white">sailing</span></div>`;
    }

    node.innerHTML = `
            <div class="node-icon">
                <span class="material-symbols-outlined text-white text-2xl">${area.icon}</span>
                ${marker}
            </div>
            <div class="node-label">${area.name}</div>
        `;

    node.addEventListener("click", () => selectMapArea(area));
    elements.map.container.appendChild(node);
  });
}

function drawMapLines() {
  const svg = elements.map.svg;
  svg.innerHTML = "";
  const points = AREAS.map((a) => a.coordinates);

  // Draw lines connecting sequential areas
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // Control point for curve
    const cx = (start.left + end.left) / 2;
    const cy = (start.top + end.top) / 2 - 10; // slightly curved up

    const d = `M ${start.left}% ${start.top}% Q ${cx}% ${cy}% ${end.left}% ${end.top}%`;

    // path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#19a1e6");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-dasharray", "6 4");
    path.setAttribute("class", "marching-ants opacity-60");

    svg.appendChild(path);
  }
}

function selectMapArea(area) {
  selectedMapArea = area;
  elements.map.card.classList.add("active");
  elements.map.title.textContent = area.name;
  elements.map.time.textContent = `${getTravelTime(area).toFixed(1)}s`;

  // Difficulty Stars
  let starsHtml = "";
  for (let i = 0; i < 5; i++) {
    if (i < area.difficulty)
      starsHtml += `<span class="material-symbols-outlined star-filled">star</span>`;
    else
      starsHtml += `<span class="material-symbols-outlined star-empty">star</span>`;
  }
  elements.map.stars.innerHTML = starsHtml;

  const depthInfo = area.fish.map(
    (id) => FISH_DATA.find((f) => f.id === id)?.minDepth || 0
  );
  const minDepth = Math.min(...depthInfo);
  const maxDepth = Math.max(...depthInfo);
  elements.map.depth.textContent = `Nível ${minDepth} - ${maxDepth}`;
  elements.map.fishCount.textContent = `${area.fish.length} Espécies`;

  document.querySelectorAll(".map-node").forEach((n) => {
    n.classList.toggle("active", n.dataset.id === area.id);
  });
}

elements.map.btnTravel.addEventListener("click", () => {
  if (selectedMapArea) {
    if (gameState.phase !== "idle") {
      showToast("Você já está ocupado!", "error");
      return;
    }
    gameState.currentArea = selectedMapArea;
    elements.map.card.classList.remove("active");
    showScreen("game");
    updateUI();

    // MUDANÇA AQUI: Chama a sequência de viagem
    startTravelSequence();
  }
});

elements.nav.btnOpenMap.addEventListener("click", openMap);
elements.nav.btnCloseMap.addEventListener("click", () => {
  elements.map.card.classList.remove("active");
  showScreen("game");
});

// --- Fishing Logic ---

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

function addXP(amount) {
  const xpBonus = 1 + gameState.bonuses.xp / 100;
  const xpGain = Math.floor(amount * xpBonus);
  gameState.xp += xpGain;
  const xpForLevel = XP_PER_LEVEL * gameState.level;
  if (gameState.xp >= xpForLevel) {
    gameState.xp -= xpForLevel;
    gameState.level++;
    gameState.bonusPoints++;
    elements.newLevel.textContent = gameState.level;
    elements.levelUpModal.classList.add("active");
  }
}

let phaseInterval = null;

function startFishing() {
  if (gameState.phase !== "idle") return;
  if (gameState.inventory.length >= gameState.boat.capacity) {
    showToast("Barco cheio! Venda seus peixes.", "error");
    return;
  }
  if (phaseInterval) clearInterval(phaseInterval);
  gameState.phase = "traveling";
  elements.boat.classList.add("traveling");
  elements.progressBar.classList.add("active");
  elements.statusText.textContent = `Viajando para ${gameState.currentArea.name}...`;
  elements.statusText.className = "status-text traveling";
  const travelTime = getTravelTime(gameState.currentArea);
  let progress = 0;
  updateUI();
  phaseInterval = setInterval(() => {
    progress += 100 / (travelTime * 10);
    elements.progressFill.style.width = `${Math.min(100, progress)}%`;
    if (progress >= 100) {
      clearInterval(phaseInterval);
      startSearching();
    }
  }, 100);
}

function startTravelSequence() {
  if (gameState.phase !== "idle") return;

  if (gameState.inventory.length >= gameState.boat.capacity) {
    showToast("Barco cheio! Venda seus peixes.", "error");
    return;
  }

  if (phaseInterval) clearInterval(phaseInterval);

  // Configura fase de viagem
  gameState.phase = "traveling";
  elements.boat.classList.add("traveling");
  elements.progressBar.classList.add("active");
  elements.statusText.textContent = `Viajando para ${gameState.currentArea.name}...`;
  elements.statusText.className = "status-text traveling";

  const travelTime = getTravelTime(gameState.currentArea);
  let progress = 0;

  updateUI();

  phaseInterval = setInterval(() => {
    progress += 100 / (travelTime * 10);
    elements.progressFill.style.width = `${Math.min(100, progress)}%`;
    if (progress >= 100) {
      clearInterval(phaseInterval);
      startSearching(); // Ao terminar a viagem, começa a buscar
    }
  }, 100);
}

function startLocalFishing() {
  if (gameState.phase !== "idle") return;

  if (gameState.inventory.length >= gameState.boat.capacity) {
    showToast("Barco cheio! Venda seus peixes.", "error");
    return;
  }

  // Pula a animação de viagem e vai direto para a busca
  startSearching();
}

function startSearching() {
  gameState.phase = "searching";
  elements.boat.classList.remove("traveling");
  elements.statusText.textContent = "Procurando peixes...";
  elements.statusText.className = "status-text searching";
  elements.progressFill.style.width = "0%";
  const searchTime = getSearchTime();
  let progress = 0;
  if (phaseInterval) clearInterval(phaseInterval);
  phaseInterval = setInterval(() => {
    progress += 100 / (searchTime * 10);
    elements.progressFill.style.width = `${Math.min(100, progress)}%`;
    if (progress >= 100) {
      clearInterval(phaseInterval);
      elements.statusText.textContent = "🎣 PEIXE ENCONTRADO!";
      elements.statusText.classList.add("pulse");
      setTimeout(() => {
        elements.statusText.classList.remove("pulse");
        startCountdown();
      }, 1000);
    }
  }, 100);
}

function startCountdown() {
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
      elements.countdown.textContent = "GO!";
      setTimeout(() => {
        elements.countdown.classList.remove("active");
        elements.minigameOverlay.classList.add("game-active");
        startMinigame();
      }, 500);
    }
  }, 500);
}

let currentFish = null;
let minigameActive = false;
let isHolding = false;
let zonePosition = 50;
let fishPosition = 50;
let fishVelocity = 0;
let fishDirection = 1;
let catchProgress = 40;
let minigameLoop = null;
let minigameStartTime = 0;

// --- ATUALIZAÇÃO DA LÓGICA DO MINIGAME ---

function startMinigame() {
  gameState.phase = "fishing";

  // Setup dos dados do peixe
  currentFish = selectRandomFish();

  // Atualiza HUD Lateral
  elements.minigameFishEmoji.textContent = currentFish.emoji;
  elements.minigameFishName.textContent = currentFish.name;
  elements.minigameDifficulty.innerHTML = getDifficultyStars(
    currentFish.difficulty
  ); // Helper function abaixo

  // Setup do visual da barra
  const fishMarkerInner = document.querySelector("#fish-marker-inner span");
  if (fishMarkerInner) fishMarkerInner.textContent = currentFish.emoji;

  // Reset de variáveis físicas
  zonePosition = 50;
  fishPosition = 50;
  fishVelocity = 0;
  fishDirection = 1;
  catchProgress = 30; // Começa um pouco mais baixo para dar tensão
  isHolding = false;
  minigameActive = true;
  minigameStartTime = performance.now();

  // Ajuste do tamanho da barra baseado na estabilidade (RPG Element)
  const baseZoneHeight = 20; // Em porcentagem agora, para facilitar CSS responsiveness
  const bonusHeight = (gameState.rod.stability - 1) * 1.5;
  const finalHeightPct = Math.min(35, baseZoneHeight + bonusHeight);
  elements.catchZone.style.height = `${finalHeightPct}%`;

  let lastTime = performance.now();

  function gameLoop(currentTime) {
    if (!minigameActive) return;

    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Warmup: 1 segundo inicial para o jogador se preparar
    const isWarmup = currentTime - minigameStartTime < 1000;

    // --- LÓGICA DO PEIXE (IA) ---
    const difficulty = Math.max(
      1,
      currentFish.difficulty - Math.floor(gameState.rod.stability / 3)
    );

    if (!isWarmup) {
      // Chance do peixe mudar de direção
      const changeChance = 0.02 + difficulty * 0.005;

      if (Math.random() < changeChance) {
        fishDirection = Math.random() > 0.5 ? 1 : -1;
        // Velocidade baseada na dificuldade
        fishVelocity = (Math.random() * 100 + 50) * (difficulty / 3);
      }

      // Aplica movimento
      fishPosition += fishVelocity * fishDirection * deltaTime;

      // Colisão com as paredes (quica)
      if (fishPosition <= 0 || fishPosition >= 100) {
        fishDirection *= -1;
        fishPosition = Math.max(0, Math.min(100, fishPosition));
      }
    } else {
      // Durante warmup, peixe fica no meio
      fishPosition = 50;
    }

    // --- LÓGICA DO JOGADOR (Física da Barra) ---
    const gravity = 75;
    const lift = -185; // Velocidade de subida
    const velocity = isHolding ? lift : gravity;

    zonePosition += velocity * deltaTime;
    zonePosition = Math.max(0, Math.min(100, zonePosition));

    const barContainerHeight = elements.fishingBar.clientHeight;
    const zoneContainerHeight = elements.catchZone.clientHeight;

    const maxTop = 100 - finalHeightPct;
    const visualZoneTop = (zonePosition / 100) * maxTop;

    elements.catchZone.style.top = `${visualZoneTop}%`;

    // 2. Marcador do Peixe
    // O peixe é apenas um ponto, então pode ir de 0 a 100% (menos um offset visual)
    const visualFishTop = fishPosition;
    // Ajuste fino para o peixe não sair da borda visualmente (padding)
    const clampedFishTop = Math.max(5, Math.min(95, visualFishTop));
    elements.fishMarker.style.top = `${clampedFishTop}%`;

    // Visual: Rotação do peixe baseada na direção (Flip horizontal)
    const fishInner = document.getElementById("fish-marker-inner");
    if (fishInner) {
      // Se a barra é vertical, o peixe nada para os lados? Visualmente sim.
      // Se fishDirection for 1 (descendo/positive) ou -1.
      // Vamos fazer ele "olhar" levemente para cima ou baixo ou dar um tilt.
      // Melhor: Tilt de 45 graus quando move rápido
      const tilt = fishDirection * 20;
      fishInner.style.transform = `rotate(${tilt}deg) scaleX(${
        fishDirection > 0 ? 1 : -1
      })`;
    }

    const zoneTopVal = visualZoneTop;
    const zoneBottomVal = visualZoneTop + finalHeightPct;

    const isInZone =
      clampedFishTop >= zoneTopVal && clampedFishTop <= zoneBottomVal;

    elements.catchZone.classList.toggle("catching", isInZone);

    // Taxa de captura
    const changeRate = isInZone ? 0.4 : -0.25; // Ajuste de dificuldade aqui

    if (!isWarmup || isInZone) {
      catchProgress = Math.max(0, Math.min(100, catchProgress + changeRate));
    }

    // Atualiza barra de progresso lateral
    elements.catchProgressFill.style.height = `${catchProgress}%`;

    // Classes de cor e efeito de tremor (Shaking)
    elements.catchProgressFill.classList.remove("low", "medium");
    elements.fishingBar.classList.remove("shaking");

    if (catchProgress < 30) {
      elements.catchProgressFill.classList.add("low");
      if (!isInZone) elements.fishingBar.classList.add("shaking"); // Treme se estiver perdendo e fora da zona
    } else if (catchProgress < 60) {
      elements.catchProgressFill.classList.add("medium");
    }

    // Condição de Vitória/Derrota
    if (catchProgress >= 100) {
      endMinigame(true);
      return;
    } else if (catchProgress <= 0) {
      endMinigame(false);
      return;
    }

    minigameLoop = requestAnimationFrame(gameLoop);
  }

  minigameLoop = requestAnimationFrame(gameLoop);
}

function endMinigame(success) {
  minigameActive = false;
  if (minigameLoop) cancelAnimationFrame(minigameLoop);

  // Efeito visual de saída
  elements.minigameOverlay.classList.remove("active");

  // Pequeno delay para a animação CSS acontecer antes de limpar dados
  setTimeout(() => {
    elements.minigameOverlay.classList.remove("game-active"); // Se houver classe extra
  }, 300);

  if (success && currentFish) {
    gameState.inventory.push({ ...currentFish });
    gameState.totalFish++;
    addXP(XP_PER_FISH[currentFish.rarity]);
    showResultModal(true);
  } else {
    showResultModal(false);
  }

  currentFish = null;
  gameState.phase = "idle";
  elements.statusText.textContent = "Pronto para pescar";
  elements.statusText.className = "status-text";
  updateUI();
}

// Helper para gerar estrelas HTML
function getDifficultyStars(count) {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars += i < count ? "★" : "☆";
  }
  return stars;
}

function showResultModal(success) {
  elements.resultModal.classList.add("active");
  if (success) {
    elements.resultStats.hidden = false;
    elements.resultEmoji.textContent = currentFish.emoji;
    elements.resultTitle.textContent = "Pesca Sucesso!";
    elements.resultTitle.style.color = "var(--success)";
    elements.resultDesc.textContent = `Você pescou um(a) ${currentFish.name}!`;
    const xp =
      XP_PER_FISH[currentFish.rarity] * (1 + gameState.bonuses.xp / 100);
    elements.resultStats.innerHTML = `
            <div class="result-stat-row"><span>Raridade:</span> <span class="result-stat-val ${
              currentFish.rarity
            }">${currentFish.rarity.toUpperCase()}</span></div>
            <div class="result-stat-row"><span>Valor:</span> <span class="result-stat-val gold">$${
              currentFish.price
            }</span></div>
            <div class="result-stat-row"><span>XP:</span> <span class="result-stat-val">+${Math.floor(
              xp
            )}</span></div>
        `;
  } else {
    elements.resultEmoji.textContent = "🐡";
    elements.resultTitle.textContent = "Escapou!";
    elements.resultTitle.style.color = "var(--error)";
    elements.resultDesc.textContent = "O peixe foi mais esperto desta vez...";
    elements.resultStats.innerHTML = "";
    elements.resultStats.hidden = true;
  }
}

elements.btnCloseResult.addEventListener("click", () => {
  elements.resultModal.classList.remove("active");
});

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
document.addEventListener("mousedown", (e) => {
  if (minigameActive) handleHoldStart();
});
document.addEventListener("mouseup", handleHoldEnd);

document.addEventListener("pointerdown", (e) => {
  if (minigameActive) {
    handleHoldStart();
  }
});

document.addEventListener("pointerup", handleHoldEnd);

function sellAllFish() {
  if (gameState.inventory.length === 0) {
    showToast("Barco vazio!", "error");
    return;
  }
  if (gameState.isSelling) return;
  const baseTime = 30000;
  const speedReduction = (gameState.boat.speed - 1) * 2000;
  const sellTime = Math.max(5000, baseTime - speedReduction);
  gameState.isSelling = true;
  updateUI();
  let timeLeft = sellTime;
  const timerInterval = setInterval(() => {
    timeLeft -= 100;
    const percentage = 100 - (timeLeft / sellTime) * 100;
    elements.btnSell.querySelector(
      ".sell-progress"
    ).style.width = `${percentage}%`;
    elements.sellTimerText.textContent = `Vendendo... ${(
      timeLeft / 1000
    ).toFixed(1)}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      completeSell();
    }
  }, 100);
}

function completeSell() {
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
  updateUI();
}

function buyUpgrade(type, category) {
  if (gameState.isSelling) {
    showToast("Aguarde a venda terminar!", "error");
    return;
  }
  const maxLevel = 10;
  let currentLevel, baseCost;
  if (category === "rod") {
    currentLevel = gameState.rod[type];
    baseCost = { depth: 50, stability: 40, bait: 60 }[type];
  } else {
    if (type === "capacity")
      currentLevel = Math.floor((gameState.boat.capacity - 10) / 5) + 1;
    else currentLevel = gameState.boat[type];
    baseCost = { capacity: 80, speed: 70, sonar: 90 }[type];
  }
  if (currentLevel >= maxLevel) {
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
  showToast("Melhoria adquirida!", "success");
  updateUI();
}

function addBonus(type) {
  if (gameState.bonusPoints <= 0) {
    showToast("Sem pontos de bônus!", "error");
    return;
  }
  const values = { time: 5, xp: 10, sell: 5, rare: 3 };
  gameState.bonuses[type] += values[type];
  gameState.bonusPoints--;
  showToast("Bônus ativado!", "success");
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
  if (confirm("Tem certeza?")) {
    localStorage.removeItem("fishing-master-save");
    location.reload();
  }
});

elements.btnFish.addEventListener("click", startLocalFishing);
elements.btnSell.addEventListener("click", sellAllFish);
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
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
elements.btnDepth.addEventListener("click", () => buyUpgrade("depth", "rod"));
elements.btnStability.addEventListener("click", () =>
  buyUpgrade("stability", "rod")
);
elements.btnBait.addEventListener("click", () => buyUpgrade("bait", "rod"));
elements.btnCapacity.addEventListener("click", () =>
  buyUpgrade("capacity", "boat")
);
elements.btnSpeed.addEventListener("click", () => buyUpgrade("speed", "boat"));
elements.btnSonar.addEventListener("click", () => buyUpgrade("sonar", "boat"));
document
  .getElementById("bonus-time")
  .addEventListener("click", () => addBonus("time"));
document
  .getElementById("bonus-xp")
  .addEventListener("click", () => addBonus("xp"));
document
  .getElementById("bonus-sell")
  .addEventListener("click", () => addBonus("sell"));
document
  .getElementById("bonus-rare")
  .addEventListener("click", () => addBonus("rare"));
elements.btnCloseModal.addEventListener("click", () =>
  elements.levelUpModal.classList.remove("active")
);

// --- MOBILE NAVIGATION LOGIC ---

// Navegação entre abas
document.querySelectorAll(".mobile-nav-btn[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    // 1. Atualiza botões
    document
      .querySelectorAll(".mobile-nav-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 2. Troca as views
    document.querySelectorAll(".mobile-view").forEach((view) => {
      view.classList.remove("active");
    });
    document.getElementById(`mobile-view-${target}`).classList.add("active");
  });
});

// Botão de Mapa na Nav Mobile
const btnMobileMap = document.getElementById("btn-mobile-map");
if (btnMobileMap) {
  btnMobileMap.addEventListener("click", openMap);
}

// --- MOBILE NAVIGATION LOGIC ---

// 1. Navegação entre abas (Pescar, Bolsa, Loja)
document
  .querySelectorAll(
    ".mobile-nav-btn[data-target], .mobile-fish-btn[data-target]"
  )
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;

      // Atualiza visual dos botões
      document
        .querySelectorAll(".mobile-nav-btn, .mobile-fish-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Troca as views
      document.querySelectorAll(".mobile-view").forEach((view) => {
        view.classList.remove("active");
      });

      // Se a view existir, ativa ela
      const targetView = document.getElementById(`mobile-view-${target}`);
      if (targetView) {
        targetView.classList.add("active");
      }
    });
  });

// 2. Botão de Mapa na Nav Mobile
const btnMobileMapNav = document.getElementById("btn-mobile-map-nav");
if (btnMobileMapNav) {
  btnMobileMapNav.addEventListener("click", openMap);
}

// 3. Botão de Menu na Nav Mobile (Novo)
const btnMobileMenuNav = document.getElementById("btn-mobile-menu-nav");
if (btnMobileMenuNav) {
  btnMobileMenuNav.addEventListener("click", () => {
    showScreen("menu");
    updateMenuUI();
  });
}

loadGame();
updateMenuUI();
