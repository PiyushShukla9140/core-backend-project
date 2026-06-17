import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"

const registerUser = asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validate the details -not empty
    // check if user already exists? useing usernme and email
    // check for images and check for avatar
    //upload them to cloudinary
    //create user object- create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return response
    
    const {fullName, email, username, password} = req.body
    console.log("email: ",email)

    // if(fullName === ""){
    //     throw new ApiError(400,"FullName is required")
    // }

    if(
        [username,fullName,email,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existingUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"User with email and username already exist")
    }


})

export {registerUser}