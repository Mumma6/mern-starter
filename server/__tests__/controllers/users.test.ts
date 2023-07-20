const request = require("supertest")
import { MongoMemoryServer } from "mongodb-memory-server"
import { app } from "../.."

// Initialize MongoDB Memory Server
const mongoServer = new MongoMemoryServer()

// Declare a variable to hold the MongoDB connection URI
let mongoUri: string

beforeAll(async () => {
  // Start the MongoDB Memory Server and get the connection URI
  mongoUri = await mongoServer.getUri()

  // Set the MongoDB connection URI in your app's environment variables
  process.env.MONGO_URI = mongoUri
})

afterAll(async () => {
  // Stop the MongoDB Memory Server
  await mongoServer.stop()
})

describe("registerUser", () => {
  test("should create a new user and return success response", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password",
      })
      .expect(200)

    // Assert the response
    expect(response.body).toEqual({
      message: "User created successfully",
      user: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
    })
  })

  test("should return an error response when user creation fails", async () => {
    // Mock the createUser function to throw an error
    jest.mock("path/to/your/createUser", () => {
      throw new Error("User creation failed")
    })

    const response = await request(app)
      .post("/register")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password",
      })
      .expect(400)

    // Assert the response
    expect(response.body).toEqual({
      error: "User creation failed",
    })
  })
})
