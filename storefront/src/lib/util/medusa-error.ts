export default function medusaError(error: any): never {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    try {
      const u = new URL(error.config?.url, error.config?.baseURL)
      console.error("Resource:", u.toString())
    } catch {
      console.error("Resource: unknown")
    }
    console.error("Response data:", error.response.data)
    console.error("Status code:", error.response.status)

    // Extracting the error message from the response data
    const rawMessage = error.response?.data?.message || error.response?.data
    const message =
      typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage)

    throw new Error(message.charAt(0).toUpperCase() + message.slice(1) + ".")
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("No response received: " + error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error("Error setting up the request: " + (error.message || error))
  }
}
