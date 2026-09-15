# PPL Gym Web App — Design

Approved in chat on 2026-09-15. Replaces the earlier Google Sheet tracker.

## Goal
A phone-first web app for a beginner's 3-day Push / Pull / Legs program. You pick a day, walk through the full session (warm-up → 7 exercises → cardio → cool-down), see photos and instructions for every exercise, log kg and reps for each set with a rest timer, and track progress over time.

## Constraints
- Static files only: no build step, no backend. Hostable as-is on GitHub Pages, Netlify, Vercel or Cloudflare Pages.
- Works offline once loaded, and can be installed to the home screen (PWA).
- Data stays on the device (localStorage), with a JSON export/import backup.
- Plain HTML/CSS/JS using ES modules. No frameworks, no runtime dependencies.
- Hash routing (`#/push`), so no server rewrites are needed on any host.

## Content
- The program data moves unchanged from `program.py` to `data/program.js`:
  - exercises: name, photo `id`, muscles, equipment, setup, steps, mistakes, swap
  - sessions: day, focus, color, warm-up, lifts `{key, sets, reps, top, rest, restSec, track?, note?}`, cardio, cool-down
  - the "Start Here" guidance
- Photos: 66 JPGs (3.8 MB) from free-exercise-db (public domain), downloaded once by `tools/fetch_images.py` into `img/<db_id>/{0,1}.jpg` and shipped with the app.

## Screens (hash routes)
| Route | Screen |
|---|---|
| `#/` | **Home**: Push/Pull/Legs cards with weekday, focus and "last done"; the suggested next day is highlighted. Links to Progress, Guide and Settings. |
| `#/day/<tab>` | **Day**: session timeline in 4 blocks with a ✓ per completed item; "Start workout" / "Continue" button. |
| `#/day/<tab>/<itemKey>` | **Exercise**: two photos, sets×reps and rest, "Last time" line, "+ add weight" badge; one row per set (kg pre-filled from last session, reps, ✓); ticking a set starts the rest timer; collapsible How to / Avoid / Machine taken?; Prev/Next buttons. Warm-up and cool-down show a checklist; cardio shows minutes + incline/level. |
| `#/progress` | **Progress**: bodyweight entry + chart; one chart per exercise (best kg per session, or best seconds for the plank); session history list. |
| `#/guide` | **Start Here**: the guidance text. |
| `#/settings` | **Settings**: export/import backup, timer sound/vibration toggle, reset all data (with confirm). |

## Data model (localStorage key `ppl.v1`)
```js
{
  version: 1,
  sessions: [{
    id, tab: "push", date: "2026-09-15", startedAt, finishedAt|null,
    items: {
      chest_press: { sets: [{ kg: 30, reps: 12, done: true }, ...] },
      warmup:   { done: true },
      cardio:   { minutes: 20, setting: 10, done: true },
      cooldown: { done: true }
    }
  }],
  bodyweight: [{ date: "2026-09-15", kg: 78.5 }],
  settings: { sound: true, vibrate: true },
  lastExportAt: null
}
```
- **Active session:** the most recent session for that day with `finishedAt == null` and the same date. Opening a day creates it if none exists. "Finish workout" sets `finishedAt`.
- **Last time** for an exercise: its sets from the most recent *other* session of that day that has at least one done set.
- **Add-weight rule:** true when last time every set is done with `reps >= top`.
- **Beat last time:** a set's kg is greater than last session's best kg, or the same kg with more reps.
- **Backup reminder:** Home shows a banner when there is ≥1 session and `lastExportAt` is empty or more than 14 days old.
- **Import:** validates `version === 1` and the array shapes, then replaces the data after a confirm.

## Rest timer
- Starts when a set is ticked, using that exercise's `restSec`.
- Pinned bar at the bottom: remaining time, +15s, Skip. Uses the wall clock, so it survives screen lock and re-render.
- At zero: vibration (`navigator.vibrate`) and a short WebAudio beep, each if enabled in settings.

## Offline / PWA
- `manifest.webmanifest` with icons generated as PNGs by the tools script.
- `sw.js`: precache the app shell and data; cache-first for `img/`. The cache name is versioned.

## Files
```
index.html  styles.css  app.js  store.js  timer.js  logic.js  charts.js
data/program.js
img/<id>/0.jpg 1.jpg   icons/icon-192.png icon-512.png
sw.js  manifest.webmanifest
tools/fetch_images.py
tests/logic.test.mjs   (node --test)
README.md               (how to host)
```
- `logic.js` holds the pure functions: last time, add-weight rule, beat check, import validation, suggested next day.
- The Google Sheet artifacts (`build_sheet.py`, `program.py`, `out/`, `.venv/`) are removed once the content is ported.

## Testing
- `node --test tests/` covers the pure logic in `logic.js`.
- Manual run through a local static server in a phone-sized browser: full workout flow, reload keeps state, export → reset → import, offline reload.
