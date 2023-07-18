import { flow } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import helmet from "helmet"
import compression from "compression"
import { initializeMiddlewareForProduction } from "./helpers"

const initializeHelmet = initializeMiddlewareForProduction(helmet())
const initializeCompression = initializeMiddlewareForProduction(compression())

export const initializeProdMiddlewares = flow(initializeHelmet, TE.chain(initializeCompression))
