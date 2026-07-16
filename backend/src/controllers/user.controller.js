import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


 
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
        coverImage:coverImage?.url||"",
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

// Now the update controllers

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body

    // if there is a demand that you shoukd also include confirm password field ,
    // then destructure the confPassword form the req.body and then 
    // use if condtion to check whether the newPassword is equal to oldPassword or not

    // agar login hai user tabhi toh password change kr paa rha h
     const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)    
   
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})
    // now thw userSchema.pre save hook in the user model will be called

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

// agar user logged in toh using auth middleware hum boht asani se current user nikal skte h
const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const deleteUserAvatar = asyncHandler(async(req,res)=>{
    const oldAvatar = req.user?.avatar

    if(!oldAvatar){
        throw new ApiError(400,"User Avatar does not exist")
    }

    const deleteAvatar = await deleteFromCloudinary(oldAvatar)

    if(!deleteAvatar){
        throw new ApiError(400,"Error while deleting the avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,{
            $set:{
                avatar:""
            }
        },{new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Avatar deleted successfully")
    )
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path
     // we got this req.file from the multer middleware
     // upar files use hua h because multiple file upload option dene the
    
    if(!avatarLocalPath){
        new ApiError(400,"Avatar file is missing")
    }

    const oldAvtar = req.user?.avatar
    

    // now upload the file on the cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    // if uploaded and did not get the url

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,{
            $set:{
                avatar : avatar.url
            }
        },{new:true}
    ).select("-password")

    if(oldAvtar){
        await deleteFromCloudinary(avatar)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Avatar Inamge has been updated successfully")
    )
})
const deleteOldCoverImage = asyncHandler(async(req,res)=>{
    // check whether user has a coverImage or not
    // if the user has a cover image then store it into a variable
    // after storing it into a variable, perform delete operation
    const oldCoverImage = req.user?.coverImage
    
    if(!oldCoverImage){
        throw new ApiError(400,"No cover image found to delete")
    }

    const deleteImage = await deleteFromCloudinary(oldCoverImage)

    if(!deleteImage){
        throw new ApiError(400,"Could not delete image from cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,{
            $set:{
                coverImage:""
            }
        },{new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user," CoverImage has been deleted successfully")
    )
})


const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path


    if(!coverImageLocalPath){
        throw new ApiError(400,"Cannot find the cover image , cover image is missing")
    }
    
    // if there is a coverImage already there
    const oldCoverImageUrl = req.user?.coverImage;
    // delete operation for old coverImage is performed below because
    // we need the url of old image, agar neeche iss line ko likhte toh nayi image ka url milta 
    // and nayi image delete hoti

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage?.url){
        throw new ApiError(400,"Could not upload the cover image on cloudinary from database")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,{
            $set:{
                coverImage:coverImage.url
            }
        },{new:true}
    ).select("-password")


    if (oldCoverImageUrl) {
        await deleteFromCloudinary(oldCoverImageUrl);
    }

     return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Cover Image has been updated successfully")
    )

})

const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(400, "Username is missing")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",// humne model ka Subscription rkha tha lekin databse me naam change ho gya tha
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
           $lookup:{
                from:"subscriptions",// humne model ka Subscription rkha tha lekin databse me naam change ho gya tha
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
           } 
        },
        {
            $addFields:{
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                // what about the subscribe button, if user has already subscribed then it should not show the button
                // frontend developer ko true yaa false message bhej dnege ke 
                // true hai toh subscribed hai and false hai toh subscribe nhi h
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,// means fullName is passed as the flag is on
                username:1,
                subscribersCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                avatar: 1,
                coverImage: 1,
                email: 1



            }
        }
    ])
    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )

})

const getWatchHistory = asyncHandler(async(req,res)=>{
    // cannot use req.user?._id there is a problem in this mongoose method
    // mongo db me id kuch strong form me store hhti h
    // hum id ko convert jrna h normally mongoose _id ko convert ke de deta h automatically
    // but aggregation pipeline me mongoose ka involvement nhi hota


    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",// kaha se lookup krna h?
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }    
                    }
                ]

            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})










export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    deleteOldCoverImage,
    deleteUserAvatar,
    getUserChannelProfile,
    getWatchHistory

    

}