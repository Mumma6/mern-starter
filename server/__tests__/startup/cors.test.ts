import express, { Express } from "express"
import cors from "cors"
import * as E from "fp-ts/Either"
import { initializeCorsMiddleware } from "../../startup/cors"
import { corsOptions } from "../../config"

jest.mock("cors")

describe("initializeCorsMiddleware", () => {
  test("should apply CORS middleware to the app", async () => {
    // Create a mock Express app
    const app: Express = express()
    // Create a mock function for app.use
    const useMock = jest.fn()

    // Mock the app.use method
    app.use = useMock

    const result = await initializeCorsMiddleware(app)()

    const corsMock = cors as jest.Mock

    expect(corsMock).toHaveBeenCalledWith(corsOptions)

    // Assert that the middleware is applied to the app
    expect(useMock).toHaveBeenCalled()

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toBe(app)
    }
  })
})
