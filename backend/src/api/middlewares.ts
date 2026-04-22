import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/hooks/paynow",
      methods: ["POST"],
      bodyParser: { preserveRawBody: true },
    },
  ],
})
