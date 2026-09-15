import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { EXERCISES, SESSIONS, MAIN_LIFTS, IMG_DIR } from "../data/program.js";

const root = new URL("../", import.meta.url);

test("every exercise referenced by a session exists", () => {
  const refs = new Set(MAIN_LIFTS);
  for (const s of SESSIONS) {
    s.lifts.forEach((l) => refs.add(l.key));
    [...s.warmupKeys, ...s.cooldownKeys, s.cardio.key].forEach((k) => refs.add(k));
  }
  const missing = [...refs].filter((k) => !EXERCISES[k]);
  assert.deepEqual(missing, []);
});

test("sessions are well formed", () => {
  for (const s of SESSIONS) {
    assert.match(s.color, /^#[0-9a-f]{6}$/i, `${s.id} color`);
    for (const lift of s.lifts) {
      assert.ok(lift.sets > 0 && lift.top > 0 && lift.restSec > 0, `${s.id}/${lift.key}`);
    }
  }
});

test("every exercise has both photos on disk", () => {
  const missing = Object.values(EXERCISES)
    .flatMap((ex) => [0, 1].map((n) => `${IMG_DIR}${ex.dbId}/${n}.jpg`))
    .filter((path) => !existsSync(new URL(path, root)));
  assert.deepEqual(missing, []);
});

test("every exercise has a video with a thumbnail on disk", () => {
  const problems = Object.entries(EXERCISES).flatMap(([key, ex]) => {
    if (!ex.video?.id) return [`${key}: no video`];
    const issues = [];
    if (!/^[\w-]{11}$/.test(ex.video.id)) issues.push(`${key}: odd video id ${ex.video.id}`);
    if (!ex.video.title || !ex.video.channel) issues.push(`${key}: video missing title or channel`);
    if (!existsSync(new URL(`${IMG_DIR}yt/${ex.video.id}.jpg`, root))) issues.push(`${key}: thumbnail missing`);
    return issues;
  });
  assert.deepEqual(problems, []);
});
