import { verifyTurnstile } from "../services/turnstile.service"
import { Request, Response, NextFunction } from "express"

export async function turnstile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.body?.cf_turnstile_response

  if (!token) {
    return res.status(400).json({
      ok: false,
      error: "Captcha requerido",
    })
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: req.ip,
        }),
      }
    )

    const result = await response.json()

    if (!result.success) {
      return res.status(403).json({
        ok: false,
        error: "Captcha inválido",
      })
    }

    next()
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Error validando captcha",
    })
  }
}
