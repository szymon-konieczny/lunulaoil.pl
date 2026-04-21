import { buildProductUrl, getStorefrontBaseUrl } from "../storefront-url"

describe("storefront-url", () => {
  const originalEnv = process.env.STOREFRONT_URL

  afterEach(() => {
    process.env.STOREFRONT_URL = originalEnv
  })

  describe("getStorefrontBaseUrl", () => {
    it("falls back to the default when env is unset", () => {
      delete process.env.STOREFRONT_URL
      expect(getStorefrontBaseUrl()).toBe("https://lunulaoil.pl")
    })

    it("strips a trailing slash from the env value", () => {
      process.env.STOREFRONT_URL = "https://example.com/"
      expect(getStorefrontBaseUrl()).toBe("https://example.com")
    })

    it("strips multiple trailing slashes", () => {
      process.env.STOREFRONT_URL = "https://example.com///"
      expect(getStorefrontBaseUrl()).toBe("https://example.com")
    })
  })

  describe("buildProductUrl", () => {
    beforeEach(() => {
      process.env.STOREFRONT_URL = "https://shop.test"
    })

    it("defaults the country code to pl", () => {
      expect(buildProductUrl("olej-lnianany")).toBe(
        "https://shop.test/pl/products/olej-lnianany"
      )
    })

    it("uses the provided country code, lowercased", () => {
      expect(buildProductUrl("olej-lnianany", "EN")).toBe(
        "https://shop.test/en/products/olej-lnianany"
      )
    })

    it("treats null country code as default", () => {
      expect(buildProductUrl("olej-lnianany", null)).toBe(
        "https://shop.test/pl/products/olej-lnianany"
      )
    })

    it("trims a handle with a leading slash", () => {
      expect(buildProductUrl("/olej-lnianany")).toBe(
        "https://shop.test/pl/products/olej-lnianany"
      )
    })

    it("trims whitespace in handle and country code", () => {
      expect(buildProductUrl("  olej-lnianany  ", "  pl  ")).toBe(
        "https://shop.test/pl/products/olej-lnianany"
      )
    })
  })
})
