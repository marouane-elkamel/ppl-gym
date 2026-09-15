# PPL Gym Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static, offline-capable phone web app. You pick Push, Pull or Legs, walk through the session's exercises (photos + how-to), log kg and reps for each set with a rest timer, and track progress.

**Architecture:**
- Vanilla ES modules rendered into `#app` with hash routing.
- Pure rules live in `logic.js`, which is unit-tested with `node --test`.
- Saving and backups live in `store.js`, wrapped around an injectable `localStorage`.
- The UI in `app.js` calls only those modules plus `timer.js` and `charts.js`.
- A service worker precaches the app shell and every photo.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Service Worker, Web App Manifest, Node 25 `node:test` for tests, Python 3 stdlib for the one-off asset scripts.

**Spec:** `docs/superpowers/specs/2026-09-15-ppl-gym-webapp-design.md`

## Global Constraints
- No build step and no runtime dependencies. Every URL is relative (`./`, `img/…`) so the app also works under a sub-path like GitHub Pages `/repo/`.
- Hash routes: `#/`, `#/day/<tabId>`, `#/day/<tabId>/<itemKey>`, `#/progress`, `#/guide`, `#/settings`.
- localStorage key `ppl.v1`; data `version: 1`.
- Mobile-first layout that works at 360px wide. Dark and light mode follow `prefers-color-scheme`.
- The project folder is not a git repository and the user hasn't asked for commits, so the steps have no commit step.

## File map
| File | Responsibility |
|---|---|
| `data/program.js` | Program content, ported from `program.py` |
| `tools/fetch_images.py` | Downloads photos to `img/` and writes `img/index.json` |
| `tools/make_icons.py` | Writes the PWA icon PNGs |
| `logic.js` | Pure rules (no DOM, no storage) |
| `store.js` | Saved data, sessions, backups |
| `timer.js` | Rest timer bar, beep and vibration |
| `charts.js` | SVG line chart as a string |
| `app.js` | Router and all screens |
| `index.html`, `styles.css` | App shell and styles |
| `sw.js`, `manifest.webmanifest` | Offline support and install |
| `tests/logic.test.mjs`, `tests/store.test.mjs` | Unit tests |
| `README.md` | How to run, test and host |

---

### Task 1: Content, photos, icons, cleanup
**Files:** Create `data/program.js`, `tools/fetch_images.py`, `tools/make_icons.py`, `img/**`, `icons/*.png`. Delete `build_sheet.py`, `program.py`, `out/`, `.venv/`.

**Produces:**
- `data/program.js` exports:
  - `EXERCISES`: `{[key]: {name, dbId, muscles, equipment, setup|null, steps[], mistakes[]|null, swap|null}}`
  - `SESSIONS`: `[{id:"push"|"pull"|"legs", tab, day, focus, color, light, warmupKeys[], warmupText, lifts[{key, sets, reps, top, rest, restSec, track?, note?}], cardio{key, minutes, setting, unit}, cooldownKeys[]}]`
  - `START_HERE`: `[{heading, paragraphs[]}]`
  - `MAIN_LIFTS`: `string[]`
  - `IMG_DIR = "img/"`
- `img/index.json` = array of 66 relative photo paths.

- [ ] Generate `data/program.js` from `program.py` with a one-off Python conversion. Keys become camelCase; add `id` and `restSec`. Rewrite the Start Here sections that mention the spreadsheet so they describe the app.
- [ ] Run `python3 tools/fetch_images.py`. Expected: `66 images in img/`.
- [ ] Run `python3 tools/make_icons.py`. Expected: `icons/icon-192.png`, `icons/icon-512.png` and `icons/apple-touch-icon.png` exist.
- [ ] Check: `node -e "import('./data/program.js').then(m=>console.log(Object.keys(m.EXERCISES).length, m.SESSIONS.map(s=>s.lifts.length)))"`. Expected: `33 [ 7, 7, 7 ]`.
- [ ] Delete the Google Sheet files.

### Task 2: Pure logic (TDD)
**Files:** Create `logic.js`, `tests/logic.test.mjs`.

**Produces (exact signatures):**
- `todayISO(now: Date = new Date()): string`: local `YYYY-MM-DD`
- `sessionItems(session): Array<{key, kind: "warmup"|"lift"|"cardio"|"cooldown", lift?}>`
- `isItemDone(entry|undefined, item): boolean`
- `lastTime(data, tabId, key, excludeSessionId): Array<{kg, reps, done}>|null`: done sets from the newest *other* session of that tab that has done sets for `key`
- `shouldAddWeight(lastSets|null, lift): boolean`: at least `lift.sets` done sets and every `reps >= lift.top`
- `beatsLast(set, lastSets|null, track?): boolean`
- `suggestNextTab(data, order: string[], today: string): string`
- `needsBackupReminder(data, nowMs): boolean`
- `validateBackup(obj): {ok: true} | {ok: false, error: string}`
- `bestPerSession(data, tabId, key, track?): Array<{date, value}>`, oldest first

- [ ] Write `tests/logic.test.mjs` with one test per function above, covering:
  - add-weight true and false (one set below the top, or too few sets)
  - beats-last by kg and by reps at the same kg
  - suggest: no sessions → first tab; an unfinished session today → that tab; otherwise the tab after the latest one
  - backup reminder at 0 sessions, with no export, and with an export 15 days ago vs 1 day ago
  - validateBackup on a bad version, missing arrays and a good object
  - bestPerSession skipping sessions without done sets, and using reps when `track === "reps"`
- [ ] Run `node --test tests/*.test.mjs`. Expected: FAIL (module not found).
- [ ] Implement `logic.js`.
- [ ] Run `node --test tests/*.test.mjs`. Expected: all pass.

### Task 3: Store (TDD)
**Files:** Create `store.js`, `tests/store.test.mjs`.

**Consumes:** `todayISO` and `validateBackup` from `logic.js`.

**Produces:**
- `emptyData()`
- `createStore(storage)` → `{ data (getter), update(fn), activeSession(tabId, date?), ensureSession(tabId, now?), finishSession(id, nowMs?), addBodyweight(kg, date?), exportJSON(nowMs?), importJSON(text), reset() }`
- Every mutation saves to `storage.setItem("ppl.v1", …)`.
- Corrupt or missing storage falls back to `emptyData()`.
- Storage exceptions are swallowed, so the app still works in private mode.

- [ ] Write tests using an in-memory fake storage. Cover:
  - persist and reload
  - corrupt JSON → empty data
  - `ensureSession` returns the same session twice on the same day
  - `finishSession` → `activeSession` returns null
  - `addBodyweight` replaces an entry with the same date
  - `exportJSON` sets `lastExportAt`
  - `importJSON` rejects bad data and replaces data with good data
  - `reset`
- [ ] Run → FAIL. Implement → run → PASS.

### Task 4: Shell, Home, Day screens
**Files:** Create `index.html`, `styles.css`, `app.js`.

**Consumes:** `store.js`, `logic.js`, `data/program.js`.

- [ ] `index.html`:
  - viewport + theme-color meta, manifest link, apple-touch-icon
  - `<header id="bar">`, `<main id="app">`, `<div id="rest" hidden>`
  - `<script type="module" src="app.js">`
  - service worker registration inside `app.js`
- [ ] `app.js` router: on `hashchange` and on load, parse the route and call `renderHome`, `renderDay`, `renderItem`, `renderProgress`, `renderGuide` or `renderSettings`. Scroll to the top after each render.
- [ ] Home:
  - one card per session: tab, day, focus, "Last: <date>" or "Not done yet"
  - the suggested card gets a "Next up" badge
  - backup reminder banner (links to Settings) when `needsBackupReminder`
  - bottom links to Progress, Start Here and Settings
- [ ] Day:
  - header in the session color
  - four blocks listing each item: name, `sets×reps · rest`, and a status (✓ done, `n/3` sets, or blank)
  - "Start workout" / "Continue" goes to the first item that isn't done
  - "Finish workout" (shown when a session is active) calls `finishSession` and returns Home
- [ ] Run `python3 -m http.server 8765` and `curl -s localhost:8765/ | head`. Expected: the HTML is served, and `node --test` still passes.

### Task 5: Exercise screen + rest timer
**Files:** Create `timer.js`; modify `app.js`, `styles.css`.

**Produces:** `timer.js` exports:
- `startRest(seconds, settings)`, `addRest(sec)`, `skipRest()`, `primeAudio()`
- It renders into `#rest`: remaining `m:ss`, a progress bar, and `+15s` / `Skip` buttons.
- It counts down from `endAt = Date.now() + ms`, so it stays correct after the screen locks.
- At zero it calls `navigator.vibrate([200,100,200])` if enabled and plays two 880 Hz WebAudio beeps if enabled.

- [ ] `renderItem` for a lift:
  - calls `ensureSession`
  - if the entry is missing, creates `lift.sets` rows, pre-filling kg from `lastTime` (same index, else the last set) and leaving reps empty
  - shows two photos (`loading="lazy"`), `sets×reps · rest`, "Last time: 30 kg × 12 / 11 / 10", and a "+ Add weight" badge when `shouldAddWeight`
  - set rows: `S1 [kg inputmode=decimal] [reps inputmode=numeric placeholder=last reps] [✓]`
- [ ] Ticking a set:
  - if reps are empty, use the placeholder value if there is one; otherwise mark the reps input as invalid and don't tick
  - otherwise mark the set done, save, show ⭐ when `beatsLast`, `primeAudio()`, and `startRest(lift.restSec)`
  - tapping ✓ again un-ticks the set
- [ ] Input changes save on `change`.
- [ ] Collapsible `<details>` sections: How to (numbered steps), Setup, Avoid, Machine taken?
- [ ] Warm-up and cool-down: the text, then each exercise as a `<details>` with its photos and steps, and a "Mark done" toggle. Cardio: photos, the setting, `minutes` and `incline/level` inputs, and a "Mark done" toggle.
- [ ] Bottom navigation: `← Prev`, `Next →`, and "Finish workout" on the last item.
- [ ] Manual check in the browser (local server): tick a set → the timer counts down; reload → the values are still there.

### Task 6: Progress, Start Here, Settings
**Files:** Create `charts.js`; modify `app.js`, `styles.css`.

**Produces:** `lineChart(points: Array<{date, value}>, {color, unit}): string`
- Returns an SVG with a 320×140 viewBox: polyline, dots, min/max y labels, first/last date labels.
- Returns a "Not enough data yet" paragraph when there are fewer than 2 points.

- [ ] Progress:
  - bodyweight form (number input + Save → `addBodyweight`) and its chart
  - for each session, one chart card per lift from `bestPerSession` (kg, or seconds when `track === "reps"`), with the main lifts first
  - history list (newest first): date, tab, sets done, volume (Σ kg×reps)
- [ ] Start Here: render `START_HERE` headings and paragraphs.
- [ ] Settings:
  - Export: Blob download `ppl-backup-YYYY-MM-DD.json` via `exportJSON`
  - Import: `<input type=file accept=application/json>` → `importJSON`, with `confirm` first; on error, show the message
  - sound and vibration toggles saved via `update`
  - Reset with `confirm`
- [ ] Manual check: export → reset → import brings the data back.

### Task 7: Offline + install + README
**Files:** Create `sw.js`, `manifest.webmanifest`, `README.md`.

- [ ] `sw.js`, with `CACHE = "ppl-v1"`:
  - install: precache the shell files (`./`, `index.html`, `styles.css`, `app.js`, `store.js`, `logic.js`, `timer.js`, `charts.js`, `data/program.js`, `manifest.webmanifest`, the icons) plus every path in `img/index.json`; `skipWaiting`
  - activate: delete old caches, `clients.claim`
  - fetch (GET, same origin): cache-first, falling back to the network, and storing successful responses
- [ ] Manifest: `name` "PPL Gym", `short_name` "PPL Gym", `start_url` "./", `scope` "./", `display` "standalone", theme and background colors, 192/512 icons (512 also `purpose: maskable`).
- [ ] Register the service worker in `app.js` when `"serviceWorker" in navigator`.
- [ ] README: run locally (`python3 -m http.server`), tests (`node --test tests/*.test.mjs`), hosting (GitHub Pages / Netlify drop / Cloudflare Pages / Vercel: static, no build, output dir = repo root), and "bump `CACHE` in `sw.js` when you change files".
- [ ] Verify: `node --test tests/*.test.mjs` passes; `curl -sI` returns 200 for `sw.js`, `manifest.webmanifest` and a photo; click through the full flow in a browser if Chrome is connected, otherwise hand over manual phone test steps.
