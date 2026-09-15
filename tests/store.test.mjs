import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore, emptyData } from "../store.js";

function fakeStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
  };
}

test("starts empty and persists updates across reloads", () => {
  const storage = fakeStorage();
  const store = createStore(storage);
  assert.deepEqual(store.data, emptyData());
  store.update((d) => { d.settings.sound = false; });
  assert.equal(createStore(storage).data.settings.sound, false);
});

test("corrupt or invalid storage falls back to empty data", () => {
  assert.deepEqual(createStore(fakeStorage({ "ppl.v1": "{nope" })).data, emptyData());
  assert.deepEqual(createStore(fakeStorage({ "ppl.v1": '{"version":9}' })).data, emptyData());
});

test("storage that throws does not break the store", () => {
  const broken = {
    getItem() { throw new Error("denied"); },
    setItem() { throw new Error("denied"); },
  };
  const store = createStore(broken);
  store.update((d) => d.bodyweight.push({ date: "2026-09-15", kg: 80 }));
  assert.equal(store.data.bodyweight.length, 1);
});

test("ensureSession reuses today's open session; finishSession closes it", () => {
  const store = createStore(fakeStorage());
  const now = new Date(2026, 8, 15, 18, 0);
  const s1 = store.ensureSession("push", now);
  const s2 = store.ensureSession("push", now);
  assert.equal(s1.id, s2.id);
  assert.equal(s1.date, "2026-09-15");
  assert.equal(store.activeSession("push", "2026-09-15").id, s1.id);
  store.finishSession(s1.id, 123);
  assert.equal(store.activeSession("push", "2026-09-15"), null);
  assert.notEqual(store.ensureSession("push", now).id, s1.id);
});

test("addBodyweight replaces the entry for the same date and keeps dates sorted", () => {
  const store = createStore(fakeStorage());
  store.addBodyweight(80, "2026-09-15");
  store.addBodyweight(81, "2026-09-01");
  store.addBodyweight(79.5, "2026-09-15");
  assert.deepEqual(store.data.bodyweight, [
    { date: "2026-09-01", kg: 81 },
    { date: "2026-09-15", kg: 79.5 },
  ]);
});

test("exportJSON stamps lastExportAt; importJSON validates then replaces", () => {
  const storage = fakeStorage();
  const store = createStore(storage);
  store.addBodyweight(80, "2026-09-15");
  const json = store.exportJSON(555);
  assert.equal(store.data.lastExportAt, 555);
  store.reset();
  assert.deepEqual(store.data, emptyData());
  assert.throws(() => store.importJSON('{"version":2}'), /version/);
  assert.throws(() => store.importJSON("not json"));
  store.importJSON(json);
  assert.equal(store.data.bodyweight[0].kg, 80);
  assert.equal(createStore(storage).data.bodyweight[0].kg, 80);
});
