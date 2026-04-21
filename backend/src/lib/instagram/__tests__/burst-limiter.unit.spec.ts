import {
  createInMemoryBurstLimiter,
  createRedisBurstLimiter,
} from "../burst-limiter"

describe("createInMemoryBurstLimiter", () => {
  it("allows up to maxPerMinute then rejects", async () => {
    let t = 1_000_000
    const limiter = createInMemoryBurstLimiter(3, () => t)
    expect(await limiter.consume("k")).toBe(true)
    expect(await limiter.consume("k")).toBe(true)
    expect(await limiter.consume("k")).toBe(true)
    expect(await limiter.consume("k")).toBe(false)
  })

  it("resets after the minute window passes", async () => {
    let t = 1_000_000
    const limiter = createInMemoryBurstLimiter(2, () => t)
    expect(await limiter.consume("k")).toBe(true)
    expect(await limiter.consume("k")).toBe(true)
    expect(await limiter.consume("k")).toBe(false)
    t += 60_001
    expect(await limiter.consume("k")).toBe(true)
  })

  it("tracks keys independently", async () => {
    const limiter = createInMemoryBurstLimiter(1)
    expect(await limiter.consume("a")).toBe(true)
    expect(await limiter.consume("a")).toBe(false)
    expect(await limiter.consume("b")).toBe(true)
  })
})

describe("createRedisBurstLimiter", () => {
  it("allows up to maxPerMinute then rejects", async () => {
    const store = new Map<string, number>()
    const redis = {
      incr: async (key: string) => {
        const v = (store.get(key) ?? 0) + 1
        store.set(key, v)
        return v
      },
      expire: async () => 1,
    }
    const limiter = createRedisBurstLimiter(redis, 2)
    expect(await limiter.consume("k")).toBe(true)
    expect(await limiter.consume("k")).toBe(true)
    expect(await limiter.consume("k")).toBe(false)
  })

  it("sets TTL only on first increment of a bucket", async () => {
    const store = new Map<string, number>()
    let expireCalls = 0
    const redis = {
      incr: async (key: string) => {
        const v = (store.get(key) ?? 0) + 1
        store.set(key, v)
        return v
      },
      expire: async () => {
        expireCalls++
        return 1
      },
    }
    const limiter = createRedisBurstLimiter(redis, 5)
    await limiter.consume("k")
    await limiter.consume("k")
    await limiter.consume("k")
    expect(expireCalls).toBe(1)
  })
})
