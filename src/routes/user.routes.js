import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1 // kitni files accept kroge

        },
        {
            name:"coverImage",
            macCount:1
        }
    ]),
    registerUser)

export default router