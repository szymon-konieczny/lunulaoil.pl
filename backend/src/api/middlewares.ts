import { authenticate, defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/hooks/instagram/webhook",
      methods: ["POST"],
      bodyParser: { preserveRawBody: true },
    },
    {
      // Populate `auth_context` so the route can read the customer id, but let
      // guests through (they simply resolve to isB2B: false).
      matcher: "/store/customer-group",
      methods: ["GET"],
      middlewares: [
        authenticate("customer", ["session", "bearer"], {
          allowUnauthenticated: true,
        }),
      ],
    },
  ],
})
