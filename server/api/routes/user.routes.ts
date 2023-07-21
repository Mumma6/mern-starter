import { Router } from "express"
import { postUser, registerUser } from "../controllers/user.controller"

const router = Router()

router.post("/register", registerUser)

router.post("/login", postUser)

export default router
