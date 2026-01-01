import { Request, Response, NextFunction } from "express"

const ALLOWED_IPS = (process.env.ADMIN_ALLOWED_IPS || "")
  .split(",")
  .map(ip => ip.trim())
  .filter(Boolean)

export function adminIpAllowlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
    if (process.env.NODE_ENV !== "production") {
        return next()
    }


  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress

  if (!ip || !ALLOWED_IPS.includes(ip)) {
    return res.status(403).json({
      ok: false,
      error: "IP not allowed",
    })
  }

  next()
}
