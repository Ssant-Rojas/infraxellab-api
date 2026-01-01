import { Request, Response, NextFunction } from "express"

export function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // ✅ BYPASS PARA PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }

  const key = req.headers["x-admin-key"]

  if (!key || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ ok: false })
  }

  next()
}
