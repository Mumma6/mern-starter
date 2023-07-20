import rateLimit from "express-rate-limit"
import { initializeMiddleware } from "./helpers"
import { rateLimitOptions } from "../config"

export const initializeRateLimitMiddleware = initializeMiddleware(rateLimit(rateLimitOptions))
