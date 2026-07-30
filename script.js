const screens = {
  intro: document.getElementById("introScreen"),
  memory: document.getElementById("memoryScreen"),
  letter: document.getElementById("letterScreen"),
  final: document.getElementById("finalScreen"),
};

const envelopeButton = document.getElementById("envelopeButton");
const envelope = envelopeButton.querySelector(".envelope");
const foldedLetterButton = document.getElementById("foldedLetterButton");
const closeLetterButton = document.getElementById("closeLetterButton");
const replayButton = document.getElementById("replayButton");
const musicToggle = document.getElementById("musicToggle");
const photoRing = document.getElementById("photoRing");
const floatingHearts = document.querySelector(".floating-hearts");

// Replace these filenames with your real photos inside assets/images/.
const photos = [
  "assets/images/photo1.jpg",
  "assets/images/photo2.jpg",
  "assets/images/photo3.jpg",
  "assets/images/photo4.jpg",
  "assets/images/photo5.jpg",
  "assets/images/photo6.jpg",
  "assets/images/photo7.jpg",
  "assets/images/photo8.jpg",
];

let audioContext;
let melodyTimer;
let melodyIndex = 0;
let musicPlaying = false;
let masterGain;

// A gentle built-in melody so the website works without an MP3 file.
// You may replace this with your own audio file; see README.txt.
  const bgMusic = document.getElementById("bgMusic");
   bgMusic.volume = 0.55;
   bgMusic.play();
;

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createPhotoRing() {
  const mobile = window.matchMedia("(max-width: 700px)").matches;
  const radiusX = mobile ? 39 : 42;
  const radiusY = mobile ? 39 : 39;

  photoRing.innerHTML = "";

  photos.forEach((src, index) => {
    const angle = (Math.PI * 2 * index) / photos.length - Math.PI / 2;
    const img = document.createElement("img");

    img.src = src;
    img.alt = `Our memory ${index + 1}`;
    img.className = "memory-photo";
    img.loading = "eager";
    img.tabIndex = 0;
    img.style.left = `${50 + Math.cos(angle) * radiusX}%`;
    img.style.top = `${50 + Math.sin(angle) * radiusY}%`;
    img.style.setProperty("--rotation", `${index % 2 === 0 ? -7 : 7}deg`);
    img.style.setProperty("--delay", `${index * 0.09}s`);

    photoRing.appendChild(img);
  });
}

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = "♥";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 24}px`;
  heart.style.animationDuration = `${7 + Math.random() * 7}s`;
  heart.style.animationDelay = `${Math.random() * 1.5}s`;
  floatingHearts.appendChild(heart);

  setTimeout(() => heart.remove(), 15500);
}

setInterval(createHeart, 650);

function playTone(frequency, duration) {
  if (!audioContext || !musicPlaying) return;

  if (frequency === 0) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration + 0.06);
}

function scheduleNextNote() {
  if (!musicPlaying) return;

  const [frequency, duration] = melody[melodyIndex];
  playTone(frequency, duration);
  melodyIndex = (melodyIndex + 1) % melody.length;

  melodyTimer = window.setTimeout(scheduleNextNote, duration * 1000);
}

async function startMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (!musicPlaying) {
    musicPlaying = true;
    musicToggle.classList.add("visible", "playing");
    musicToggle.textContent = "♪";
    musicToggle.setAttribute("aria-label", "Pause music");
    musicToggle.title = "Pause music";
    
    // I-save sa browser na naka-play ang music
    localStorage.setItem("musicState", "playing");
    
    scheduleNextNote();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (!musicPlaying) {
    musicPlaying = true;
    musicToggle.classList.add("visible", "playing");
    musicToggle.textContent = "♪";
    musicToggle.setAttribute("aria-label", "Pause music");
    musicToggle.title = "Pause music";
    scheduleNextNote();
  }
}

function pauseMusic() {
  musicPlaying = false;
  clearTimeout(melodyTimer);
  musicToggle.classList.remove("playing");
  musicToggle.textContent = "♫";
  musicToggle.setAttribute("aria-label", "Play music");
  musicToggle.title = "Play music";
  
  // I-save sa browser na naka-pause ang music
  localStorage.setItem("musicState", "paused");
}

let isEnvelopeOpened = false;

envelopeButton.addEventListener("click", async () => {
  if (!isEnvelopeOpened) {
    // UNANG CLICK: Bubukas lang ang sobre at tutugtog ang music
    envelope.classList.add("opening");
    await startMusic();
    isEnvelopeOpened = true; // Tatandaan ng system na bukas na ang sobre
    
    // Optional: Palitan ang text para alam niyang kailangan i-click ulit
    const hintText = envelope.querySelector(".letter-preview small");
    if (hintText) {
      setTimeout(() => {
        hintText.textContent = "Tap again to continue";
      }, 2500); // Lalabas ang text na ito pagkatapos umangat ng papel
    }
  } else {
    // PANGALAWANG CLICK: Lilipat na sa slide ng mga pictures
    showScreen("memory");
    createPhotoRing();
  }
});

foldedLetterButton.addEventListener("click", () => {
  showScreen("letter");
});

closeLetterButton.addEventListener("click", () => {
  showScreen("final");

  for (let i = 0; i < 18; i += 1) {
    setTimeout(createHeart, i * 90);
  }
});

replayButton.addEventListener("click", () => {
  envelope.classList.remove("opening");
  showScreen("intro");
});

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    pauseMusic();
  } else {
    startMusic();
  }
});

window.addEventListener("resize", () => {
  if (screens.memory.classList.contains("active")) {
    createPhotoRing();
  }
});

createPhotoRing();

// ====== MUSIC PERSISTENCE LOGIC ======
const savedMusicState = localStorage.getItem("musicState");

if (savedMusicState === "playing") {
  // Ipakita ang button sa gilid kahit nag-refresh
  musicToggle.classList.add("visible");
  
  // Gawing pause icon muna dahil hinihintay pa ang click mo
  musicToggle.textContent = "♫";
  musicToggle.classList.remove("playing");
  
  const resumeMusicOnInteraction = async () => {
    if (!musicPlaying) {
      await startMusic();
    }
    // Tanggalin ang abang pagkatapos ng unang click
    document.removeEventListener("click", resumeMusicOnInteraction);
  };

  // Mag-aabang ang website ng unang click mo kahit saan para patugtugin ulit
  document.addEventListener("click", resumeMusicOnInteraction);
}
