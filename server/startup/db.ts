import * as TE from "fp-ts/TaskEither"
import mongoose from "mongoose"

const db = process.env.MONGO_URI || ""

export const initializeDatabase = () =>
  TE.tryCatch(
    () => mongoose.connect(db).then(() => console.log(`Connected to MongoDB`)),
    (error) => new Error(`Failed to connect to database: ${error}`)
  )
