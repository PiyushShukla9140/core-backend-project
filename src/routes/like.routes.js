import Router from "express"

import {toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos} from "../controllers/like.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()
router.use(verifyJWT)

router("toggle/v/:videoId").post(toggleVideoLike)
router("toggle/c/:commentId").post(toggleCommentLike)
router("toggle/t/:tweetId").post(toggleTweetLike)
router("/videos").get(getLikedVideos)

export default router
