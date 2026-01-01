import axios from "axios"

export async function verifyTurnstile(token: string, ip?: string) {
  const res = await axios.post(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET!,
      response: token,
      remoteip: ip || "",
    })
  )

  return res.data.success === true
}