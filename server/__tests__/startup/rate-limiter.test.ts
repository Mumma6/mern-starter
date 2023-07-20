import rateLimit from "express-rate-limit"
import { initializeRateLimitMiddleware } from "../../startup/rate-limiter"
import express, { Express } from "express"
import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import { rateLimitOptions } from "../../config"

jest.mock("express-rate-limit", () => jest.fn(() => jest.fn()))

describe("initializeRateLimitMiddleware", () => {
  test("should apply rate limit middleware to the app", async () => {
    // Create an instance of Express app
    const app: Express = express()

    // Create a mock function for app.use
    const useMock = jest.fn()

    // Mock the app.use method
    app.use = useMock

    // Initialize the rate limit middleware
    const result = await initializeRateLimitMiddleware(app)()

    // Assert that the rate limit middleware function is called with the expected arguments
    const rateLimitMock = rateLimit as jest.Mock

    expect(rateLimitMock).toHaveBeenCalledWith(rateLimitOptions)

    // Assert that the rate limit middleware is applied to the app
    expect(useMock).toHaveBeenCalled()

    // Assert the result is the same app instance
    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toBe(app)
    }
  })
})
