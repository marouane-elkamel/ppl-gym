// PPL Gym: router and screens.
import { EXERCISES, SESSIONS, START_HERE, MAIN_LIFTS, IMG_DIR } from "./data/program.js";
import { createStore } from "./store.js";
import {
  todayISO,
  shortDate,
  sessionItems,
  isItemDone,
  hasActivity,
  lastTime,
  lastDoneEntry,
  shouldAddWeight,
  beatsLast,
  suggestNextTab,
  needsBackupReminder,
  bestPerSession,
  sessionVolume,
} from "./logic.js";
import { startRest, primeAudio } from "./timer.js";
import { lineChart } from "./charts.js";

const store = createStore(localStorageOrNull());
const app = document.getElementById("app");
const bar = document.getElementById("bar");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const BRAND = "#e8590c";
const ORDER = SESSIONS.map((s) => s.id);
const SESSION_BY_ID = Object.fromEntries(SESSIONS.map((s) => [s.id, s]));
let flash = "";

function localStorageOrNull() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);
const fmt = (v) => (Number.isInteger(v) ? String(v) : Number(v).toFixed(1));
const photo = (key, n = 0) => `${IMG_DIR}${EXERCISES[key].dbId}/${n}.jpg`;

function readNumber(input) {
  const raw = input.value.trim().replace(",", ".");
  const value = Number(raw);
  return raw === "" || !Number.isFinite(value) ? null : value;
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
function show(title, html, { back = null, color = null, keepScroll = false } = {}) {
  const accent = color ?? BRAND;
  document.documentElement.style.setProperty("--accent", accent);
  themeMeta?.setAttribute("content", accent);
  document.title = title === "PPL Gym" ? title : `${title} · PPL Gym`;
  bar.innerHTML = `${back ? `<a class="back" href="${back}" aria-label="Back">‹</a>` : ""}<h1>${esc(title)}</h1>`;

  app.onclick = null;
  app.onchange = null;
  app.onsubmit = null;
  const scrollY = window.scrollY;
  app.innerHTML = html;
  window.scrollTo(0, keepScroll ? scrollY : 0);
}

function photos(key) {
  const name = esc(EXERCISES[key].name);
  return `<div class="photos">
    <img src="${photo(key, 0)}" alt="${name}: start position">
    <img src="${photo(key, 1)}" alt="${name}: end position">
  </div>`;
}

/** Video card: a local thumbnail that only loads YouTube once it is tapped. */
function video(ex) {
  if (!ex.video) return "";
  const search = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${ex.name} how to proper form`)}`;
  return `
    <div class="video">
      <button type="button" class="video-play" data-video="${esc(ex.video.id)}" aria-label="Play: ${esc(ex.video.title)}">
        <img src="${IMG_DIR}yt/${esc(ex.video.id)}.jpg" alt="" loading="lazy">
        <span class="video-icon" aria-hidden="true">▶</span>
      </button>
      <div class="video-meta">
        <div class="video-title">${esc(ex.video.title)}</div>
        <div class="muted small">${esc(ex.video.channel)} · YouTube</div>
      </div>
    </div>
    <a class="video-more muted small" href="${esc(search)}" target="_blank" rel="noopener noreferrer">🔍 More videos for this exercise</a>`;
}

/** Swap a tapped thumbnail for the real player. */
function playVideo(button) {
  const id = button.dataset.video;
  const frame = document.createElement("iframe");
  frame.className = "video-frame";
  frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
  frame.title = button.getAttribute("aria-label").replace(/^Play: /, "");
  frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  frame.allowFullscreen = true;
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  button.replaceWith(frame);
}

function howTo(ex, openSteps = false) {
  return `
    ${video(ex)}
    ${ex.setup ? `<details><summary>⚙️ Setup</summary><p>${esc(ex.setup)}</p></details>` : ""}
    <details ${openSteps ? "open" : ""}><summary>▶️ How to</summary>
      <ol>${ex.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
    </details>
    ${ex.mistakes ? `<details><summary>⚠️ Avoid</summary><ul>${ex.mistakes.map((m) => `<li>${esc(m)}</li>`).join("")}</ul></details>` : ""}
    ${ex.swap ? `<details><summary>🔁 Machine taken?</summary><p>${esc(ex.swap)}</p></details>` : ""}
    <p class="muted small">🎯 ${esc(ex.muscles)} · ${esc(ex.equipment)}</p>`;
}

function itemInfo(s, item) {
  switch (item.kind) {
    case "warmup":
      return { name: "Warm-up", sub: s.warmupText.replaceAll("\n", " · "), thumb: s.warmupKeys[0] };
    case "lift": {
      const { key, sets, reps, rest } = item.lift;
      return { name: EXERCISES[key].name, sub: `${sets}×${reps} · rest ${rest}`, thumb: key };
    }
    case "cardio":
      return { name: EXERCISES[s.cardio.key].name, sub: `${s.cardio.minutes} min · ${s.cardio.setting}`, thumb: s.cardio.key };
    default:
      return {
        name: "Cool-down stretches",
        sub: s.cooldownKeys.map((k) => EXERCISES[k].name).join(" · "),
        thumb: s.cooldownKeys[0],
      };
  }
}

function finishWorkout(s) {
  const active = store.activeSession(s.id);
  if (active) store.finishSession(active.id);
  flash = `${s.tab} workout saved 💪`;
  location.hash = "#/";
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
function renderHome() {
  const data = store.data;
  const today = todayISO();
  const next = suggestNextTab(data, ORDER, today);

  const cards = SESSIONS.map((s) => {
    const last = data.sessions.filter((x) => x.tab === s.id && hasActivity(x)).sort((a, b) => b.startedAt - a.startedAt)[0];
    const open = store.activeSession(s.id, today);
    const inProgress = open && hasActivity(open);
    const badge = s.id === next ? `<span class="badge">${inProgress ? "In progress" : "Next up"}</span>` : "";
    return `
      <a class="day-card ${s.id === next ? "next" : ""}" href="#/day/${s.id}" style="--accent:${s.color}">
        <div class="day-card-top"><span class="day-name">${esc(s.tab)}</span>${badge}</div>
        <div class="day-focus">${esc(s.focus)}</div>
        <div class="day-meta">${esc(s.day)} · ~85 min · ${last ? `Last: ${shortDate(last.date)}` : "Not done yet"}</div>
      </a>`;
  }).join("");

  const message = flash;
  flash = "";
  show("PPL Gym", `
    ${message ? `<p class="banner ok">${esc(message)}</p>` : ""}
    ${needsBackupReminder(data, Date.now()) ? `<a class="banner" href="#/settings">💾 Back up your workouts: tap to export a backup file.</a>` : ""}
    <p class="muted">Pick today's workout</p>
    <div class="cards">${cards}</div>
    <nav class="home-links">
      <a href="#/progress">📈<br>Progress</a>
      <a href="#/guide">📖<br>Start here</a>
      <a href="#/settings">⚙️<br>Settings</a>
    </nav>`);
}

// ---------------------------------------------------------------------------
// Day
// ---------------------------------------------------------------------------
function renderDay(s) {
  const active = store.activeSession(s.id);
  const items = sessionItems(s);
  const firstOpen = items.find((i) => !isItemDone(active?.items[i.key], i)) ?? items.at(-1);
  const started = active && hasActivity(active);

  const row = (item) => {
    const info = itemInfo(s, item);
    const entry = active?.items[item.key];
    const done = isItemDone(entry, item);
    const setsDone = item.kind === "lift" ? (entry?.sets ?? []).filter((x) => x.done).length : 0;
    const status = done ? "✓" : setsDone ? `${setsDone}/${item.lift.sets}` : "";
    return `
      <li><a class="item ${done ? "done" : ""}" href="#/day/${s.id}/${item.key}">
        <img src="${photo(info.thumb)}" alt="" loading="lazy">
        <div><div class="item-name">${esc(info.name)}</div><div class="muted small">${esc(info.sub)}</div></div>
        <span class="status">${status}</span>
      </a></li>`;
  };

  const block = (title, duration, kinds) => `
    <section class="block">
      <h2>${title} <span class="muted">· ${duration}</span></h2>
      <ol class="items">${items.filter((i) => kinds.includes(i.kind)).map(row).join("")}</ol>
    </section>`;

  show(s.tab, `
    <p class="muted">${esc(s.day)} · ${esc(s.focus)} · ~85 min</p>
    <div class="actions">
      <a class="btn primary" href="#/day/${s.id}/${firstOpen.key}">${started ? "Continue workout →" : "Start workout →"}</a>
    </div>
    ${block("① Warm-up", "8 min", ["warmup"])}
    ${block("② Lifting", "~50 min", ["lift"])}
    ${block("③ Cardio", `${s.cardio.minutes} min`, ["cardio"])}
    ${block("④ Cool-down", "5 min", ["cooldown"])}
    ${started ? `<button class="btn wide" data-action="finish">Finish workout ✓</button>` : ""}`,
  { back: "#/", color: s.color });

  app.onclick = (event) => {
    if (event.target.closest("[data-action]")?.dataset.action === "finish") finishWorkout(s);
  };
}

// ---------------------------------------------------------------------------
// Exercise / step screen
// ---------------------------------------------------------------------------
function renderItem(s, key, { keepScroll = false } = {}) {
  const session = store.ensureSession(s.id);
  const items = sessionItems(s);
  const index = items.findIndex((i) => i.key === key);
  const item = items[index];
  const prev = items[index - 1];
  const next = items[index + 1];
  const rerender = () => renderItem(s, key, { keepScroll: true });

  let body;
  if (item.kind === "lift") body = liftBody(s, item.lift, session);
  else if (item.kind === "cardio") body = cardioBody(s, session);
  else body = checklistBody(s, item.kind, session);

  const nav = `
    <div class="step-nav">
      ${prev ? `<a class="btn" href="#/day/${s.id}/${prev.key}">← Prev</a>` : `<a class="btn" href="#/day/${s.id}">Overview</a>`}
      ${next
        ? `<a class="btn primary" href="#/day/${s.id}/${next.key}">Next →</a>`
        : `<button class="btn primary" data-action="finish">Finish workout ✓</button>`}
    </div>`;

  show(itemInfo(s, item).name, `
    <p class="muted small">${esc(s.tab)} · step ${index + 1} of ${items.length}</p>
    ${body}
    ${nav}`,
  { back: `#/day/${s.id}`, color: s.color, keepScroll });

  app.onclick = (event) => {
    const target = event.target.closest("[data-action]");
    const action = target?.dataset.action;
    if (action === "finish") return finishWorkout(s);
    if (event.target.closest("[data-video]")) return playVideo(event.target.closest("[data-video]"));
    if (action === "tick") return tickSet(item.lift, session, target.closest("[data-set]"), rerender);
    if (action === "toggle-done") {
      store.update(() => {
        const entry = session.items[item.key] ?? {};
        if (item.kind === "cardio") {
          entry.minutes = readNumber(app.querySelector('[data-cardio="minutes"]')) ?? s.cardio.minutes;
          entry.setting = readNumber(app.querySelector('[data-cardio="setting"]'));
        }
        entry.done = !entry.done;
        session.items[item.key] = entry;
      });
      return rerender();
    }
  };

  app.onchange = (event) => {
    const input = event.target;
    if (input.dataset.field) {
      const index = Number(input.closest("[data-set]").dataset.set);
      store.update(() => { session.items[item.key].sets[index][input.dataset.field] = readNumber(input); });
    }
    if (input.dataset.cardio) {
      store.update(() => {
        session.items.cardio = { ...(session.items.cardio ?? {}), [input.dataset.cardio]: readNumber(input) };
      });
    }
  };
}

function formatSets(sets, lift) {
  if (lift.track === "reps") return `${sets.map((x) => x.reps).join(" / ")} s`;
  const kgs = [...new Set(sets.map((x) => x.kg ?? 0))];
  if (kgs.length === 1) return `${fmt(kgs[0])} kg × ${sets.map((x) => x.reps).join(" / ")}`;
  return sets.map((x) => `${fmt(x.kg ?? 0)}×${x.reps}`).join(" · ");
}

function liftBody(s, lift, session) {
  const ex = EXERCISES[lift.key];
  const last = lastTime(store.data, s.id, lift.key, session.id);
  if (!session.items[lift.key]) {
    store.update(() => {
      session.items[lift.key] = {
        sets: Array.from({ length: lift.sets }, (_, i) => ({
          kg: (last?.[i] ?? last?.at(-1))?.kg ?? null,
          reps: null,
          done: false,
        })),
      };
    });
  }
  const entry = session.items[lift.key];
  const secondsBased = lift.track === "reps";

  let addWeight = "";
  if (shouldAddWeight(last, lift)) {
    const hint = secondsBased ? "go for a longer hold" : /dumbbell/i.test(ex.equipment) ? "+1-2 kg" : "+2.5-5 kg";
    addWeight = `<div class="badge-add">＋ Add weight today (${hint}). You hit ${lift.top} on every set last time.</div>`;
  }

  const rows = entry.sets.map((set, i) => {
    const repsHint = last?.[i]?.reps ?? last?.at(-1)?.reps ?? "";
    const star = beatsLast(set, last, lift.track) ? "<br>⭐" : "";
    return `
      <div class="set ${set.done ? "done" : ""}" data-set="${i}">
        <span class="set-label">S${i + 1}${star}</span>
        <label class="field">
          <input type="text" inputmode="decimal" data-field="kg" value="${esc(set.kg)}" placeholder="${secondsBased ? "+kg" : "kg"}" aria-label="Set ${i + 1} weight in kg">
          <span>kg</span>
        </label>
        <label class="field">
          <input type="text" inputmode="numeric" data-field="reps" value="${esc(set.reps)}" placeholder="${esc(repsHint)}" aria-label="Set ${i + 1} ${secondsBased ? "seconds" : "reps"}">
          <span>${secondsBased ? "sec" : "reps"}</span>
        </label>
        <button type="button" class="tick" data-action="tick" aria-pressed="${set.done}" aria-label="Set ${i + 1} done">${set.done ? "✓" : ""}</button>
      </div>`;
  }).join("");

  return `
    ${photos(lift.key)}
    <div class="target"><strong>${lift.sets} × ${esc(lift.reps)}</strong> · rest ${esc(lift.rest)}${lift.note ? ` · <span class="muted">${esc(lift.note)}</span>` : ""}</div>
    ${addWeight}
    <p class="last">${last ? `Last time: ${esc(formatSets(last, lift))}` : "First time: pick a weight you can lift about 10 times with good form."}</p>
    <div class="sets">${rows}</div>
    ${howTo(ex, !last)}`;
}

function tickSet(lift, session, row, rerender) {
  const index = Number(row.dataset.set);
  const set = session.items[lift.key].sets[index];
  if (set.done) {
    store.update(() => { set.done = false; });
    return rerender();
  }

  const repsInput = row.querySelector('[data-field="reps"]');
  const reps = readNumber(repsInput) ?? (Number(repsInput.placeholder) || null);
  if (!reps || reps <= 0) {
    repsInput.classList.add("invalid");
    repsInput.focus();
    return;
  }
  store.update(() => {
    Object.assign(set, { kg: readNumber(row.querySelector('[data-field="kg"]')), reps, done: true });
    // Carry the weight forward to the remaining sets that don't have one yet.
    for (const later of session.items[lift.key].sets.slice(index + 1)) {
      if (later.kg == null && !later.done) later.kg = set.kg;
    }
  });
  primeAudio();
  startRest(lift.restSec, store.data.settings);
  rerender();
}

function exerciseCard(key) {
  const ex = EXERCISES[key];
  return `
    <details class="card">
      <summary><img class="thumb" src="${photo(key)}" alt="" loading="lazy"><span>${esc(ex.name)}</span></summary>
      ${photos(key)}
      ${howTo(ex)}
    </details>`;
}

function doneButton(done) {
  return `<button class="btn wide ${done ? "" : "primary"}" data-action="toggle-done">${done ? "✓ Done (tap to undo)" : "Mark done"}</button>`;
}

function checklistBody(s, kind, session) {
  const keys = kind === "warmup" ? s.warmupKeys : s.cooldownKeys;
  const steps = kind === "warmup"
    ? s.warmupText.split("\n")
    : ["Hold each stretch about 30 seconds.", "Breathe slowly and never bounce."];
  return `
    <ul class="checklist">${steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ul>
    ${keys.map(exerciseCard).join("")}
    ${doneButton(!!session.items[kind]?.done)}`;
}

function cardioBody(s, session) {
  const cardio = s.cardio;
  const entry = session.items.cardio ?? {};
  const last = lastDoneEntry(store.data, s.id, "cardio", session.id);
  return `
    ${photos(cardio.key)}
    <div class="target"><strong>${cardio.minutes} min</strong> · ${esc(cardio.setting)}</div>
    ${last ? `<p class="last">Last time: ${fmt(last.minutes ?? cardio.minutes)} min${last.setting != null ? ` · ${esc(cardio.unit)} ${fmt(last.setting)}` : ""}</p>` : ""}
    <div class="cardio-inputs">
      <label class="field"><input type="text" inputmode="decimal" data-cardio="minutes" value="${esc(entry.minutes)}" placeholder="${cardio.minutes}" aria-label="Minutes"><span>min</span></label>
      <label class="field"><input type="text" inputmode="decimal" data-cardio="setting" value="${esc(entry.setting)}" placeholder="${esc(last?.setting)}" aria-label="${esc(cardio.unit)}"><span>${esc(cardio.unit)}</span></label>
    </div>
    ${doneButton(!!entry.done)}
    ${howTo(EXERCISES[cardio.key])}`;
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
function renderProgress() {
  const data = store.data;
  const latestWeight = data.bodyweight.at(-1);

  const daySections = SESSIONS.map((s) => {
    const lifts = [...s.lifts].sort((a, b) => MAIN_LIFTS.includes(b.key) - MAIN_LIFTS.includes(a.key));
    const cards = lifts.map((lift) => {
      const points = bestPerSession(data, s.id, lift.key, lift.track);
      if (!points.length) return "";
      const unit = lift.track === "reps" ? "s" : "kg";
      return `
        <div class="chart-card">
          <div class="chart-head"><span>${esc(EXERCISES[lift.key].name)}</span><strong>${fmt(points.at(-1).value)} ${unit}</strong></div>
          ${lineChart(points, { color: s.color, unit })}
        </div>`;
    }).join("");
    return cards ? `<section class="block"><h2 style="color:${s.color}">${esc(s.tab)}</h2>${cards}</section>` : "";
  }).join("");

  const history = data.sessions
    .filter(hasActivity)
    .sort((a, b) => b.startedAt - a.startedAt)
    .map((session) => {
      const s = SESSION_BY_ID[session.tab];
      const sets = Object.values(session.items).flatMap((e) => e?.sets ?? []).filter((x) => x.done).length;
      return `
        <li>
          <span class="dot" style="background:${s?.color ?? "var(--muted)"}"></span>
          <span>${esc(shortDate(session.date))}</span>
          <strong>${esc(s?.tab ?? session.tab)}</strong>
          <span class="muted small">${sets} sets · ${Math.round(sessionVolume(session)).toLocaleString()} kg</span>
        </li>`;
    }).join("");

  show("Progress", `
    <section class="block">
      <h2>Bodyweight</h2>
      <form class="bw-form">
        <label class="field"><input type="text" inputmode="decimal" name="kg" placeholder="${esc(latestWeight?.kg ?? "e.g. 78.5")}" aria-label="Bodyweight in kg"><span>kg</span></label>
        <button class="btn primary">Save today</button>
      </form>
      ${lineChart(data.bodyweight.map((b) => ({ date: b.date, value: b.kg })), { color: BRAND, unit: "kg" })}
    </section>
    ${daySections || `<p class="muted">Charts for each exercise appear after your first logged workout.</p>`}
    <section class="block">
      <h2>History</h2>
      ${history ? `<ul class="history">${history}</ul>` : `<p class="muted">No workouts yet.</p>`}
    </section>`,
  { back: "#/" });

  app.onsubmit = (event) => {
    event.preventDefault();
    const input = event.target.elements.kg;
    const kg = readNumber(input);
    if (!kg || kg < 20 || kg > 400) {
      input.classList.add("invalid");
      return;
    }
    store.addBodyweight(kg);
    renderProgress();
  };
}

// ---------------------------------------------------------------------------
// Start here & settings
// ---------------------------------------------------------------------------
function renderGuide() {
  show("Start here", `
    <div class="guide">
      ${START_HERE.map((section) => `
        <section class="block">
          <h2>${esc(section.heading)}</h2>
          ${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
        </section>`).join("")}
    </div>
    <p class="muted small">Exercise photos: <a href="https://github.com/yuhonas/free-exercise-db">free-exercise-db</a> (public domain).</p>`,
  { back: "#/" });
}

function renderSettings(message = "") {
  const data = store.data;
  const checked = (on) => (on ? "checked" : "");
  show("Settings", `
    ${message ? `<p class="banner ok">${esc(message)}</p>` : ""}
    <section class="block">
      <h2>Backup</h2>
      <p class="muted">Your workouts are saved on this device only. Export a backup every couple of weeks and keep the file in Google Drive or iCloud.</p>
      <p class="muted small">Last backup: ${data.lastExportAt ? new Date(data.lastExportAt).toLocaleDateString() : "never"}</p>
      <div class="actions">
        <button class="btn primary" data-action="export">⬇️ Export backup</button>
        <label class="btn">⬆️ Import backup<input type="file" accept="application/json,.json" data-import hidden></label>
      </div>
    </section>
    <section class="block">
      <h2>Rest timer</h2>
      <label class="toggle"><input type="checkbox" data-setting="sound" ${checked(data.settings.sound)}> Beep when rest is over</label>
      <label class="toggle"><input type="checkbox" data-setting="vibrate" ${checked(data.settings.vibrate)}> Vibrate when rest is over (Android)</label>
    </section>
    <section class="block">
      <h2>Danger zone</h2>
      <button class="btn danger" data-action="reset">Delete all data</button>
    </section>`,
  { back: "#/" });

  app.onclick = (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "export") exportBackup();
    if (action === "reset" && confirm("Delete all workouts and bodyweight entries on this device? This cannot be undone.")) {
      store.reset();
      renderSettings("All data deleted.");
    }
  };

  app.onchange = async (event) => {
    const input = event.target;
    if (input.dataset.setting) {
      store.update((d) => { d.settings[input.dataset.setting] = input.checked; });
    }
    if (input.hasAttribute("data-import") && input.files?.[0]) {
      const text = await input.files[0].text();
      if (!confirm("Replace all data on this device with this backup?")) return;
      try {
        store.importJSON(text);
        renderSettings("Backup imported ✓");
      } catch (error) {
        renderSettings(`Import failed: ${error.message}`);
      }
    }
  };
}

function exportBackup() {
  const blob = new Blob([store.exportJSON()], { type: "application/json" });
  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: `ppl-backup-${todayISO()}.json`,
  });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  renderSettings("Backup exported ✓");
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
function route() {
  const [page, tabId, itemKey] = location.hash.replace(/^#\/?/, "").split("/");
  const session = SESSION_BY_ID[tabId];
  if (page === "day" && session) {
    if (itemKey && sessionItems(session).some((i) => i.key === itemKey)) return renderItem(session, itemKey);
    return renderDay(session);
  }
  if (page === "progress") return renderProgress();
  if (page === "guide") return renderGuide();
  if (page === "settings") return renderSettings();
  return renderHome();
}

window.addEventListener("hashchange", route);
route();

if ("serviceWorker" in navigator && window.isSecureContext) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
