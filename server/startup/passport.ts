import * as TE from "fp-ts/TaskEither"
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { UserDocument, UserModel } from "../infrastructure/schemas/user.schema"

export const initializePassport = () =>
  TE.tryCatch(
    async () => {
      passport.use(
        new LocalStrategy({ usernameField: "email", passReqToCallback: true }, async (_, email, password, done) => {
          const user = await UserModel.findOne({ email, password })
          if (user) {
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
