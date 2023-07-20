import { z } from "zod"
import * as E from "fp-ts/Either"
import { Request } from "express"

export const validateReqBody =
  <T>(schema: z.ZodSchema) =>
  (req: Request): E.Either<Error, T> => {
    const parsedBody = schema.safeParse(req.body)
    return parsedBody.success
      ? E.right(parsedBody.data)
      : E.left(new Error(parsedBody.error.errors.map(({ message }) => message).join(", ")))
  }
