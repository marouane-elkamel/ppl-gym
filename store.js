// Saved data: sessions, bodyweight, settings and backups, persisted to localStorage.
import { todayISO, validateBackup } from "./logic.js";

const KEY = "ppl.v1";

export function emptyData() {
  return { version: 1, sessions: [], bodyweight: [], settings: { sound: true, vibrate: true }, lastExportAt: null };
}

function normalize(obj) {
  const base = emptyData();
  return { ...base, ...obj, settings: { ...base.settings, ...(obj.settings ?? {}) } };
}

/** `storage` is anything with getItem/setItem (window.localStorage in the app, a fake in tests). */
export function createStore(storage) {
  let data = read();

  function read() {
    try {
      const obj = JSON.parse(storage.getItem(KEY));
      if (validateBackup(obj).ok) return normalize(obj);
    } catch {
      // Unreadable or blocked storage: start with empty data.
    }
    return emptyData();
  }

  function save() {
    try {
      storage.setItem(KEY, JSON.stringify(data));
    } catch {
      // Private mode or full storage: keep working in memory.
    }
  }

  function activeSession(tabId, date = todayISO()) {
    return data.sessions.find((s) => s.tab === tabId && s.date === date && !s.finishedAt) ?? null;
  }

  return {
    get data() {
      return data;
    },

    update(fn) {
      fn(data);
      save();
    },

    activeSession,

    ensureSession(tabId, now = new Date()) {
      const existing = activeSession(tabId, todayISO(now));
      if (existing) return existing;
      const session = {
        id: `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        tab: tabId,
        date: todayISO(now),
        startedAt: now.getTime(),
        finishedAt: null,
        items: {},
      };
      data.sessions.push(session);
      save();
      return session;
    },

    finishSession(id, nowMs = Date.now()) {
      const session = data.sessions.find((s) => s.id === id);
      if (!session) return;
      session.finishedAt = nowMs;
      save();
    },

    addBodyweight(kg, date = todayISO()) {
      data.bodyweight = data.bodyweight
        .filter((b) => b.date !== date)
        .concat({ date, kg })
        .sort((a, b) => a.date.localeCompare(b.date));
      save();
    },

    exportJSON(nowMs = Date.now()) {
      data.lastExportAt = nowMs;
      save();
      return JSON.stringify(data, null, 2);
    },

    importJSON(text) {
      const obj = JSON.parse(text);
      const result = validateBackup(obj);
      if (!result.ok) throw new Error(result.error);
      data = normalize(obj);
      save();
    },

    reset() {
      data = emptyData();
      save();
    },
  };
}
