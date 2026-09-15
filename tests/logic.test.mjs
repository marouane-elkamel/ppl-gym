import { test } from "node:test";
import assert from "node:assert/strict";
import {
  todayISO,
  sessionItems,
  isItemDone,
  lastTime,
  shouldAddWeight,
  beatsLast,
  suggestNextTab,
  needsBackupReminder,
  validateBackup,
  bestPerSession,
} from "../logic.js";

const lift = { key: "chest_press", sets: 3, reps: "8-12", top: 12, rest: "2 min", restSec: 120 };
const set = (kg, reps, done = true) => ({ kg, reps, done });
const session = (over) => ({
  id: "s", tab: "push", date: "2026-09-01", startedAt: 1, finishedAt: 2, items: {}, ...over,
});
const data = (sessions = [], extra = {}) => ({
  version: 1, sessions, bodyweight: [], settings: { sound: true, vibrate: true }, lastExportAt: null, ...extra,
});

test("todayISO formats the local date with padding", () => {
  assert.equal(todayISO(new Date(2026, 0, 5, 23, 59)), "2026-01-05");
});

test("sessionItems orders warm-up, lifts, cardio, cool-down", () => {
  const items = sessionItems({ lifts: [lift] });
  assert.deepEqual(items.map((i) => i.kind), ["warmup", "lift", "cardio", "cooldown"]);
  assert.equal(items[1].key, "chest_press");
  assert.equal(items[1].lift, lift);
});

test("isItemDone needs every set ticked for lifts, a done flag otherwise", () => {
  const item = { key: "chest_press", kind: "lift", lift };
  assert.equal(isItemDone(undefined, item), false);
  assert.equal(isItemDone({ sets: [set(30, 12), set(30, 11), set(30, null, false)] }, item), false);
  assert.equal(isItemDone({ sets: [set(30, 12), set(30, 11), set(30, 10)] }, item), true);
  assert.equal(isItemDone({ done: true }, { key: "cardio", kind: "cardio" }), true);
  assert.equal(isItemDone({ done: false }, { key: "cardio", kind: "cardio" }), false);
});

test("lastTime returns done sets from the newest other session of that tab", () => {
  const d = data([
    session({ id: "old", startedAt: 1, items: { chest_press: { sets: [set(25, 12)] } } }),
    session({ id: "new", startedAt: 2, items: { chest_press: { sets: [set(30, 10), set(30, 9, false)] } } }),
    session({ id: "empty", startedAt: 3, items: { chest_press: { sets: [set(35, null, false)] } } }),
    session({ id: "pull", tab: "pull", startedAt: 4, items: { chest_press: { sets: [set(99, 1)] } } }),
    session({ id: "current", startedAt: 5, items: { chest_press: { sets: [set(40, 8)] } } }),
  ]);
  assert.deepEqual(lastTime(d, "push", "chest_press", "current"), [set(30, 10)]);
  assert.equal(lastTime(d, "legs", "chest_press", "current"), null);
});

test("shouldAddWeight only when every set hit the top of the range", () => {
  assert.equal(shouldAddWeight(null, lift), false);
  assert.equal(shouldAddWeight([set(30, 12), set(30, 12), set(30, 12)], lift), true);
  assert.equal(shouldAddWeight([set(30, 12), set(30, 12), set(30, 11)], lift), false);
  assert.equal(shouldAddWeight([set(30, 12), set(30, 12)], lift), false);
});

test("beatsLast by heavier kg, or more reps at last time's best kg", () => {
  const last = [set(30, 10), set(30, 9), set(27.5, 12)];
  assert.equal(beatsLast(set(32.5, 6), last), true);
  assert.equal(beatsLast(set(30, 11), last), true);
  assert.equal(beatsLast(set(30, 10), last), false);
  assert.equal(beatsLast(set(27.5, 13), last), false);
  assert.equal(beatsLast(set(32.5, 6, false), last), false);
  assert.equal(beatsLast(set(32.5, 6), null), false);
  assert.equal(beatsLast(set(null, 50), [set(null, 45)], "reps"), true);
  assert.equal(beatsLast(set(null, 45), [set(null, 45)], "reps"), false);
});

test("suggestNextTab continues today's open session, else the day after the latest", () => {
  const order = ["push", "pull", "legs"];
  const today = "2026-09-15";
  assert.equal(suggestNextTab(data(), order, today), "push");
  assert.equal(
    suggestNextTab(data([session({ tab: "pull", date: today, finishedAt: null, startedAt: 9 })]), order, today),
    "pull",
  );
  assert.equal(
    suggestNextTab(data([session({ tab: "push", startedAt: 1 }), session({ tab: "legs", startedAt: 2 })]), order, today),
    "push",
  );
  assert.equal(
    suggestNextTab(data([session({ tab: "pull", date: "2026-09-10", finishedAt: null, startedAt: 3 })]), order, today),
    "legs",
  );
});

test("needsBackupReminder after 14 days without export, once there is data", () => {
  const day = 864e5;
  const now = 100 * day;
  assert.equal(needsBackupReminder(data(), now), false);
  assert.equal(needsBackupReminder(data([session()]), now), true);
  assert.equal(needsBackupReminder(data([session()], { lastExportAt: now - 15 * day }), now), true);
  assert.equal(needsBackupReminder(data([session()], { lastExportAt: now - day }), now), false);
});

test("validateBackup rejects bad shapes and accepts app data", () => {
  assert.equal(validateBackup(null).ok, false);
  assert.match(validateBackup({ version: 2, sessions: [], bodyweight: [] }).error, /version/);
  assert.equal(validateBackup({ version: 1, bodyweight: [] }).ok, false);
  assert.equal(validateBackup({ version: 1, sessions: [{ id: 1 }], bodyweight: [] }).ok, false);
  assert.equal(validateBackup({ version: 1, sessions: [], bodyweight: [{ date: "2026-09-01", kg: "80" }] }).ok, false);
  assert.deepEqual(validateBackup(data([session()], { bodyweight: [{ date: "2026-09-01", kg: 80 }] })), { ok: true });
});

test("bestPerSession gives the best done set per session, oldest first", () => {
  const d = data([
    session({ id: "b", date: "2026-09-08", startedAt: 2, items: { chest_press: { sets: [set(30, 10), set(32.5, 8), set(35, null, false)] } } }),
    session({ id: "a", date: "2026-09-01", startedAt: 1, items: { chest_press: { sets: [set(27.5, 12)] } } }),
    session({ id: "c", date: "2026-09-15", startedAt: 3, items: { chest_press: { sets: [set(40, null, false)] } } }),
    session({ id: "p", date: "2026-09-15", startedAt: 4, items: { plank: { sets: [set(null, 40), set(null, 45)] } } }),
  ]);
  assert.deepEqual(bestPerSession(d, "push", "chest_press"), [
    { date: "2026-09-01", value: 27.5 },
    { date: "2026-09-08", value: 32.5 },
  ]);
  assert.deepEqual(bestPerSession(d, "push", "plank", "reps"), [{ date: "2026-09-15", value: 45 }]);
});

test("hasActivity, sessionVolume, lastDoneEntry and shortDate", async () => {
  const { hasActivity, sessionVolume, lastDoneEntry, shortDate } = await import("../logic.js");
  const opened = session({ items: { chest_press: { sets: [set(30, null, false)] } } });
  const worked = session({
    id: "w",
    startedAt: 5,
    items: {
      chest_press: { sets: [set(30, 10), set(30, 8), set(35, 5, false)] },
      plank: { sets: [set(null, 40)] },
      cardio: { minutes: 20, setting: 10, done: true },
    },
  });
  assert.equal(hasActivity(opened), false);
  assert.equal(hasActivity(worked), true);
  assert.equal(sessionVolume(worked), 540);
  assert.deepEqual(lastDoneEntry(data([opened, worked]), "push", "cardio", "other"), { minutes: 20, setting: 10, done: true });
  assert.equal(lastDoneEntry(data([opened, worked]), "push", "cardio", "w"), null);
  assert.equal(shortDate("2026-09-05"), "5 Sep");
});
