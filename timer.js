// Rest timer: a bar pinned to the bottom of the screen, with beep and vibration at zero.

let endAt = 0;
let total = 0;
let interval = null;
let hideTimeout = null;
let audio = null;
let settings = { sound: true, vibrate: true };

const bar = () => document.getElementById("rest");

/** Call from a tap handler so the browser allows the beep later. */
export function primeAudio() {
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
  } catch {
    audio = null;
  }
}

export function startRest(seconds, alarmSettings = settings) {
  settings = alarmSettings;
  total = seconds * 1000;
  endAt = Date.now() + total;
  clearTimeout(hideTimeout);
  clearInterval(interval);
  interval = setInterval(render, 250);
  render();
}

export function addRest(seconds) {
  if (!interval) return;
  endAt += seconds * 1000;
  total += seconds * 1000;
  render();
}

export function skipRest() {
  clearInterval(interval);
  interval = null;
  const el = bar();
  if (el) el.hidden = true;
}

function ensureBar(el) {
  if (el.dataset.ready) return;
  el.innerHTML = `
    <div class="rest-fill"></div>
    <span class="rest-label">Rest</span>
    <span class="rest-time"></span>
    <button type="button" data-rest="add">+15s</button>
    <button type="button" data-rest="skip">Skip</button>`;
  el.addEventListener("click", (event) => {
    const action = event.target.closest("[data-rest]")?.dataset.rest;
    if (action === "add") addRest(15);
    if (action === "skip") skipRest();
  });
  el.dataset.ready = "1";
}

function render() {
  const el = bar();
  if (!el) return;
  ensureBar(el);
  const left = Math.max(0, endAt - Date.now());
  el.hidden = false;
  el.classList.toggle("over", left === 0);

  if (left === 0) {
    clearInterval(interval);
    interval = null;
    el.querySelector(".rest-label").textContent = "Rest over:";
    el.querySelector(".rest-time").textContent = "next set 💪";
    el.querySelector(".rest-fill").style.width = "100%";
    alarm();
    hideTimeout = setTimeout(() => { el.hidden = true; }, 5000);
    return;
  }

  const secs = Math.ceil(left / 1000);
  el.querySelector(".rest-label").textContent = "Rest";
  el.querySelector(".rest-time").textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  el.querySelector(".rest-fill").style.width = `${(100 * (total - left)) / total}%`;
}

function alarm() {
  if (settings.vibrate && navigator.vibrate) navigator.vibrate([200, 100, 200]);
  if (!settings.sound || !audio) return;
  const start = audio.currentTime;
  for (const offset of [0, 0.3]) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.25, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, start + offset + 0.2);
    osc.connect(gain).connect(audio.destination);
    osc.start(start + offset);
    osc.stop(start + offset + 0.2);
  }
}

// Timers are throttled while the screen is locked; catch up as soon as it is visible again.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && interval) render();
});
