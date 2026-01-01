import { Request, Response, NextFunction } from "express"

export function adminIpAllowlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // ✅ BYPASS PARA PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }

  const allowed = process.env.ADMIN_ALLOWED_IPS
    ?.split(",")
    .map(ip => ip.trim())

  if (!allowed || allowed.length === 0) {
    return res.status(500).json({
      ok: false,
      error: "IP allowlist not configured",
    })
  }

  const forwardedFor = req.headers["x-forwarded-for"]
  const clientIp =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : req.ip

  if (!clientIp) {
    return res.status(403).json({
      ok: false,
      error: "Cannot determine IP",
    })
  }

  if (!allowed.includes(clientIp)) {
    return res.status(403).json({
      ok: false,
      error: "IP not allowed",
      ip: clientIp,
    })
  }

  next()
}
