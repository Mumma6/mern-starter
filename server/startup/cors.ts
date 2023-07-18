import cors from "cors"
import { initializeMiddleware } from "./helpers"

export const initializeCorsMiddleware = initializeMiddleware(
  cors({
    origin: [`https://${process.env.HOST}`, `http://${process.env.HOST}`, `${process.env.HOST}`],
    methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
    credentials: true, // enable set cookie
  })
)
