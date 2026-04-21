import {
  matchKeyword,
  matchExact,
  matchRegex,
  matchAny,
} from "../matchers"

describe("matchKeyword", () => {
  it("matches a bare keyword case-insensitively", () => {
    expect(matchKeyword("I want INFO please", "info")).toBe(true)
  })

  it("respects word boundaries", () => {
    expect(matchKeyword("information is cool", "info")).toBe(false)
  })

  it("matches a keyword at the start", () => {
    expect(matchKeyword("link please", "link")).toBe(true)
  })

  it("matches a keyword at the end", () => {
    expect(matchKeyword("send me info", "info")).toBe(true)
  })

  it("matches a keyword surrounded by punctuation", () => {
    expect(matchKeyword("send me: info!", "info")).toBe(true)
  })

  it("returns false for empty keyword", () => {
    expect(matchKeyword("anything", "")).toBe(false)
  })

  it("escapes regex specials in the keyword", () => {
    expect(matchKeyword("price is $9.99 today", "$9.99")).toBe(true)
  })
})

describe("matchExact", () => {
  it("is case-insensitive and trims whitespace", () => {
    expect(matchExact("  LINK  ", "link")).toBe(true)
  })

  it("does not match substrings", () => {
    expect(matchExact("link please", "link")).toBe(false)
  })

  it("matches identical values", () => {
    expect(matchExact("hello", "hello")).toBe(true)
  })
})

describe("matchRegex", () => {
  it("matches a valid pattern", () => {
    expect(matchRegex("order-123", "^order-\\d+$")).toBe(true)
  })

  it("returns false for an invalid regex without throwing", () => {
    expect(matchRegex("anything", "[unclosed")).toBe(false)
  })

  it("is case-insensitive by default", () => {
    expect(matchRegex("INFO", "info")).toBe(true)
  })
})

describe("matchAny", () => {
  it("dispatches on pattern_type=keyword", () => {
    expect(
      matchAny("I want info", { pattern_type: "keyword", pattern: "info" })
    ).toBe(true)
  })

  it("dispatches on pattern_type=regex", () => {
    expect(
      matchAny("order-1", { pattern_type: "regex", pattern: "^order-\\d+$" })
    ).toBe(true)
  })

  it("dispatches on pattern_type=exact", () => {
    expect(
      matchAny("yes", { pattern_type: "exact", pattern: "yes" })
    ).toBe(true)
    expect(
      matchAny("yes please", { pattern_type: "exact", pattern: "yes" })
    ).toBe(false)
  })
})
