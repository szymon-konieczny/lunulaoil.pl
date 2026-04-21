import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/hooks/instagram",
      method: ["POST"],
      bodyParser: { preserveRawBody: true },
    },
  ],
})
