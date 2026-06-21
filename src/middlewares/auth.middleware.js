// this middleware will be used to check whether user is there or not
// why only verify ?
// because we have fiven acess and refresh token to the user
// on the basis of that token we can verify whther user is logged in or not
// if the token is not valid then he is not verified
// if true login is there then we will add new object in req
import { ApiError } from "../utils/ApiErrors.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";


export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        console.log("Cookies:", req.cookies);
        console.log("Auth Header:", req.header("Authorization"));
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

    
})