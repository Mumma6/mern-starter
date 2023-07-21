import { UserInterface, UserSchema } from "../../domain/models/user.model"
import { validateReqBody } from "./helpers"

export const validateUserRequestData = validateReqBody<UserInterface>(UserSchema)

export const validateLoginRequestData = validateReqBody<Pick<UserInterface, "email" | "password">>(
  UserSchema.pick({ email: true, password: true })
)
