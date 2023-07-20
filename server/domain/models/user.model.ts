import { z } from "zod"

export const UserSchema = z.object({
  firstName: z.string().min(1, "First name can not be empty").max(50, "First name to long"),
  lastName: z.string().min(1, "Last name can not be empty").max(50, "Last name to long"),
  email: z.string().email(),
  password: z.string().min(3, "Password to short").max(50, "Password to long"),
})

export type UserInterface = z.infer<typeof UserSchema>
