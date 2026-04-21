import InstagramBotService from "./service"
import { Module } from "@medusajs/framework/utils"

export const INSTAGRAM_BOT_MODULE = "instagram_bot"

export default Module(INSTAGRAM_BOT_MODULE, {
  service: InstagramBotService,
})
