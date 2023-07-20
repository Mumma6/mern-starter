import session from "express-session"
import { initializeMiddleware } from "./helpers"
import { sessionOptions } from "../config"

export const initializeSessionMiddleware = initializeMiddleware(session(sessionOptions))
