import * as TE from "fp-ts/TaskEither"
import { UserDocument, UserModel } from "../schemas/user.schema"
import { UserInterface } from "../../domain/models/user.model"

export const createUserQuery = (user: UserInterface): TE.TaskEither<Error, UserDocument> =>
  TE.tryCatch(
    async () => {
      const newUser = new UserModel(user)
      await newUser.save()
      return newUser
    },
    (error) => new Error(String(error)) // or a more sophisticated error handling
  )

export const checkUserExistByEmailQuery = (user: UserInterface): TE.TaskEither<Error, boolean> =>
  TE.tryCatch(
    async () => {
      const userResult = await UserModel.findOne({ email: user.email })
      return !!userResult
    },
    (error) => new Error(String(error)) // or a more sophisticated error handling
  )
