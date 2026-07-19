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
        
        console.log("Extracted Token:", token);

        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        console.log(jwt.decode(token));
        const decoded = jwt.decode(token);

        console.log("Cookie Token:", req.cookies?.accessToken);
        console.log("Header Token:", req.header("Authorization")?.replace("Bearer ", ""));
        console.log("Using Token:", token);

        console.log("Current Server Time:", Math.floor(Date.now() / 1000));
        console.log("Token Expiry:", decoded.exp);
        console.log("Seconds Remaining:", decoded.exp - Math.floor(Date.now() / 1000));
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        console.log("Decided Token:",decodedToken)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

         console.log("User:", user);
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

    
})