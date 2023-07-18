import rateLimit from "express-rate-limit"
import { initializeMiddleware } from "./helpers"

export const initializeRateLimitMiddleware = initializeMiddleware(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  })
)
