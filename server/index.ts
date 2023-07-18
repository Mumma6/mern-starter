import express, { Express } from "express"
import { pipe, flow } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import mongoSanitize from "express-mongo-sanitize"

import { initializeMiddleware } from "./startup/helpers"

import { initializeDatabase } from "./startup/db"
import { initializeCorsMiddleware } from "./startup/cors"
import { initializeRateLimitMiddleware } from "./startup/rate-limiter"
import { initializeLogger } from "./startup/logger"
import { initializeProdMiddlewares } from "./startup/production"

const port = process.env.PORT || 5000
const app = express()

/*
app.use(passport.initialize())
app.use(passport.session())
*/

// next step, routes
const initializeAppMiddlewares = pipe(
  TE.right(app),
  TE.chain(initializeMiddleware(express.json())),
  TE.chain(initializeMiddleware(express.urlencoded({ extended: false }))),
  TE.chain(initializeCorsMiddleware),
  TE.chain(initializeRateLimitMiddleware),
  TE.chain(initializeMiddleware(mongoSanitize())),
  TE.chain(initializeProdMiddlewares)
)

// Create the pipeline for setting up services. Things that dont need the Express App.
const setupServices = flow(
  initializeDatabase(),
  initializeLogger()
  //TE.chain(initializePassport)
  // Add more service initializeializations here...
  // ...
)

// Define your routes
// TODO. Work on this
const initRoutes = (app: Express): TE.TaskEither<Error, Express> =>
  TE.tryCatch(
    async () => {
      app.get("/", (req, res) => {
        res.send("Hello, World!")
      })
      // Add more routes here...

      return app
    },
    (error) => new Error(String(error))
  )

const runApp = pipe(
  setupServices,
  TE.chain(() => initializeAppMiddlewares),
  TE.chain(initRoutes)
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
