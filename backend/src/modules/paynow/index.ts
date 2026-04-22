import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import PaynowProviderService from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [PaynowProviderService],
})
