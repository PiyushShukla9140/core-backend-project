import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    
    // TODO: toggle subscription

    // Step 1) Recive the channel id from the req.params
    // Step 2) validate the channel id
    // Step 3) check whether channel exists or not
    // Step 4) Ensure the user is authenticated (req.user should exist).
    // Step 5) Prevent users from subscribing to their own channel.

    // Step 6) if channel is subscribed then unsubcribe krdo
    // Step 7) if not then subscribe krdo
    // Step 8) return res

    const {channelId} = req.params

    

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id")
    }

    const channel = await User.findById(channelId).select("_id")

    if(!channel){
        throw new ApiError(404,"Channel not found")
    }

    if(!req.user){
        throw new ApiError(401,"User is not authenticated ")
    }

    if (channel._id.equals(req.user._id)) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const channelAlreadySubscribed = await Subscription.findOneAndDelete({
        subscriber:req.user?._id,
        channel:channelId
    })


    if(channelAlreadySubscribed){
        return res.
        status(200)
        .json(new ApiResponse(200,{isSubscribed:false},"Subscription removed successfully"))
    }

    const newChannelSubscription = await Subscription.create({
        subscriber:req.user?._id,
        channel:channelId
    })

    if(!newChannelSubscription){
        throw new ApiError(500,"Error while subscribing the channel")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{isSubscribed:true},"Channel subscribed successfully"))



})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    // Step 1) fetch the channel id from the req
    // Step 2) validate the channel id
    // Step 3) check whthter the channel exists or not
    // Step 4) Use an aggregation pipeline on the Subscription collection.
    // Step 5) Match all subscription documents whose channel equals channelId.
    // Step 6) Lookup the subscriber details from the User collection.
    // Step 7) Unwind the subscriber array.
    // Step 8) Project only the required subscriber fields
    //         (username, fullName, avatar, etc.).
    // Step 9) Return an empty array if the channel has no subscribers.
    // Step 10) Return the subscriber list successfully.


    
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id")
    }

    const channel = await User.exists({_id:channelId})
    if(!channel){
        throw new ApiError(404,"Chanel not found")
    }

    // jin user documents me same channel match krega voh nikal na
    // $match me channel id match krana h

    const channelSubscribers = await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                 localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        {
            $unwind:"$subscriberDetails"
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $project:{
                _id: 0,
                subscribedAt:"$createdAt",
                subscriber: {
                    _id: "$subscriberDetails._id",
                    username: "$subscriberDetails.username",
                    fullName: "$subscriberDetails.fullName",
                    avatar: "$subscriberDetails.avatar"
                }
            }
        },
       

    ])

    if(channelSubscribers.length===0){
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [],
                "No subscribers found"
            )
        )
    }

    // if(!channelSubscibers){
    //     throw new ApiError(500,"Error while fetching the subscribers")
    // }
    // this check is unnecessary aggregate always returns an array
    return res
    .status(200)
    .json(new ApiResponse(200,channelSubscribers,"Subscribers fetched successfully"))



})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid subscriber ID")
    }

    const userExists = await User.exists({ _id: subscriberId });

    if (!userExists) {
        throw new ApiError(404, "User not found");
    }

    const userSubscribedChannels = await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },{
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channelsSubscribed"
            }
        },
        {
            $unwind:"$channelsSubscribed"
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $project:{
                _id: 0,
                subscribedAt:"$createdAt",
                channel: {
                    _id: "$channelsSubscribed._id",
                    username: "$channelsSubscribed.username",
                    fullName: "$channelsSubscribed.fullName",
                    avatar: "$channelsSubscribed.avatar"
                }
            }
        }
    ])

    if(userSubscribedChannels.length===0){
        return res
        .status(200)
        .json(
            new ApiResponse(200, [], "No subscribed channels")
        )
    }

    return res
    .status(200)
    .json( new ApiResponse(
        200,
        userSubscribedChannels,
        "Subscriptions fetched successfully"
    ))



})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}