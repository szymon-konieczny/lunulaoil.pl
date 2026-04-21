export type TriggerPatternType = "keyword" | "regex" | "exact"

export type TriggerLike = {
  pattern_type: TriggerPatternType
  pattern: string
}

const normalize = (text: string): string => text.toLowerCase().trim()

const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const matchKeyword = (text: string, keyword: string): boolean => {
  const kw = normalize(keyword)
  if (!kw) return false
  const re = new RegExp(`(^|\\W)${escapeRegex(kw)}(\\W|$)`, "i")
  return re.test(text)
}

export const matchExact = (text: string, pattern: string): boolean =>
  normalize(text) === normalize(pattern)

export const matchRegex = (text: string, pattern: string): boolean => {
  try {
    return new RegExp(pattern, "i").test(text)
  } catch {
    return false
  }
}

export const matchAny = (text: string, trigger: TriggerLike): boolean => {
  switch (trigger.pattern_type) {
    case "keyword":
      return matchKeyword(text, trigger.pattern)
    case "regex":
      return matchRegex(text, trigger.pattern)
    case "exact":
      return matchExact(text, trigger.pattern)
    default:
      return false
  }
}
