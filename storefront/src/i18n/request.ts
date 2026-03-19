import { getRequestConfig } from "next-intl/server"
import { DEFAULT_LOCALE } from "./config"

import common from "../messages/pl/common.json"
import home from "../messages/pl/home.json"
import quiz from "../messages/pl/quiz.json"
import layout from "../messages/pl/layout.json"
import account from "../messages/pl/account.json"
import checkout from "../messages/pl/checkout.json"
import cart from "../messages/pl/cart.json"
import products from "../messages/pl/products.json"
import pages from "../messages/pl/pages.json"

export default getRequestConfig(async () => {
  return {
    locale: DEFAULT_LOCALE,
    messages: {
      common,
      home,
      quiz,
      layout,
      account,
      checkout,
      cart,
      products,
      pages,
    },
  }
})
