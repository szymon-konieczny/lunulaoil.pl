import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Logowanie",
  description: "Zaloguj się do swojego konta Lunula Botanique.",
}

export default function Login() {
  return <LoginTemplate />
}
