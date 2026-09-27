// Central place for every LocalStorage key used in the app.
export const STORAGE_KEYS = {
  CLIENTS: "df_clients",
  PROJECTS: "df_projects",
  SERVICES: "df_services",
  TASKS: "df_tasks",
  QUOTES: "df_quotes",
  INVOICES: "df_invoices",
  REVISIONS: "df_revisions",
  NOTIFICATIONS: "df_notifications",
  SETTINGS: "df_settings",
  SEEDED: "df_seeded_v1",
};

/**
 * Read an array/object from LocalStorage. Returns `fallback` if the key
 * doesn't exist yet or the stored JSON is corrupted, so the app never
 * crashes because of empty or bad storage.
 */
export function getData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] failed to read "${key}", using fallback`, err);
    return fallback;
  }
}

/** Overwrite the value stored at `key` with `value`. */
export function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] failed to save "${key}"`, err);
    return false;
  }
}

/**
 * Update a single record inside an array stored at `key`, matched by id.
 * If no record with that id exists, nothing changes.
 */
export function updateData(key, id, updates) {
  const list = getData(key, []);
  const next = list.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  saveData(key, next);
  return next;
}

/** Remove a single record (matched by id) from the array stored at `key`. */
export function deleteData(key, id) {
  const list = getData(key, []);
  const next = list.filter((item) => item.id !== id);
  saveData(key, next);
  return next;
}

/** Append one new record to the array stored at `key` and return the new list. */
export function addData(key, record) {
  const list = getData(key, []);
  const next = [...list, record];
  saveData(key, next);
  return next;
}

/** Find a single record by id inside the array stored at `key`. */
export function findById(key, id) {
  return getData(key, []).find((item) => item.id === id) || null;
}

/** Small helper for generating readable unique ids without extra dependencies. */
export function makeId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
