export function safeStorageGet(key, fallback = null) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return fallback;
    const raw = storage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

export function safeStorageSet(key, value) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return false;
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}
