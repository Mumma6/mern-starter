import express from "express"
import { pipe, flow } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import mongoSanitize from "express-mongo-sanitize"

import { initializeMiddleware } from "./startup/helpers"

import { initializeDatabase } from "./startup/db"
import { initializeCorsMiddleware } from "./startup/cors"
import { initializeRateLimitMiddleware } from "./startup/rate-limiter"
import { initializeLogger } from "./startup/logger"
import { initializeProdMiddlewares } from "./startup/production"
import { initializeRoutes } from "./api/routes/routes"
import { initializePassport } from "./startup/passport"
import passport from "passport"
import { initializeSessionMiddleware } from "./startup/session"

const port = process.env.PORT || 5000
const app = express()

const initializeAppMiddlewares = pipe(
  TE.right(app),
  TE.chain(initializeMiddleware(express.json())),
  TE.chain(initializeMiddleware(express.urlencoded({ extended: false }))),
  TE.chain(initializeCorsMiddleware),
  TE.chain(initializeRateLimitMiddleware),
  TE.chain(initializeMiddleware(mongoSanitize())),
  TE.chain(initializeProdMiddlewares),
  TE.chain(initializeSessionMiddleware),
  TE.chain(initializeMiddleware(passport.initialize())),
  TE.chain(initializeMiddleware(passport.session()))
)

// Create the pipeline for setting up services. Things that dont need the Express App.
const setupServices = flow(initializeDatabase(), initializeLogger(), initializePassport())

const runApp = pipe(
  setupServices,
  TE.chain(() => initializeAppMiddlewares),
  TE.chain(initializeRoutes)
)

pipe(
  runApp,
  TE.fold(
    (error) => {
      console.error("Error starting app: ", error)
      return TE.left(error) // Return the original error
    },
    (app) => {
      return TE.right(
        app.listen(port, () => {
          console.log(`Listening on port ${port}...`)
        })
      )
    }
  )
)()

export { app }
