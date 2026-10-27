const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = 400, H = 700;
const LANES = [100, 200, 300];   // مراكز المسارات الثلاثة
const PY = 600;                  // موقع السيارة عموديًا
const ROAD_L = 50, ROAD_R = 350;

// المضامير: كل مضمار بتصميم وسرعة وطول مختلف
const TRACKS = [
  { name: "طريق الحلوى", length: 1400, speed: 4, road: "#ff8ac7", edge: "#ffffff", bg: ["#ffd6ec", "#ff7fb8"], block: "#7b3fe4", car: "#ffe14d" },
  { name: "نهر الشوكولاتة", length: 1800, speed: 5, road: "#5a2e17", edge: "#c58b5a", bg: ["#f5d9b8", "#8a5a3a"], block: "#f3f3f3", car: "#ff7a59" },
  { name: "جبل الكراميل", length: 2200, speed: 5.5, road: "#d98a2b", edge: "#fff3d1", bg: ["#fff2b0", "#e0a040"], block: "#2e7d6b", car: "#6ad4ff" },
  { name: "مدينة النعناع", length: 2600, speed: 6, road: "#2aa198", edge: "#e0fff9", bg: ["#c9fff1", "#0f6f6a"], block: "#ff4d6d", car: "#ffffff" },
  { name: "قمة السكر", length: 3000, speed: 6.5, road: "#7e57c2", edge: "#f7e9ff", bg: ["#f3e5ff", "#4a2a80"], block: "#ffd166", car: "#ff6fb5" }
];

// الحفظ
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// الحالة
let unlocked = load("unlocked", 1);
let trackIdx = 0, running = false;
let distance = 0, speed = 0, objects = [], lane = 1, carX = LANES[1];
let candies = 0, spawnAcc = 0, finishing = false, finishY = -40, dashOffset = 0;

const overlay = document.getElementById("overlay");
const ovTitle = document.getElementById("ov-title");
const ovText = document.getElementById("ov-text");
const tracksBox = document.getElementById("tracks");

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// توليد صف جديد من العناصر أعلى الشاشة
function spawnRow() {
  const chance = 0.35 + trackIdx * 0.1;
  let blocks = 0;
  if (Math.random() < chance) {
    blocks = Math.random() < 0.2 + trackIdx * 0.08 ? 2 : 1;
  }
  const order = shuffle([0, 1, 2]);
  for (let k = 0; k < blocks; k++) {
    objects.push({ type: "block", lane: order[k], y: -40 });
  }
  for (let k = blocks; k < 3; k++) {
    if (Math.random() < 0.6) objects.push({ type: "candy", lane: order[k], y: -40, got: false });
  }
}

function startTrack(i) {
  trackIdx = i;
  const T = TRACKS[i];
  distance = 0;
  speed = T.speed;
  objects = [];
  lane = 1;
  carX = LANES[1];
  candies = 0;
  spawnAcc = 0;
  finishing = false;
  finishY = -40;
  running = true;
  overlay.classList.add("hidden");
}

function showOverlay(title, text) {
  ovTitle.textContent = title;
  ovText.textContent = text;
  renderTracks();
  overlay.classList.remove("hidden");
  running = false;
}

function renderTracks() {
  tracksBox.innerHTML = "";
  TRACKS.forEach((T, i) => {
    const btn = document.createElement("button");
    btn.className = "track-btn";
    const isLocked = i >= unlocked;
    btn.textContent = `${i + 1}. ${T.name}${isLocked ? "  🔒" : ""}`;
    btn.disabled = isLocked;
    btn.addEventListener("click", () => startTrack(i));
    tracksBox.appendChild(btn);
  });
}

function crash() {
  showOverlay("اصطدمت!", "الكتل الهلامية أوقفت سيارتك. حاول مرة أخرى واختر مسارًا.");
}

function win() {
  if (trackIdx + 2 > unlocked && trackIdx + 1 < TRACKS.length) {
    unlocked = trackIdx + 2;
    save("unlocked", unlocked);
  }
  const extra = trackIdx + 1 < TRACKS.length ? "فتحت المسار التالي!" : "أنهيت كل المسارات!";
  showOverlay("فزت!", `جمعت ${candies} حلوى. ${extra}`);
}

// المنطق
function update() {
  const T = TRACKS[trackIdx];
  distance += speed;
  dashOffset = (dashOffset + speed) % 40;
  carX += (LANES[lane] - carX) * 0.25;

  if (!finishing) {
    spawnAcc += speed;
    if (spawnAcc >= 60) { spawnAcc = 0; spawnRow(); }
    if (distance >= T.length) finishing = true;
  } else {
    finishY += speed;
  }

  for (const o of objects) o.y += speed;

  for (const o of objects) {
    if (o.type === "candy" && !o.got && o.lane === lane && Math.abs(o.y - PY) < 26) {
      o.got = true;
      candies++;
    }
  }
  objects = objects.filter(o => o.y < H + 40 && !o.got);

  for (const o of objects) {
    if (o.type === "block" && o.lane === lane && Math.abs(o.y - PY) < 44) {
      return crash();
    }
  }

  if (finishing && finishY >= PY - 30) return win();
}

// الرسم
function drawLolly(x, y, T) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - 2, y + 8, 4, 22);
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = T.block;
  ctx.fill();
}

function drawCar(x, y, T) {
  ctx.fillStyle = "#111";
  ctx.fillRect(x - 24, y - 20, 6, 12);
  ctx.fillRect(x + 18, y - 20, 6, 12);
  ctx.fillRect(x - 24, y + 10, 6, 12);
  ctx.fillRect(x + 18, y + 10, 6, 12);

  ctx.fillStyle = T.car;
  ctx.beginPath();
  ctx.roundRect(x - 20, y - 28, 40, 56, 10);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  ctx.roundRect(x - 13, y - 18, 26, 14, 4);
  ctx.fill();
}

function draw() {
  const T = TRACKS[trackIdx];

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, T.bg[0]);
  g.addColorStop(1, T.bg[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // الطريق وحوافه
  ctx.fillStyle = T.edge;
  ctx.fillRect(ROAD_L - 6, 0, ROAD_R - ROAD_L + 12, H);
  ctx.fillStyle = T.road;
  ctx.fillRect(ROAD_L, 0, ROAD_R - ROAD_L, H);

  // خطوط المسارات المتحركة
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  for (const x of [125, 225]) {
    for (let y = -40 + dashOffset; y < H; y += 40) ctx.fillRect(x - 3, y, 6, 22);
  }

  // مصاصات حلوى على الجانبين تتحرك مع السرعة
  for (let i = 0; i < 6; i++) {
    const y = ((i * 130 + distance) % (H + 130)) - 65;
    drawLolly(20, y, T);
    drawLolly(380, y, T);
  }

  // خط النهاية بشكل شطرنج
  if (finishing) {
    for (let x = ROAD_L; x < ROAD_R; x += 25) {
      for (let row = 0; row < 2; row++) {
        ctx.fillStyle = (x / 25 + row) % 2 === 0 ? "#111" : "#fff";
        ctx.fillRect(x, finishY + row * 12, 25, 12);
      }
    }
  }

  // الكتل والحلوى
  for (const o of objects) {
    if (o.type === "block") {
      ctx.fillStyle = T.block;
      ctx.beginPath();
      ctx.roundRect(LANES[o.lane] - 28, o.y - 20, 56, 40, 12);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(LANES[o.lane] - 18, o.y - 12, 16, 5);
    } else {
      ctx.beginPath();
      ctx.arc(LANES[o.lane], o.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe14d";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillRect(LANES[o.lane] - 2, o.y - 8, 4, 16);
    }
  }

  drawCar(carX, PY, T);
}

// الواجهة
const trackNameEl = document.getElementById("track-name");
const candiesEl = document.getElementById("candies");
const progressEl = document.getElementById("progress");

function updateHud() {
  const T = TRACKS[trackIdx];
  trackNameEl.textContent = T.name;
  candiesEl.textContent = candies;
  progressEl.textContent = Math.min(100, Math.floor((distance / T.length) * 100)) + "%";
}

// الأدوات: لوحة المفاتيح واللمس
function moveLane(dir) {
  if (!running) return;
  lane = Math.max(0, Math.min(2, lane + dir));
}

window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.code === "ArrowLeft" || e.code === "KeyA") { e.preventDefault(); moveLane(-1); }
  if (e.code === "ArrowRight" || e.code === "KeyD") { e.preventDefault(); moveLane(1); }
});

canvas.addEventListener("pointerdown", (e) => {
  const r = canvas.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * W;
  moveLane(x < W / 2 ? -1 : 1);
});

// الحلقة الرئيسية
function frame() {
  if (running) update();
  draw();
  updateHud();
  requestAnimationFrame(frame);
}

// البداية
trackIdx = 0;
showOverlay("سباق الحلوى", "اختر مسارًا لتبدأ السباق. اجمع الحلوى الصفراء وتجنب الكتل الهلامية، ووصل إلى خط النهاية.");
requestAnimationFrame(frame);
