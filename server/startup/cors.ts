import cors from "cors"
import { initializeMiddleware } from "./helpers"
import { corsOptions } from "../config"

export const initializeCorsMiddleware = initializeMiddleware(cors(corsOptions))
