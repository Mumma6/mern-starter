import { Request, Response, NextFunction } from "express"
import passport from "passport"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"
import { validateLoginRequestData, validateUserRequestData } from "../validations/user.validate"
import { checkUserExistByEmailQuery, createUserQuery } from "../../infrastructure/persistence/user.persistence"

import bcrypt from "bcryptjs"
import { UserInterface } from "../../domain/models/user.model"
import { createSession } from "./session.service"
import { UserDocument } from "../../infrastructure/schemas/user.schema"

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

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: UserDocument) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(400).send({ message: "Invalid email or password." })
    }

    // If everything is successful, manually login the user
    req.logIn(user, (err) => {
      if (err) {
        return res.status(401).send({ message: "Authentication failed", err })
      }
      // Optionally, you can return a success message or user data here
      return res.status(200).send({ message: "Login success", user })
    })
  })(req, res, next)
}
