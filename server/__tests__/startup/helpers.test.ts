import express, { Express, RequestHandler } from "express"
import { initializeMiddlewareForProduction } from "../../startup/helpers"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"
import { initializeProdMiddlewares } from "../../startup/production"

describe("initializeMiddlewareForProduction", () => {
  test("should apply middleware to the app in production mode", async () => {
    // Set NODE_ENV to "production"
    process.env.NODE_ENV = "production"

    // Create a mock Express app
    const app: Express = express()

    // Create a mock middleware function
    const middlewareMock: RequestHandler = jest.fn()

    // Create a mock function for app.use
    const appUseMock = jest.fn()

    // Replace the original app.use with the mock function
    app.use = appUseMock

    // Initialize the middleware for production
    const result = await pipe(
      app,
      initializeMiddlewareForProduction(middlewareMock),
      TE.fold(
        (error: Error) => {
          throw error // Throw the error if the TaskEither is a Left value
        },
        (expressApp) => TE.right(expressApp)
      )
    )()

    // Assert that the result is a Right value containing the app instance
    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toBe(app)
    }

    // Assert that the middleware function is applied to the app in production mode
    expect(appUseMock).toHaveBeenCalledWith(middlewareMock)
  })

  test("should not apply middleware to the app in non-production mode", async () => {
    // Set NODE_ENV to a non-production value
    process.env.NODE_ENV = "development"

    // Create a mock Express app
    const app: Express = express()

    // Create a mock middleware function
    const middlewareMock: RequestHandler = jest.fn()

    // Create a mock function for app.use
    const appUseMock = jest.fn()

    // Replace the original app.use with the mock function
    app.use = appUseMock

    // Initialize the middleware for production
    const result = await pipe(
      app,
      initializeMiddlewareForProduction(middlewareMock),
      TE.fold(
        (error: Error) => {
          throw error // Throw the error if the TaskEither is a Left value
        },
        (expressApp) => TE.right(expressApp)
      )
    )()

    // Assert that the result is a Right value containing the app instance
    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toBe(app)
    }

    // Assert that the middleware function is not applied to the app in non-production mode
    expect(appUseMock).not.toHaveBeenCalled()
  })

  test("should not apply production middlewares in non-production mode", async () => {
    // Set NODE_ENV to a non-production value
    process.env.NODE_ENV = "development"

    // Create a mock Express app
    const app: Express = express()

    // Create a mock middleware function
    const middlewareMock: RequestHandler = jest.fn()

    // Create a mock function for app.use
    const appUseMock = jest.fn()

    // Replace the original app.use with the mock function
    app.use = appUseMock

    // Initialize the production middlewares
    const result = await pipe(
      app,
      initializeMiddlewareForProduction(middlewareMock),
      TE.fold(
        (error: Error) => {
          throw error // Throw the error if the TaskEither is a Left value
        },
        (expressApp) => TE.right(expressApp)
      )
    )()

    // Assert that the result is a Right value containing the app instance
    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toBe(app)
    }

    // Assert that the middleware function is not applied to the app in non-production mode
    expect(appUseMock).not.toHaveBeenCalled()
  })
})
