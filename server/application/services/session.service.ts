import { Request } from "express"
import * as TE from "fp-ts/TaskEither"
import { UserDocument } from "../../infrastructure/schemas/user.schema"

export const createSession = (req: Request) => (user: UserDocument) =>
  TE.tryCatch(
    async () => {
      req.logIn(user, (err: any) => {
        if (err) {
          Error(err)
        }
      })
      return user
    },
    () => Error("Error creating session")
  )
