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

function checkGameVersion() {
  const savedVersion = gameState.lastVersionSeen;

  const versionDisplay = document.getElementById("welcome-version-display");
  const menuVersionDisplay = document.getElementById("menu-version-display");
  if (versionDisplay) versionDisplay.textContent = `${CURRENT_VERSION}`;
  if (menuVersionDisplay) menuVersionDisplay.textContent = `${CURRENT_VERSION}`;

  if (savedVersion !== CURRENT_VERSION) {
    localStorage.removeItem("fishing-master-save");
    console.log(`Nova versão detectada: ${CURRENT_VERSION}`);
    document
      .getElementById("version-welcome-screen")
      .classList.remove("hidden");
  }
}

function toggleAntilag(forceValue = null) {
  gameState.antilag = forceValue !== null ? forceValue : !gameState.antilag;

  const btn = document.getElementById("toggle-antilag");
  const dot = btn?.querySelector(".dot");

  if (gameState.antilag) {
    document.body.classList.add("antilag-enabled");
    btn?.classList.add("bg-primary");
    if (dot) dot.style.transform = "translateX(20px)";

    // Desativa áudio
    audioContext.musicMuted = true;
    audioContext.soundsMuted = true;
    stopMenuMusic();
    updateAudioButtons();
    showToast("Modo Antilag Ativado", "info");
  } else {
    // RESTAURAÇÃO
    document.body.classList.remove("antilag-enabled");
    btn?.classList.remove("bg-primary");
    if (dot) dot.style.transform = "translateX(0px)";

    // Reativa áudio
    audioContext.musicMuted = false;
    audioContext.soundsMuted = false;
    updateAudioButtons();

    // Se estiver no menu ou em fase ociosa, volta a música
    if (gameState.phase === "idle") {
      playMenuMusic();
    }

    showToast("Modo Antilag Desativado", "info");
  }
  saveGame();
}

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
  gameState.lastVersionSeen = CURRENT_VERSION;
  localStorage.setItem("fishing-master-save", JSON.stringify(gameState));
  updateMenuUI();
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

  gameState.boat.capacity = Math.floor(5 + Math.sqrt(gameState.level) * 3);

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

  const levelBadge = document.getElementById("player-level");
  levelBadge.classList.remove("level-prestige-1", "level-prestige-2");
  if (gameState.prestigeLevel === 1)
    levelBadge.classList.add("level-prestige-1");
  if (gameState.prestigeLevel >= 2)
    levelBadge.classList.add("level-prestige-2");
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
  updateDots(
    document.getElementById("repescagem-dots"),
    gameState.boat.repescagem,
    10
  );
  updateUpgradeButton(
    document.getElementById("btn-repescagem"),
    "repescagem",
    gameState.boat.repescagem,
    150
  );
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

  updateDots(elements.speedDots, gameState.boat.speed, 10);
  updateDots(elements.sonarDots, gameState.boat.sonar, 10);
  updateUpgradeButton(elements.btnSpeed, "speed", gameState.boat.speed, 85);
  updateUpgradeButton(elements.btnSonar, "sonar", gameState.boat.sonar, 110);
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

// Localize a função updateBonuses no script.js
function updateBonuses() {
  const displayPct = gameState.bonuses.fishSlow * BALANCE.fishSlowValue;
  const fishSlowElement = document.getElementById("fishSlow-bonus");
  if (fishSlowElement) {
    fishSlowElement.textContent = `-${displayPct}%`;
  }

  elements.bonusPoints.textContent = gameState.bonusPoints;
  elements.xpBonus.textContent = `+${gameState.bonuses.xp}%`;
  elements.sellBonus.textContent = `+${gameState.bonuses.sell}%`;
  elements.rareBonus.textContent = `+${gameState.bonuses.rare}%`;

  document.querySelectorAll(".bonus-btn").forEach((btn) => {
    const isPointsOut = gameState.bonusPoints <= 0;

    if (btn.id === "bonus-fishSpeed" && displayPct >= 40) {
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      btn.disabled = isPointsOut;
      if (!isPointsOut)
        btn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
}

function getTravelTime(area) {
  const base = area.travelTime;
  const prestigeMod = gameState.prestigeLevel >= 1 ? 0.9 : 1; // 10% mais rápido
  const speedReduction = (gameState.boat.speed - 1) * 0.1;
  return Math.max(1, base * (1 - speedReduction) * prestigeMod);
}

function getSearchTime() {
  const base = gameState.currentArea.searchTime;
  const sonarReduction = (gameState.boat.sonar - 1) * 0.1;
  return Math.max(1, base * (1 - sonarReduction));
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

function updateFishingSoundOptimized() {
  if (isHolding !== lastHoldingState) {
    audioContext.sounds.fishing.volume = isHolding ? 0.6 : 0.0;
    lastHoldingState = isHolding;
  }
}

function startMinigame() {
  gameState.phase = "fishing";
  document.body.classList.add("minigame-focus");

  // --- RESET DE VARIÁVEIS LÓGICAS ---
  zonePosition = 50;
  fishPosition = 50;
  fishVelocity = 0;
  fishDirection = Math.random() > 0.5 ? 1 : -1;
  catchProgress = 30;
  isHolding = false;
  fishDecisionTimer = 0;
  minigameActive = true;
  minigameStartTime = performance.now();

  // --- CÁLCULO DE BÔNUS DE PRESTÍGIO ---

  // Prestígio 1: +1 de Estabilidade (+1.5 no multiplicador visual)
  const p1StabilityBonus = gameState.prestigeLevel >= 1 ? 1.5 : 0;

  // Prestígio 2: Barra de progresso 15% mais rápida
  const p2ProgressMultiplier = gameState.prestigeLevel >= 2 ? 1.15 : 1;

  // Prestígio 2: Peixes 4% mais lentos
  const p2FishSlowdown = gameState.prestigeLevel >= 2 ? 0.96 : 1;

  // --- APLICAÇÃO VISUAL DA ZONA DE CAPTURA ---
  const eventZoneMod = activeEventAtStart?.effect?.zoneSize || 1;
  const finalHeightPct = Math.min(
    40,
    (20 + (gameState.rod.stability - 1 + p1StabilityBonus) * 1.5) * eventZoneMod
  );
  elements.catchZone.style.height = `${finalHeightPct}%`;

  let lastTime = performance.now();
  barHeight = elements.fishingBar.clientHeight;
  zoneHeight = elements.catchZone.clientHeight;

  function gameLoop(currentTime) {
    if (!minigameActive) return;

    const elapsedSinceLastFrame = currentTime - lastFrameTime;
    if (elapsedSinceLastFrame < FRAME_TIME) {
      minigameLoop = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastFrameTime = currentTime - (elapsedSinceLastFrame % FRAME_TIME);
    lastTime = currentTime;

    updateFishingSoundOptimized();

    // Lógica de Movimento do Peixe
    let difficulty = Math.max(
      1,
      currentFish.difficulty * 0.62 - gameState.rod.stability / 4
    );
    fishDecisionTimer += deltaTime;

    if (fishDecisionTimer > 0.15) {
      fishDecisionTimer = 0;
      const eventFishSpeed = activeEventAtStart?.effect?.fishSpeed || 1;
      const bonusSlowdown =
        1 - (gameState.bonuses.fishSlow * BALANCE.fishSlowValue) / 100;

      if (Math.random() < 0.25 + difficulty * 0.05) {
        fishDirection = Math.random() > 0.5 ? 1 : -1;
        // Aplicação do p2FishSlowdown (4% mais lento)
        fishVelocity =
          (Math.random() * 120 + 60) *
          (difficulty / 3) *
          eventFishSpeed *
          bonusSlowdown *
          p2FishSlowdown;
      }
    }

    // Atualização de Posições (GPU Optimized)
    fishPosition += fishVelocity * fishDirection * deltaTime;
    fishPosition = Math.max(5, Math.min(95, fishPosition));
    zonePosition += (isHolding ? -172 : 78) * deltaTime;
    zonePosition = Math.max(0, Math.min(100, zonePosition));

    const zoneYPx = (zonePosition / 100) * (barHeight - zoneHeight);
    const fishYPx = (fishPosition / 100) * barHeight;

    elements.catchZone.style.transform = `translate3d(0, ${zoneYPx}px, 0)`;
    elements.fishMarker.style.transform = `translate3d(-50%, ${fishYPx}px, 0) translateY(-50%)`;

    if (!gameState.antilag)
      fishMarkerInner.style.transform = `scaleX(${fishDirection})`;

    // Cálculo de Progresso
    const inZone =
      fishPosition >= (zoneYPx / barHeight) * 100 &&
      fishPosition <= ((zoneYPx + zoneHeight) / barHeight) * 100;

    const eventProgressSpeed = activeEventAtStart?.effect?.progressSpeed || 1;
    const failPenalty = activeEventAtStart?.effect?.failPenalty || 1;

    // Aplicação do p2ProgressMultiplier (15% mais rápido no sucesso)
    catchProgress = Math.max(
      0,
      Math.min(
        100,
        catchProgress +
          (inZone
            ? 0.45 * eventProgressSpeed * p2ProgressMultiplier
            : -0.3 * failPenalty)
      )
    );

    elements.catchProgressFill.style.transform = `scaleY(${
      catchProgress / 100
    })`;

    if (catchProgress >= 100) endMinigame(true);
    else if (catchProgress <= 0) endMinigame(false);
    else minigameLoop = requestAnimationFrame(gameLoop);
  }
  minigameLoop = requestAnimationFrame(gameLoop);
}

function initiateRepescagemFlow() {
  const r = elements.repescagem;

  ["repescagem_success", "repescagem_fail", "repescagem_loop"].forEach(
    (key) => {
      const s = audioContext.sounds[key];
      if (s) {
        s.volume = 0;
        s.play()
          .then(() => {
            s.pause();
            s.currentTime = 0;
            s.volume = audioContext.soundsVolume;
          })
          .catch(() => {});
      }
    }
  );

  // CORREÇÃO: Garante que o texto já exiba o nome do peixe correto antes do overlay abrir
  r.message.querySelector(
    "p"
  ).textContent = `O ${currentFish.name} ainda está por perto!`;

  // CORREÇÃO: Gera as zonas e reseta o ponteiro ANTES de remover o 'hidden'
  preSetupRepescagem();

  r.overlay.classList.remove("hidden");
  r.message.style.opacity = "1";

  setTimeout(() => {
    r.message.querySelector("p").textContent = "Tente recuperá-lo!";
    setTimeout(() => {
      startRepescagemAnims();
    }, 800);
  }, 1000);
}

function preSetupRepescagem() {
  repescagemActive = false;
  repescagemPaused = false;
  successfulHits = 0;
  currentRepescagemAttempts = 3;
  repescagemTimer = 20;
  pointerAngle = 0;

  // Limpa o visual anterior imediatamente
  elements.repescagem.pointer.style.transform = "rotate(0deg)";
  document.getElementById("repescagem-timer-text").textContent = "20.0s";
  document.getElementById("repescagem-timer-bar").style.width = "100%";

  // Reseta os indicadores de tentativa (os "dots")
  const dots = elements.repescagem.attempts.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = "h-3 w-12 bg-primary rounded-full";
  }

  // Gera as novas zonas agora, assim quando a tela abrir, elas já são as novas
  generateZones();
}

function startRepescagemMinigame() {
  if (!audioContext.soundsMuted) {
    const loop = audioContext.sounds.repescagem_loop;
    loop.loop = true;
    loop.volume = audioContext.soundsVolume * 0.6;
    loop.play().catch(() => {});
  }

  // --- RESET ABSOLUTO DE ESTADO ---
  repescagemActive = false;
  repescagemPaused = false;

  // Zera zonas lógicas
  successZones.white = { start: 0, end: 0 };
  successZones.gold = { start: 0, end: 0 };

  // Limpa DOM das zonas
  elements.repescagem.zones.innerHTML = "";
  elements.repescagem.zones.style.opacity = "1";

  // Cancela qualquer blink pendente
  clearInterval(repescagemBlinkInterval);

  // Zera ponteiro
  pointerAngle = 0;
  elements.repescagem.pointer.style.transform = "rotate(0deg)";

  // Zera tentativas
  currentRepescagemAttempts = 3;
  successfulHits = 0;

  // Reset visual dos dots
  const dots = elements.repescagem.attempts.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = "h-3 w-12 bg-primary rounded-full";
  }

  // Reset timer
  repescagemTimer = 20;
  document.getElementById("repescagem-timer-text").textContent = "20.0s";
  document.getElementById("repescagem-timer-bar").style.width = "100%";

  clearInterval(repescagemTimerInterval);

  // --- AGORA SIM COMEÇA DE VERDADE ---
  repescagemActive = true;

  updateRepescagemHUD();
  generateZones();

  repescagemTimerInterval = setInterval(() => {
    repescagemTimer -= 0.1;
    document.getElementById("repescagem-timer-text").textContent = `${Math.max(
      0,
      repescagemTimer
    ).toFixed(1)}s`;
    document.getElementById("repescagem-timer-bar").style.width = `${
      (repescagemTimer / 20) * 100
    }%`;

    if (repescagemTimer <= 0) {
      finishRepescagem(false);
    }
  }, 100);

  requestAnimationFrame(repescagemLoop);
}

function generateZones() {
  const rZones = elements.repescagem.zones;
  rZones.innerHTML = ""; // Limpa zonas anteriores

  // Tamanho total da zona branca baseado na dificuldade (ex: 40deg a 20deg)
  const size = Math.max(18, 46 - currentFish.difficulty * 3.5);
  const startAngle = Math.floor(Math.random() * 280) + 20;

  const goldSize = size * 0.25; // Zona dourada é 25% da branca
  const goldStart = startAngle + size - goldSize;

  // Armazena para checagem de colisão
  successZones.white = { start: startAngle, end: startAngle + size };
  successZones.gold = { start: goldStart, end: startAngle + size };

  // Criamos os elementos programaticamente para evitar erros de renderização
  const whiteDiv = document.createElement("div");
  whiteDiv.className = "skill-zone zone-white";
  whiteDiv.style.background = `conic-gradient(from 0deg, 
    transparent ${startAngle}deg, 
    rgba(255,255,255,0.8) ${startAngle}deg, 
    rgba(255,255,255,0.8) ${startAngle + size}deg, 
    transparent ${startAngle + size}deg)`;

  const goldDiv = document.createElement("div");
  goldDiv.className = "skill-zone zone-gold";
  goldDiv.style.background = `conic-gradient(from 0deg, 
    transparent ${goldStart}deg, 
    #ffd700 ${goldStart}deg, 
    #ffd700 ${startAngle + size}deg, 
    transparent ${startAngle + size}deg)`;

  rZones.appendChild(whiteDiv);
  rZones.appendChild(goldDiv);
}

function blinkZones(duration = 1500) {
  const zones = elements.repescagem.zones;
  let visible = true;

  repescagemBlinkInterval = setInterval(() => {
    visible = !visible;
    zones.style.opacity = visible ? "1" : "0.2";
  }, 150);

  setTimeout(() => {
    clearInterval(repescagemBlinkInterval);
    zones.style.opacity = "1";
  }, duration);
}

function repescagemLoop() {
  if (!repescagemActive || repescagemPaused) return;

  const speed = 1.4 + currentFish.difficulty * 0.4;

  pointerAngle = (pointerAngle + speed) % 360;
  lastPointerAngle = pointerAngle;

  elements.repescagem.pointer.style.transform = `rotate(${pointerAngle}deg)`;

  requestAnimationFrame(repescagemLoop);
}

function startRepescagemAnims() {
  if (!audioContext.soundsMuted) {
    const loop = audioContext.sounds.repescagem_loop;
    loop.loop = true;
    loop.volume = audioContext.soundsVolume * 0.6;
    loop.play().catch(() => {});
  }
  repescagemActive = true;

  // Inicia o Timer
  clearInterval(repescagemTimerInterval);
  repescagemTimerInterval = setInterval(() => {
    repescagemTimer -= 0.1;
    document.getElementById("repescagem-timer-text").textContent = `${Math.max(
      0,
      repescagemTimer
    ).toFixed(1)}s`;
    document.getElementById("repescagem-timer-bar").style.width = `${
      (repescagemTimer / 20) * 100
    }%`;

    if (repescagemTimer <= 0) {
      finishRepescagem(false);
    }
  }, 100);

  requestAnimationFrame(repescagemLoop);
}

elements.repescagem.btn.addEventListener("pointerdown", (e) => {
  // Previne comportamento padrão e cliques múltiplos
  e.preventDefault();
  if (!repescagemActive || repescagemPaused) return;

  // PARADA VISUAL IMEDIATA (Antes de qualquer lógica pesada)
  repescagemPaused = true;

  // PARADA DE ÁUDIO IMEDIATA (Limpa o canal para o som de resultado)
  const loopSound = audioContext.sounds.repescagem_loop;
  loopSound.pause();
  loopSound.currentTime = 0;

  // Captura a posição exata renderizada na tela AGORA
  const computedStyle = window.getComputedStyle(elements.repescagem.pointer);
  const matrix = computedStyle.getPropertyValue("transform");
  let currentAngle = 0;

  if (matrix !== "none") {
    const values = matrix.split("(")[1].split(")")[0].split(",");
    const a = values[0];
    const b = values[1];
    currentAngle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    if (currentAngle < 0) currentAngle += 360;
  } else {
    currentAngle = pointerAngle % 360;
  }

  // Trava o ponteiro no ângulo capturado
  elements.repescagem.pointer.style.transform = `rotate(${currentAngle}deg)`;

  // Lógica de Colisão
  const isAngleBetween = (angle, start, end) => {
    if (start <= end) return angle >= start && angle <= end;
    return angle >= start || angle <= end;
  };

  const hitGold = isAngleBetween(
    currentAngle,
    successZones.gold.start,
    successZones.gold.end
  );
  const hitWhite = isAngleBetween(
    currentAngle,
    successZones.white.start,
    successZones.white.end
  );

  const dots = elements.repescagem.attempts.children;
  const currentDot = dots[3 - currentRepescagemAttempts];

  // PROCESSAMENTO COM SOM PRIORITÁRIO
  if (hitGold) {
    forcePlaySound("repescagem_success");
    if (currentDot) currentDot.classList.replace("bg-primary", "bg-yellow-400");
    blinkZones(500);
    setTimeout(() => finishRepescagem(true), 600);
  } else if (hitWhite) {
    forcePlaySound("click");
    successfulHits++;
    if (currentDot) currentDot.classList.replace("bg-primary", "bg-green-500");

    // REDUÇÃO DE TENTATIVA: Ocorre assim que o clique é processado
    currentRepescagemAttempts--;

    blinkZones(500);
    setTimeout(() => {
      if (successfulHits >= 2) {
        finishRepescagem(true);
      } else if (currentRepescagemAttempts <= 0) {
        // CORREÇÃO AQUI: Se gastou a última tentativa e não atingiu 2 acertos, falha.
        finishRepescagem(false);
      } else {
        generateZones();
        repescagemPaused = false;
        requestAnimationFrame(repescagemLoop);
        if (!audioContext.soundsMuted) loopSound.play().catch(() => {});
      }
    }, 600);
  } else {
    // Erro total (fora da zona)
    forcePlaySound("repescagem_fail");
    if (currentDot) {
      currentDot.classList.remove("bg-primary");
      currentDot.classList.add("bg-red-600", "animate-pulse");
    }
    currentRepescagemAttempts--;
    blinkZones(500);
    setTimeout(() => {
      if (currentRepescagemAttempts <= 0) {
        finishRepescagem(false);
      } else {
        generateZones();
        repescagemPaused = false;
        requestAnimationFrame(repescagemLoop);
        if (!audioContext.soundsMuted) loopSound.play().catch(() => {});
      }
    }, 600);
  }
});

function finishRepescagem(success) {
  repescagemActive = false;
  repescagemPaused = false;
  clearInterval(repescagemBlinkInterval);
  clearInterval(repescagemTimerInterval);

  audioContext.sounds.repescagem_loop.pause();
  audioContext.sounds.repescagem_loop.currentTime = 0;

  if (success) {
    forcePlaySound("repescagem_success");
    elements.repescagem.overlay.classList.add("hidden");
    showToast("Recuperado com Sucesso!", "success");
    resumeMinigameAfterRepescagem();
  } else {
    forcePlaySound("repescagem_fail");
    closeMinigameComFalhaFinal();
  }
}

function resumeMinigameAfterRepescagem() {
  elements.minigameOverlay.classList.add("active");
  elements.countdown.classList.add("active");
  elements.countdown.textContent = "SALVO!";

  setTimeout(() => {
    elements.countdown.classList.remove("active");
    elements.minigameOverlay.classList.add("game-active");

    catchProgress = 30;
    elements.fishingBar.style.opacity = "1";
    elements.fishMarker.style.opacity = "1";
    elements.catchProgressFill.parentElement.style.opacity = "1";

    // 🔊 RETOMA ÁUDIO DO MINIGAME DE PESCA
    if (!audioContext.musicMuted) {
      audioContext.sounds.battle.currentTime = 0;
      audioContext.sounds.battle.volume = audioContext.musicVolume;
      audioContext.sounds.battle.play().catch(() => {});
    }

    if (!audioContext.soundsMuted) {
      audioContext.sounds.fishing.loop = true;
      audioContext.sounds.fishing.volume = 0; // começa em 0, sobe com hold
      audioContext.sounds.fishing.play().catch(() => {});
    }

    startMinigame();
  }, 800);
}

function closeMinigameComFalhaFinal() {
  // Fecha repescagem
  elements.repescagem.overlay.classList.add("hidden");

  // Fecha minigame corretamente
  elements.minigameOverlay.classList.remove("active");
  elements.minigameOverlay.classList.remove("game-active");

  // Reseta estados
  minigameActive = false;
  repescagemActive = false;
  repescagemPaused = false;
  clearInterval(repescagemBlinkInterval);
  clearInterval(repescagemTimerInterval);

  elements.repescagem.zones.style.opacity = "1";
  gameState.phase = "idle";
  gameState.repescagemAttempted = false;

  document.body.classList.remove("minigame-focus");

  // Som
  audioContext.sounds.battle.pause();
  audioContext.sounds.battle.currentTime = 0;

  if (!audioContext.musicMuted) {
    audioContext.sounds.battle.pause();
    audioContext.sounds.battle.currentTime = 0;
    playMenuMusic(); // sua função existente
  }

  showResultModal(false);
  updateUI();
  saveGame();
}

function updateRepescagemHUD() {
  const dots = elements.repescagem.attempts.children;
  for (let i = 0; i < 3; i++) {
    dots[i].className =
      i < currentRepescagemAttempts
        ? "h-3 w-12 bg-primary rounded-full"
        : "h-3 w-12 bg-white/10 rounded-full";
  }
}

function showRepescagemOverlay() {
  const loader = document.getElementById("repescagem-loader");
  const r = elements.repescagem;
  loader.classList.add("active");

  // 2. Limpa o estado do minigame anterior
  elements.minigameOverlay.classList.remove("active", "game-active");
  document.body.classList.remove("minigame-focus");

  preSetupRepescagem();

  r.message.querySelector("p").textContent = "Tente recuperar o peixe!";
  r.message.style.opacity = "1";

  setTimeout(() => {
    // Esconde o loader
    loader.classList.remove("active");

    r.overlay.classList.remove("hidden");
    startRepescagemMinigame();
  }, 1800);
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

  if (!success) {
    const chanceRepescagem = (gameState.boat.repescagem * 4) / 100;

    if (!gameState.repescagemAttempted && Math.random() < chanceRepescagem) {
      gameState.repescagemAttempted = true;
      showRepescagemOverlay();
      return;
    }
  }

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
    gameState.repescagemAttempted = false; // Reseta a flag para o próximo peixe
  } else {
    showResultModal(false);
    gameState.repescagemAttempted = false; // Reseta a flag para o próximo peixe
  }

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
  } else if (category === "boat") {
    currentLevel = gameState.boat[type];
    // Adicionado o custo base da repescagem aqui
    baseCost = { speed: 70, sonar: 90, repescagem: 150 }[type];
  }

  if (currentLevel >= 10) return;
  const cost = Math.floor(baseCost * Math.pow(1.5, currentLevel - 1));

  if (gameState.money < cost) {
    showToast("Dinheiro insuficiente!", "error");
    return;
  }

  gameState.money -= cost;
  if (category === "rod") gameState.rod[type]++;
  else gameState.boat[type]++; // Incrementa corretamente sonar, speed ou repescagem

  saveGame();
  updateUI();
}

function addBonus(type) {
  if (gameState.bonusPoints <= 0) return;

  if (type === "fishSlow") {
    const currentReduction = gameState.bonuses.fishSlow * BALANCE.fishSlowValue;
    if (currentReduction >= 40) {
      showToast("Limite de 40% de Controle de Linha atingido!", "error");
      return;
    }
  }

  gameState.bonuses[type] += BALANCE.bonusValues[type];
  gameState.bonusPoints--;
  saveGame();
  updateUI();
}

function updatePrestigeTabUI() {
  const pLevel = gameState.prestigeLevel;

  // Atualiza Números
  document.getElementById("stat-p-stability").textContent =
    pLevel >= 1 ? "+1" : "+0";
  document.getElementById("stat-p-speed").textContent =
    pLevel >= 1 ? "+10%" : "+0%";
  document.getElementById("stat-p-rarity").textContent =
    pLevel >= 1 ? "+1" : "+0";
  document.getElementById("stat-p-progress").textContent =
    pLevel >= 2 ? "+15%" : "+0%";

  // Estrelas
  const starsContainer = document.getElementById("prestige-stars-tab");
  starsContainer.innerHTML = Array(2)
    .fill(0)
    .map(
      (_, i) =>
        `<span class="material-symbols-outlined text-[14px] ${
          i < pLevel ? "text-primary" : "text-gray-800"
        }" style="font-variation-settings: 'FILL' 1">star</span>`
    )
    .join("");

  // Lista de Cards de Desbloqueio
  const list = document.getElementById("prestige-unlocks-list");
  let html = "";

  if (pLevel >= 1) {
    html += `
      <div class="flex items-center gap-3 bg-primary/5 p-3 rounded-xl border border-primary/20 animate-slide-in">
        <div class="text-lg bg-primary/10 w-8 h-8 flex items-center justify-center rounded-lg">✨</div>
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-primary uppercase">Efeito Desbloqueado</span>
          <span class="text-[10px] font-bold text-white uppercase italic">Peixe do Vazio Liberado</span>
        </div>
      </div>`;
  }
  if (pLevel >= 2) {
    html += `
      <div class="flex items-center gap-3 bg-purple-500/5 p-3 rounded-xl border border-purple-500/20 animate-slide-in">
        <div class="text-lg bg-purple-500/10 w-8 h-8 flex items-center justify-center rounded-lg">🌌</div>
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-purple-400 uppercase">Domínio Ativo</span>
          <span class="text-[10px] font-bold text-white uppercase italic">Área: Vazio Místico</span>
        </div>
      </div>
      <div class="flex items-center gap-3 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/20 animate-slide-in">
        <div class="text-lg bg-indigo-500/10 w-8 h-8 flex items-center justify-center rounded-lg">🐙</div>
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-indigo-400 uppercase">Passiva Divina</span>
          <span class="text-[10px] font-bold text-white uppercase italic">Peixes 4% mais lentos</span>
        </div>
      </div>`;
  }

  list.innerHTML =
    html ||
    `<div class="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl"><p class="text-[9px] text-gray-600 font-black uppercase tracking-widest">Nenhuma Ascensão Detectada</p></div>`;
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
  const rewardPreview = document.getElementById("prestige-reward-preview");

  const nextLevel = gameState.prestigeLevel + 1;
  let rewardHTML = "";

  if (nextLevel === 1) {
    rewardHTML = `
      <div class="bg-primary/10 p-3 rounded-xl border border-primary/20 space-y-1">
        <p class="text-primary font-black text-[10px] uppercase">Vantagens Nível 1:</p>
        <p class="text-white text-[10px]">🔓 Desbloqueia Peixe do Vazio</p>
        <p class="text-white text-[10px]">🎯 +1 Estabilidade (Barra maior)</p>
        <p class="text-white text-[10px]">🚤 +10% Velocidade de Viagem/Busca</p>
      </div>`;
  } else if (nextLevel === 2) {
    rewardHTML = `
      <div class="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 space-y-1">
        <p class="text-purple-400 font-black text-[10px] uppercase">Vantagens Nível 2:</p>
        <p class="text-white text-[10px]">🌌 Área: Vazio Místico</p>
        <p class="text-white text-[10px]">🐙 Criaturas Cósmicas</p>
        <p class="text-white text-[10px]">⚡ Progresso 15% mais rápido</p>
        <p class="text-white text-[10px]">❄️ Peixes 4% mais lentos</p>
      </div>`;
  } else {
    rewardHTML = `<p class="text-gray-500 text-[10px] text-center">Você atingiu o ápice!</p>`;
  }

  if (rewardPreview) rewardPreview.innerHTML = rewardHTML;

  container.innerHTML = `
    <div class="flex justify-between text-[10px]"><span>Melhorias no Máximo:</span><span class="${
      status.reqs.upgrades ? "text-green-400" : "text-red-400"
    }">${status.reqs.upgrades ? "✓" : "✗"}</span></div>
    <div class="flex justify-between text-[10px]"><span>Lendários:</span><span class="${
      status.reqs.legendaries ? "text-green-400" : "text-red-400"
    }">${status.currentLegendaries}/${status.neededLegendaries}</span></div>`;

  // CORREÇÃO: Removemos a classe 'disabled' e o atributo 'disabled' conforme a elegibilidade
  if (status.eligible && !status.maxed) {
    btn.disabled = false;
    btn.classList.remove("disabled", "opacity-50", "cursor-not-allowed");
    btn.classList.add("pulse"); // Adiciona um brilho opcional para destacar
  } else {
    btn.disabled = true;
    btn.classList.add("disabled");
    btn.classList.remove("pulse");
  }

  btn.textContent = status.maxed
    ? "ÁPICE ATINGIDO"
    : status.eligible
    ? `RENASCER (NVL ${nextLevel})`
    : "REQUISITOS PENDENTES";
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
    gameState.currentArea = AREAS[0];
    gameState.money = 0;
    gameState.xp = 0;
    gameState.level = 1;
    gameState.rod = { depth: 1, stability: 1, bait: 1 };
    gameState.boat = { capacity: 5, speed: 1, sonar: 1, repescagem: 1 };
    gameState.inventory = [];
    gameState.caughtSpecies = [];
    gameState.caughtCounts = {};
    gameState.totalFish = 0;
    gameState.totalEarned = 0;
    gameState.bonusPoints = 0;
    gameState.bonuses = { fishSlow: 0, xp: 0, sell: 0, rare: 0 };
    saveGame();
    injectPrestigeContent();
    location.reload();
  }, 1500);
}

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

elements.menu.btnStart.addEventListener("click", () => {
  showScreen("game");
  updateUI();
});
elements.menu.btnSettings.addEventListener("click", () =>
  showScreen("settings")
);
elements.nav.btnReturnMenu.addEventListener("click", () => {
  showScreen("menu");
  updateMenuUI();
});
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

elements.btnSpeed.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("speed", "boat");
});
elements.btnSonar.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("sonar", "boat");
});

document.getElementById("bonus-fishSpeed").addEventListener("click", () => {
  playSound("click");
  addBonus("fishSlow");
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

const btnMusicSetup = document.getElementById("setup-music"),
  btnSoundsSetup = document.getElementById("setup-sounds");
btnMusicSetup.addEventListener("click", () => {
  audioContext.musicMuted = !audioContext.musicMuted;
  if (audioContext.musicMuted) {
    stopMenuMusic();
    audioContext.sounds.battle.pause();
  } else {
    if (gameState.phase === "fishing") audioContext.sounds.battle.play();
    else playMenuMusic();
  }
  updateAudioButtons();
});
btnSoundsSetup.addEventListener("click", () => {
  audioContext.soundsMuted = !audioContext.soundsMuted;
  updateAudioButtons();
});

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

// Lista de eventos para garantir captura no Android
const eventsToUnlock = ["pointerdown", "touchstart", "click"];
eventsToUnlock.forEach((event) => {
  document.addEventListener(event, unlockAllAudio);
});

elements.fishDetails.btnClose.addEventListener("click", closeFishDetails);

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

document.getElementById("btn-close-version").addEventListener("click", () => {
  saveGame();
  document.getElementById("version-welcome-screen").classList.add("hidden");
  playSound("click");
});

document.getElementById("btn-donate").addEventListener("click", () => {
  window.open(
    "https://nubank.com.br/cobrar/3upen/672bafe3-8951-4aae-8e53-d86628e67a1a",
    "_blank"
  ); // Substitua pelo seu link real
});

document.getElementById("toggle-antilag")?.addEventListener("click", () => {
  toggleAntilag();
});

document
  .getElementById("btn-settings-mobile")
  ?.addEventListener("click", () => {
    playSound("click");
    showScreen("settings");
  });

document.getElementById("btn-repescagem")?.addEventListener("click", () => {
  playSound("click");
  buyUpgrade("repescagem", "boat");
});

loadGame();
updateMenuUI();
checkGameVersion();
setInterval(updateUI, 60000);
