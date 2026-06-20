import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { response } from "express";


 
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
    const coverImage = await uploadOnCloudinary(imageLocalPath)

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
        const accessToken=  user.generateAccessToken()
        // 
        const refreshToken = user.generateRefreshToken()
        // refresh token ko hum database me rkhte h
        // access token user ko de dete h
        // now saving the access token in the database
        user.refreshToken = refreshToken


        // now the the refresh token has been added to the user model
        // ab user ko save bhi karana h
        await user.save({validateBeforeSave:false})
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

    if(!username||!username){// depends on the application kya kya chahiyeh
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
    .cookie("accesToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{
                user:accessToken,refreshToken,loggedInUser
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







export {registerUser,loginUser,logoutUser}