import winston from "winston"
import { initializeLogger } from "../../startup/logger"
import * as E from "fp-ts/Either"

// Mock the winston library
jest.mock("winston", () => ({
  exceptions: {
    handle: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
  add: jest.fn(),
}))

describe("initializeLogger", () => {
  afterEach(() => {
    // Clear any mocked implementation or calls after each test
    jest.resetAllMocks()
  })

  test("should initialize the logger with expected configuration", async () => {
    await initializeLogger()()

    // Assert winston.exceptions.handle is called with expected arguments
    expect(winston.exceptions.handle).toHaveBeenCalledWith(
      expect.anything(), // Console transport
      expect.anything() // File transport
    )

    // Assert winston.add is called with expected arguments for local file and console transports
    expect(winston.add).toHaveBeenCalledTimes(2)
    expect(winston.add).toHaveBeenCalledWith(
      expect.anything() // File transport configuration
    )
    expect(winston.add).toHaveBeenCalledWith(
      expect.anything() // Console transport configuration
    )
  })

  test("should return a rejected promise if an error occurs during initialization", async () => {
    const expectedError = new Error("Logger initialization error")
    const handleMock = jest.fn(() => {
      throw expectedError
    })
    winston.exceptions.handle = handleMock

    const result = await initializeLogger()()

    expect(() => {
      if (E.isLeft(result)) {
        throw result.left
      }
    }).toThrow(expectedError)
  })
})
