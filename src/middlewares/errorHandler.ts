import { Request, Response, NextFunction } from "express"

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("UNHANDLED_ERROR", err)

  res.status(500).json({
    ok: false,
    message: "Internal server error",
  })
}
