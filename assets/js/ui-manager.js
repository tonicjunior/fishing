function showScreen(screenName) {
  Object.values(elements.screens).forEach((screen) =>
    screen.classList.add("hidden-screen")
  );
  elements.screens[screenName].classList.remove("hidden-screen");
}

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

function showToast(message, type = "info") {
  playSound("notification");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function switchInventoryTab(tab) {
  playSound("click");
  const cargo = document.getElementById("inventory-cargo-view");
  const album = document.getElementById("inventory-album-view");
  const prestige = document.getElementById("inventory-prestige-view");

  const buttons = {
    cargo: document.getElementById("tab-btn-cargo"),
    album: document.getElementById("tab-btn-album"),
    prestige: document.getElementById("tab-btn-prestige"),
  };

  [cargo, album, prestige].forEach((v) => v?.classList.add("hidden"));
  Object.values(buttons).forEach((b) =>
    b?.classList.remove("border-primary", "text-primary")
  );
  Object.values(buttons).forEach((b) =>
    b?.classList.add("border-transparent", "text-gray-500")
  );

  if (tab === "cargo") {
    cargo.classList.remove("hidden");
  } else if (tab === "album") {
    album.classList.remove("hidden");
    renderAlbumInventory();
  } else if (tab === "prestige") {
    prestige.classList.remove("hidden");
    updatePrestigeTabUI();
  }

  buttons[tab].classList.add("border-primary", "text-primary");
  buttons[tab].classList.remove("border-transparent", "text-gray-500");
}

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
