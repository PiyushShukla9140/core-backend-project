import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { response } from "express";
import jwt from "jsonwebtoken";


 
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

    const existingUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"User with email and username already exist")
    }

    // now checking for images and avatar
    // multer provides the .files method 

   

    const avatarLocalPath =  req.files?.avatar[0]?.path
    //const imageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

    // check whether user is created or not

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
          console.log("User found:", user?._id)
        const accessToken=  user.generateAccessToken()
        console.log("Access token generated")
        // 
        const refreshToken = user.generateRefreshToken()
        console.log("Refresh token generated")
        // refresh token ko hum database me rkhte h
        // access token user ko de dete h
        // now saving the access token in the database
        user.refreshToken = refreshToken


        // now the the refresh token has been added to the user model
        // ab user ko save bhi karana h
        await user.save({validateBeforeSave:false})
          console.log("User saved")
        // yaha pe mongoose ke model kick in ho jate h 
        // user odel me humne save kraya tha ke passord field bhi requiered h
        // but yaha pe password hai hi nhi 
        // therefore we are using validateBeforeSave 

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something wernt wrog while generating refresh and access token")
    }
}

const loginUser = asyncHandler(async(req,res)=>{

    // take data from the user by req body
    // check whether ussername or email is there or not
    // database me se call lagao aur user find kro
    // user mil jaaye toh database ke data se password  authenticate kro
    // authenticate ho jaaeye toh access or refresh token bhejdo user ko 
    const {email,username,password} = req.body

    if(!(username||email)){// depends on the application kya kya chahiyeh
        throw new ApiError(400,"Username or password is required")

    }
    // finding the user in the database

    const user = await User.findOne({
        $or:[
            {username},{email}
        ]                  
    })
    // if user is not there 
    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    // passwird authentication using bcrypt
    // using the already created a isCorrectPassword method in user model
    // dont use User, this is the mongoose user 
    // use this user we, which we have created as an instance



    const isPasswordValid = await user.isPasswordCorrect(password)// yeh password user wala, req.body se aaya h

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user password")
    }

    // now the refresh and access token takes time we are going to use await
    const {refreshToken,accessToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken ")

    // sending the cookies
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{
                user: loggedInUser,
                    accessToken,
                    refreshToken
            },
            "User logged in successfully"
        )
    )
    
    


})

const logoutUser = asyncHandler(async(req,res)=>{
    // first remove all the cookies given to the user
    // then rmemove the tokens 
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


const refreshAccessToken = asyncHandler(async(req,res)=>{
    // accesing the refresh token
    const incomingRefreshToken = req.cookies.refreshToken || req.body
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    // verification of the incoming refresh token
    // verify krwane ke liye ek secret info aur ek token bhejna padta h
    // its not necessary decoded token has payload availbae
    // the payload is the middle part of the token that contains the actual data (claims), 
    // What it stores: It holds the information you want to transmit, such as the user's _id. In the project shown, the payload specifically contains the _id used to identify and find the user in the database

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // when we creaated the refresh token in user model we only had ._id filed in it 
        // now we can access that ._id foeld
        // now it is a database query so it takes time because database is in another continent

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401,"Refresh Token expired or used")
        }
        // now the matching step 
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
                
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, newRefreshToken} = generateAccessAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }



})









export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}