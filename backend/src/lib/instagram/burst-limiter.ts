export type BurstLimiter = {
  consume(key: string): Promise<boolean>
}

export const createInMemoryBurstLimiter = (
  maxPerMinute: number,
  now: () => number = () => Date.now()
): BurstLimiter => {
  const windowMs = 60_000
  const buckets = new Map<string, number[]>()

  const consume = async (key: string): Promise<boolean> => {
    const ts = now()
    const cutoff = ts - windowMs
    const list = (buckets.get(key) ?? []).filter((t) => t >= cutoff)
    if (list.length >= maxPerMinute) {
      buckets.set(key, list)
      return false
    }
    list.push(ts)
    buckets.set(key, list)
    return true
  }

  return { consume }
}

type RedisLike = {
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<unknown>
}

export const createRedisBurstLimiter = (
  redis: RedisLike,
  maxPerMinute: number
): BurstLimiter => {
  const consume = async (key: string): Promise<boolean> => {
    const bucket = Math.floor(Date.now() / 60_000)
    const redisKey = `ig:burst:${key}:${bucket}`
    const count = await redis.incr(redisKey)
    if (count === 1) {
      await redis.expire(redisKey, 120)
    }
    return count <= maxPerMinute
  }
  return { consume }
}

let singleton: BurstLimiter | null = null

export const getDefaultBurstLimiter = (): BurstLimiter => {
  if (!singleton) {
    const max = Number.parseInt(
      process.env.IG_BURST_PER_MINUTE ?? "30",
      10
    )
    singleton = createInMemoryBurstLimiter(
      Number.isFinite(max) && max > 0 ? max : 30
    )
  }
  return singleton
}

export const __resetBurstLimiterForTests = (): void => {
  singleton = null
}
