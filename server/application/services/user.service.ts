import { Request } from "express"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"
import { validateUserRequestData } from "../validations/user.validate"
import { checkUserExistByEmailQuery, createUserQuery } from "../../infrastructure/persistence/user.persistence"

import bcrypt from "bcryptjs"
import { UserInterface } from "../../domain/models/user.model"
import { createSession } from "./session.service"

const hashPassword = (password: string): TE.TaskEither<Error, string> =>
  TE.tryCatch(
    async () => bcrypt.hash(password, 10),
    (error) => error as Error
  )

const createHashedPassword = (userData: UserInterface): TE.TaskEither<Error, UserInterface> =>
  pipe(
    userData.password,
    hashPassword,
    TE.map((hashedPassword) => ({
      ...userData,
      password: hashedPassword,
    }))
  )

const checkUserEmail = (userData: UserInterface): TE.TaskEither<Error, UserInterface> =>
  pipe(
    userData,
    checkUserExistByEmailQuery,
    TE.chain((foundUser) => (foundUser ? TE.left(new Error("User with that email already exists")) : TE.right(userData)))
  )

export const createUser = (req: Request) =>
  pipe(
    req,
    validateUserRequestData,
    TE.fromEither,
    TE.chain(checkUserEmail),
    TE.chain(createHashedPassword),
    TE.chain(createUserQuery),
    TE.chain(createSession(req)),
    TE.bimap(
      (error: Error) => `Error creating user: ${error.message}`,
      (createdUser) => ({
        message: "User created successfully",
        user: createdUser,
      })
    )
  )
