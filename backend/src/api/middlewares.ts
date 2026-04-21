import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/hooks/instagram/webhook",
      methods: ["POST"],
      bodyParser: { preserveRawBody: true },
    },
  ],
})
