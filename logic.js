// Pure rules for the PPL Gym app: no DOM, no storage.

const DAY_MS = 864e5;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const newestFirst = (a, b) => b.startedAt - a.startedAt;
const doneSets = (session, key) => (session.items?.[key]?.sets ?? []).filter((s) => s.done);

export function todayISO(now = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function shortDate(iso) {
  const [, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]}`;
}

/** The session in the order it is done: warm-up, each lift, cardio, cool-down. */
export function sessionItems(session) {
  return [
    { key: "warmup", kind: "warmup" },
    ...session.lifts.map((lift) => ({ key: lift.key, kind: "lift", lift })),
    { key: "cardio", kind: "cardio" },
    { key: "cooldown", kind: "cooldown" },
  ];
}

export function isItemDone(entry, item) {
  if (!entry) return false;
  if (item.kind === "lift") {
    return Array.isArray(entry.sets) && entry.sets.length >= item.lift.sets && entry.sets.every((s) => s.done);
  }
  return entry.done === true;
}

export function hasActivity(session) {
  return Object.values(session.items ?? {}).some((e) => e?.done || e?.sets?.some((s) => s.done));
}

/** Done sets of `key` from the newest other session of this day that has any. */
export function lastTime(data, tabId, key, excludeSessionId) {
  const past = data.sessions.filter((s) => s.tab === tabId && s.id !== excludeSessionId).sort(newestFirst);
  for (const session of past) {
    const sets = doneSets(session, key);
    if (sets.length) return sets;
  }
  return null;
}

/** The newest other session's entry for a non-lift item (e.g. cardio) that was marked done. */
export function lastDoneEntry(data, tabId, key, excludeSessionId) {
  const past = data.sessions
    .filter((s) => s.tab === tabId && s.id !== excludeSessionId && s.items?.[key]?.done)
    .sort(newestFirst);
  return past[0]?.items[key] ?? null;
}

/** Double progression: every set last time reached the top of the rep range. */
export function shouldAddWeight(lastSets, lift) {
  return !!lastSets && lastSets.length >= lift.sets && lastSets.every((s) => Number(s.reps) >= lift.top);
}

export function beatsLast(set, lastSets, track) {
  if (!set.done || !lastSets?.length) return false;
  const bestReps = (sets) => Math.max(...sets.map((s) => Number(s.reps) || 0));
  if (track === "reps") return Number(set.reps) > bestReps(lastSets);

  const kgOf = (s) => Number(s.kg) || 0;
  const bestKg = Math.max(...lastSets.map(kgOf));
  if (kgOf(set) !== bestKg) return kgOf(set) > bestKg;
  return Number(set.reps) > bestReps(lastSets.filter((s) => kgOf(s) === bestKg));
}

export function suggestNextTab(data, order, today) {
  const latest = [...data.sessions].sort(newestFirst)[0];
  if (!latest) return order[0];
  if (!latest.finishedAt && latest.date === today) return latest.tab;
  return order[(order.indexOf(latest.tab) + 1) % order.length];
}

export function needsBackupReminder(data, nowMs) {
  if (!data.sessions.length) return false;
  return !data.lastExportAt || nowMs - data.lastExportAt > 14 * DAY_MS;
}

export function validateBackup(obj) {
  const fail = (error) => ({ ok: false, error });
  if (!obj || typeof obj !== "object") return fail("Not a PPL Gym backup file");
  if (obj.version !== 1) return fail("Unsupported backup version");
  if (!Array.isArray(obj.sessions) || !Array.isArray(obj.bodyweight)) {
    return fail("Backup is missing sessions or bodyweight");
  }
  const badSession = obj.sessions.some(
    (s) => !s || typeof s.id !== "string" || typeof s.tab !== "string" || typeof s.date !== "string"
      || !s.items || typeof s.items !== "object",
  );
  if (badSession) return fail("Backup contains an invalid session");
  if (obj.bodyweight.some((b) => !b || typeof b.date !== "string" || typeof b.kg !== "number")) {
    return fail("Backup contains an invalid bodyweight entry");
  }
  return { ok: true };
}

/** Best kg (or reps/seconds when track === "reps") per session for one exercise, oldest first. */
export function bestPerSession(data, tabId, key, track) {
  const field = track === "reps" ? "reps" : "kg";
  return data.sessions
    .filter((s) => s.tab === tabId)
    .sort((a, b) => a.startedAt - b.startedAt)
    .map((s) => ({ date: s.date, values: doneSets(s, key).map((x) => Number(x[field])).filter((v) => v > 0) }))
    .filter((p) => p.values.length)
    .map((p) => ({ date: p.date, value: Math.max(...p.values) }));
}

/** Total kg × reps over all done sets in a session. */
export function sessionVolume(session) {
  return Object.values(session.items ?? {})
    .flatMap((e) => e?.sets ?? [])
    .filter((s) => s.done)
    .reduce((sum, s) => sum + (Number(s.kg) || 0) * (Number(s.reps) || 0), 0);
}
