import { model, Schema, Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface UserDocument extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  comparePassword(password: string): boolean
}

const UserSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

export const UserModel = model<UserDocument>("User", UserSchema)
