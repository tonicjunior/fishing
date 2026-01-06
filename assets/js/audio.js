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
    repescagem_success: new Audio("assets/sound/repescagem_success.mp3"),
    repescagem_fail: new Audio("assets/sound/repescagem_fail.mp3"),
    repescagem_loop: new Audio("assets/sound/repescagem_loop.mp3"),
  },
};

audioContext.sounds.battle.loop = true;

function playSound(soundKey) {
  if (audioContext.soundsMuted) return;

  const sound = audioContext.sounds[soundKey];
  if (!sound) return;

  sound.volume = audioContext.soundsVolume;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function forcePlaySound(soundKey) {
  if (audioContext.soundsMuted) return;

  const sound = audioContext.sounds[soundKey];
  if (!sound) return;

  sound.pause();
  sound.currentTime = 0;
  sound.volume = audioContext.soundsVolume;

  const playPromise = sound.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}

function stopMenuMusic() {
  if (audioContext.currentMenuMusic) {
    audioContext.currentMenuMusic.pause();
    audioContext.currentMenuMusic = null;
  }
}

function warmUpAudio() {
  Object.values(audioContext.sounds).forEach((sound) => {
    sound.muted = true;
    sound.volume = 0;

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

  if (!audioContext.musicMuted) {
    playMenuMusic();
  }
}

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

  eventsToUnlock.forEach((event) => {
    document.removeEventListener(event, unlockAllAudio);
  });
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
