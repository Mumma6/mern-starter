import { Request, Response, Express } from "express"
import { pipe } from "fp-ts/lib/function"
import * as TE from "fp-ts/TaskEither"
import { createUser } from "../../application/services/user.service"

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
