import { RequestHandler } from "express"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { Express } from "express"

export const initializeMiddleware =
  (middleware: RequestHandler): ((app: Express) => TE.TaskEither<Error, Express>) =>
  (app: Express) =>
    TE.tryCatch(
      async () => {
        app.use(middleware)
        return app
      },
      (error) => new Error(String(error))
    )

export const initializeMiddlewareForProduction =
  (middleware: RequestHandler): ((app: Express) => TE.TaskEither<Error, Express>) =>
  (app: Express) =>
    TE.tryCatch(
      async () => {
        if (process.env.NODE_ENV === "production") {
          app.use(middleware)
        }
        return app
      },
      (error) => new Error(String(error))
    )
