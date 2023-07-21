import * as TE from "fp-ts/TaskEither"
import * as O from "fp-ts/Option"
import passport from "passport"
import Local from "passport-local"
import { pipe } from "fp-ts/function"
import { UserDocument, UserModel } from "../infrastructure/schemas/user.schema"

// Helper function to check if the user's password is valid

export const initializePassport = () =>
  TE.tryCatch(
    async () => {
      passport.use(
        new Local.Strategy({ usernameField: "email", passReqToCallback: true }, async (_, email, password, done) => {
          const user = await UserModel.findOne({ email })

          if (user) {
            if (!user.comparePassword(password)) {
              return done(undefined, false)
            }
            done(null, user)
          } else {
            done(null, false, { message: "Wrong email or password" })
          }
        })
      )

      passport.serializeUser((user, done) => {
        done(null, user)
      })

      passport.deserializeUser(async (id: string, done: (error: any, user?: any) => void) => {
        try {
          const user = await UserModel.findById(id)
          done(null, user)
        } catch (err) {
          done(err)
        }
      })
    },
    (e) => new Error("Error initialize Passport")
  )
