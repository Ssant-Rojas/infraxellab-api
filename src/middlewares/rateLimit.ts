import rateLimit from "express-rate-limit"

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                 // 20 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
})
