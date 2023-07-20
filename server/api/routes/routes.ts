import { Express } from "express"
import * as TE from "fp-ts/TaskEither"
import userRoutes from "./user.routes"

export const initializeRoutes = (app: Express): TE.TaskEither<Error, Express> =>
  TE.tryCatch(
    async () => {
      app.use("/api/test", (req, res) => res.send("OK from api."))
      app.use("/api/user", userRoutes)

      return app
    },
    (error) => new Error(String(error))
  )
