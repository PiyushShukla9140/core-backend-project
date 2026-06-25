import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateAccountDetails,
    deleteOldCoverImage,
    deleteUserAvatar
 } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

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
router.route("/login").post(loginUser)

//secured routes


// middleware is injected before logoutUser
router.route("/logout").post(verifyJWT,  logoutUser)


router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
// post will not be used because there is no new entry here 
// patch will be used because partial update krna h data ko 
router.route("/update-account").patch(verifyJWT, updateAccountDetails)


// upload.single() ka use tab kiya jata hai jab aapko frontend se 
// sirf aur sirf ek single file backend par receive karni ho. 
// Yeh Multer middleware ka ek specific method hai jo incoming 
// request data (multipart/form-data) ko process karta hai

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/avatar/delete").patch(verifyJWT, deleteUserAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/cover-image/delete").patch(verifyJWT, deleteOldCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
// /c/piyush iss tarike se username likhne h
router.route("/history").get(verifyJWT, getWatchHistory)



export default router