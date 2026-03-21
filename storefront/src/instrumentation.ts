// Next.js instrumentation hook - runs before any other code
// Fix Node.js 22 broken localStorage (--experimental-webstorage provides object without working getItem/setItem)
export async function register() {
  if (typeof window === "undefined" && typeof globalThis.localStorage !== "undefined") {
    const broken = typeof globalThis.localStorage.getItem !== "function"
    if (broken) {
      const storage = new Map<string, string>()
      const polyfill = {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => { storage.set(key, value) },
        removeItem: (key: string) => { storage.delete(key) },
        clear: () => { storage.clear() },
        get length() { return storage.size },
        key: (index: number) => [...storage.keys()][index] ?? null,
      }
      ;(globalThis as any).localStorage = polyfill
      ;(globalThis as any).sessionStorage = polyfill
    }
  }
}
