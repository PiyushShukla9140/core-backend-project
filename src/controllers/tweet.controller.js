import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    // Steps: 1) Pehle content lo user se through req.body
    // 2) check whther contetn is empty or not
    // 3) If content is not empty then use Tweet.create to create a tweet
    // 4) return the res

    const {content} = req.body

    if(!content||content.trim()===""){
        throw new ApiError(400,"Error ehile crating the tweet as there is no content availabe")
    }

    const tweet = await Tweet.create({
        content:content.trim(),
        owner:req.user?._id
    })

    if(!tweet){
        throw new ApiError(400,"Error while creating tweet in database")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,tweet,"Tweet Created Successfully"
        )
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    // Step 1)  Find the user whose tweets we need to find

    const {username} = req.params
    const user = await User.findOne({
        username: username.toLowerCase()
    }).select("_id");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "owner.username": 1,
                "owner.fullName": 1,
                "owner.avatar": 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200,tweets,"Tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    // Step 1) Extract the content and the tweetId which is going to be updated form the req.body
    // Step 2) Check whether the tweetId is valid or not and also check the updated content
    // Step 3) Now find the tweet in the database
    // Step 4) check whehter the user who is updating the tweet is the same who created it or not
    // Step 5) if not then throw error 
    // Step 6) now using $set update the tweet 
    // Step 7) return the res

    const {content} = req.body
    const {tweetId} = req.params
    

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id format")
    }

    if(!content|| content.trim()===""){
        throw new ApiError(400,"Updated content cannot be empty")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(401,"Cannot find the tweet ")
    }

    if(tweet.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400,"User dint have permission to update the tweet")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,{
            $set:{
                content:content.trim()
            }
        },{new:true}
    )

    if(!updatedTweet){
        throw new ApiError(400,"Error updating the tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedTweet,"Tweet updated successfully"))





})    

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id format")
    }


    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(400,"Error finding the tweet to delete")
    }

    if(tweet.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400,"User dint have permission to delete the tweet")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
    

    if(!deletedTweet){
        throw new ApiError(400,"Error while deleting the tweet")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, "Tweet deleted successfully"))
})
    



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}