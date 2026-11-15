// Wheel drawing, song order (first spin = Давинчи закон), spin animation, reveal + confetti.

// 3 songs × 2 = 6 slices
const SLICES = [0, 1, 2, 0, 1, 2];
const FILLS = ["url(#s-red)", "url(#s-gold)", "url(#s-violet)", "url(#s-red)", "url(#s-gold)", "url(#s-violet)"];
const SEG = 360 / SLICES.length;
const R = 100;

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");

// ---------- ticker ----------
const line = GREETINGS.map(g => `<span>${g}</span>`).join("");
document.getElementById("run").innerHTML = line + line; // doubled for a seamless loop

// ---------- sparkles ----------
const fx = document.getElementById("fx");
for (let i = 0; i < 28; i++) {
  const s = document.createElement("span");
  s.className = "star"; s.textContent = "✦";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.fontSize = 8 + Math.random() * 16 + "px";
  s.style.animationDelay = -Math.random() * 2.4 + "s";
  s.style.animationDuration = 1.6 + Math.random() * 2 + "s";
  fx.appendChild(s);
}

// ---------- draw wheel ----------
const pt = (deg, r) => {
  const a = deg * Math.PI / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
};
const grad = (id, a, b, c) =>
  `<radialGradient id="${id}" cx="0" cy="0" r="100" gradientUnits="userSpaceOnUse">
     <stop offset=".15" stop-color="${a}"/><stop offset=".7" stop-color="${b}"/><stop offset="1" stop-color="${c}"/>
   </radialGradient>`;
let svg = `<defs>
  ${grad("s-red", "#ff5a6e", "#d4001f", "#7a0012")}
  ${grad("s-gold", "#fff2a8", "#f0b400", "#9a6a00")}
  ${grad("s-violet", "#b46cff", "#5b1a9e", "#2a0752")}
</defs>`;
SLICES.forEach((songIdx, i) => {
  const a0 = i * SEG, a1 = a0 + SEG, mid = a0 + SEG / 2;
  const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
  svg += `<path d="M0 0 L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z" fill="${FILLS[i]}" stroke="#ffe066" stroke-width="1.2"/>`;
  svg += `<text transform="rotate(${mid}) translate(0 -62) rotate(-90)">${SONGS[songIdx].title}</text>`;
});
for (let i = 0; i < 24; i++) {
  const [x, y] = pt(i * 15 + 7.5, R - 4);
  svg += `<circle class="bulb${i % 2 ? " alt" : ""}" cx="${x}" cy="${y}" r="2.2" stroke="#3a2000" stroke-width=".6"/>`;
}
wheel.innerHTML = svg;

// ---------- pick order: every song once before any repeats ----------
// first spin is ALWAYS Давинчи закон, then the other two in random order, then random cycles
let queue = [1, ...[0, 2].sort(() => Math.random() - 0.5)], last = -1;
function nextSong() {
  if (!queue.length) {
    queue = [0, 1, 2].sort(() => Math.random() - 0.5);
    if (queue[0] === last) queue.push(queue.shift()); // no back-to-back repeat across rounds
  }
  return (last = queue.shift());
}

// ---------- spin ----------
let rotation = 0;
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  if (yt && yt.stopVideo) yt.stopVideo();      // stop previous song
  document.dispatchEvent(new CustomEvent("music", { detail: false }));
  document.dispatchEvent(new Event("spin"));
  result.classList.remove("show");

  const song = nextSong();
  const options = SLICES.map((s, i) => s === song ? i : -1).filter(i => i >= 0);
  const slice = options[Math.floor(Math.random() * options.length)];
  const center = slice * SEG + SEG / 2;
  const jitter = (Math.random() - 0.5) * SEG * 0.7;
  const target = (360 - center + jitter + 360) % 360;
  const delta = (target - (rotation % 360) + 360) % 360;
  rotation += 360 * 6 + delta;

  wheel.dataset.song = song;
  wheel.style.transform = `rotate(${rotation}deg)`;
});

wheel.addEventListener("transitionend", () => {
  const s = SONGS[+wheel.dataset.song];
  document.getElementById("song").textContent = s.title;
  document.getElementById("artist").textContent = s.artist.toUpperCase();
  playSong(s);
  document.getElementById("ytlink").href = `https://www.youtube.com/watch?v=${s.yt}`;
  result.hidden = false;
  requestAnimationFrame(() => result.classList.add("show"));
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  spinBtn.disabled = false;

  if (window.confetti) {
    const colors = ["#ffd23f", "#fff2a8", "#d4001f", "#c2128a", "#ffffff"];
    const opts = { particleCount: 70, spread: 75, colors, shapes: ["star", "circle"], scalar: 1.2 };
    confetti({ ...opts, angle: 60,  origin: { x: 0, y: 0.75 } });
    confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.75 } });
    setTimeout(() => confetti({ ...opts, particleCount: 60, spread: 120, startVelocity: 35, origin: { x: .5, y: .35 } }), 250);
  }
});
