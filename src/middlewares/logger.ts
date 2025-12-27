import { Request, Response, NextFunction } from "express"

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.info("HTTP_REQUEST", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    ua: req.headers["user-agent"],
    origin: req.headers.origin,
    traceId: req.headers["x-trace-id"],
  })

  next()
}

export function logInfo(event: string, data: Record<string, any>) {
  console.info(
    JSON.stringify({
      level: "info",
      event,
      ...data,
      timestamp: new Date().toISOString(),
    })
  )
}

export function logError(event: string, data: Record<string, any>) {
  console.error(
    JSON.stringify({
      level: "error",
      event,
      ...data,
      timestamp: new Date().toISOString(),
    })
  )
}
