import { Request, Response, Express, NextFunction } from "express"
import { pipe } from "fp-ts/lib/function"
import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import { createUser, loginUser } from "../../application/services/user.service"
import { UserDocument } from "../../infrastructure/schemas/user.schema"

export const registerUser = async (req: Request, res: Response) => {
  await pipe(
    req,
    createUser,
    TE.fold(
      (error) => async () => res.status(400).send({ error }),
      (data) => async () => res.status(200).send(data)
    )
  )()
}

export const postUser = async (req: Request, res: Response, next: NextFunction) => loginUser(req, res, next)
