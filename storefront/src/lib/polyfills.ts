// Fix Node.js 22 broken localStorage
// Node 22 with --experimental-webstorage provides a localStorage object without working getItem/setItem methods.
// Medusa JS SDK relies on localStorage.getItem/setItem, causing crashes on SSR.
// Also fixes Turbopack SSR sandbox where window exists but localStorage is broken.
function fixBrokenLocalStorage() {
  const targets = [globalThis, typeof window !== "undefined" ? window : null].filter(Boolean) as any[]
  for (const target of targets) {
    if (target.localStorage && typeof target.localStorage.getItem !== "function") {
      const storage = new Map<string, string>()
      const polyfill = {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => { storage.set(key, value) },
        removeItem: (key: string) => { storage.delete(key) },
        clear: () => { storage.clear() },
        get length() { return storage.size },
        key: (index: number) => [...storage.keys()][index] ?? null,
      }
      target.localStorage = polyfill
      if (!target.sessionStorage || typeof target.sessionStorage.getItem !== "function") {
        target.sessionStorage = polyfill
      }
    }
  }
}
fixBrokenLocalStorage()
