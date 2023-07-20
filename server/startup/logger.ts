import * as TE from "fp-ts/TaskEither"
import winston from "winston"

export const initializeLogger = () =>
  TE.tryCatch(
    () =>
      new Promise<void>((resolve) => {
        winston.exceptions.handle(
          new winston.transports.Console(),
          new winston.transports.File({ filename: "uncaughtExceptions.log" })
        )

        process.on("unhandledRejection", (ex) => {
          throw ex
        })

        // Local file
        winston.add(new winston.transports.File({ filename: "logfile.log" }))
        winston.add(new winston.transports.Console())

        resolve()
      }),
    () => new Error("Logger initialization error")
  )
