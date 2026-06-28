import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import { Tweet } from "../models/tweets.model.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    // toggle like yaani pehli baar pe like ho jaa rha h
    // dusri baar clikc krne pe unlike ho jaa rha 
    // steps:
    // first you need ti extraxt the videoId 
    // second you need to check whether the videoId is valid or not
    // third videoId use krke like model me videoId document me store krado
    // fourth kyuki user loggedIn hai toh user.req?._id se userId nikalke likedBy model me use stpre krdo 
    // fifth agar user unlike krta hai video toh like model me se dono videoId and userId delete krado
    
    
    // Check Validation: Pehle check karo ki videoId valid hai ya nahi.
    // Search Existing Like (The Core Check): Like model mein dhoondho: Kya is user (req.user._id) ne is video (videoId) ko pehli se like kiya hua hai?
    // Condition A (Unlike Karna): Agar entry pehle se mil jaati hai, iska matlab user ab isse unlike karna chahta hai. Toh database se us Like document ko deleteOne() kar do.
    // Condition B (Like Karna): Agar entry nahi milti, iska matlab user pehli baar like kar raha hai. Toh Like.create() chalakar naya document insert kar do.


    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id format")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // const existingLike = await Like.findOne({
    //     video:videoId,
    //     likedBy:req.user?._id   
    // }) isme 2 databse queries required h 

    //code with single database queries
    const existingLike =  await Like.findOneAndDelete({
        video:videoId,// cannot use just video because video is a Mongoose document, not an ObjectId Although Mongoose can often cast a document to its _id, it's better to be explicit.
        likedBy:req.user?._id
    })

    if(existingLike){
        return res
        .status(200)
        .json(new ApiResponse(200,{isLiked:false},"Video unliked successfully"))
    }

   
    const newLike = await Like.create({
        video:videoId,
        likedBy:req.user?._id
    })

    if(!newLike){
        throw new ApiError(500, "Error while processing the like video request");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { isLiked: true }, "Video liked successfully")
        );
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    // Check Validation: Pehle check karo ki videoId valid hai ya nahi.
    // Search Existing Like (The Core Check): Like model mein dhoondho: Kya is user (req.user._id) ne is comment (commentId) ko pehli se like kiya hua hai?
    // Condition A (Unlike Karna): Agar entry pehle se mil jaati hai, iska matlab user ab isse unlike karna chahta hai. Toh database se us Like document ko deleteOne() kar do.
    // Condition B (Like Karna): Agar entry nahi milti, iska matlab user pehli baar like kar raha hai. Toh Like.create() chalakar naya document insert kar do.
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id format")
    }

    const comment= await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404,"The comment cannot be found")
    }

    const existingLike =  await Like.findOneAndDelete({
        comment:commentId,// cannot use just comment because comment is a Mongoose document, not an ObjectId Although Mongoose can often cast a document to its _id, it's better to be explicit.
        likedBy:req.user?._id
    })

    if(existingLike){
        return res
        .status(200)
        .json(new ApiResponse(200,{isLiked:false},"Comment unliked successfully"))
    }

    const newLike = await Like.create({
        comment:commentId,
        likedBy:req.user?._id
    })

    if(!newLike){
        throw new ApiError(500, "Error while processing the like comment request");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{isLiked:true},"Comment liked successfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    //// Check Validation: Pehle check karo ki videoId valid hai ya nahi.
    // Search Existing Like (The Core Check): Like model mein dhoondho: Kya is user (req.user._id) ne is comment (commentId) ko pehli se like kiya hua hai?
    // Condition A (Unlike Karna): Agar entry pehle se mil jaati hai, iska matlab user ab isse unlike karna chahta hai. Toh database se us Like document ko deleteOne() kar do.
    // Condition B (Like Karna): Agar entry nahi milti, iska matlab user pehli baar like kar raha hai. Toh Like.create() chalakar naya document insert kar do.

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweetId format")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404,"Cannot find the tweet to like or unlike")
    }

    const existingLike = await Like.findOneAndDelete({
        tweet:tweetId,
        likedBy:req.user?._id
    })

    if(existingLike){
        return res
        .status(200)
        .json(new ApiResponse(200,{isLiked:false},"Tweet unliked successfully"))


    }

    const newLike = await Like.create({
        tweet:tweetId,
        likedBy:req.user?._id
    })
    if(!newLike){
        throw new ApiError(500, "Error while processing the like tweet request");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{isLiked:true},"Tweet liked successfully"))


})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    // Step 1) Find the user whose liked videos needed to be fetched
    // Step 2)  Check if user exists or not
    // Step 3) Now use aggragation pipeline of mongoose, where we will match the likedBy field with user._id
    // this step will give us all the liked objects from particular user
    // Now logic for the step 3)
    // $match: we are first going to match user id with likedBy field from the like model,
    // then we are going to ,atch video to new mongoDB operators $exists and $ne
    // $exists is used to check whtther the field or key actually exists or not, if es then it drops those like documents which diesnt have video field
    // $ne(not empty): this operator is used to check whthter the field is null or not
   
   
   
   
    // const {username} = req.params
    // const user = await User.findOne({
    //     username: username.toLowerCase()
    // }).select("_id"); 
    // instead of doing this because we only want logged in users data

    const userId = req.user?._id
    

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const likedVideos = await Like.aggregate([
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video:{$exists:true,$ne:null}
                // get those liked documents jinme video exist krta h and it not empty

            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"videoDetails",
                
            }
        },
        {
            // Kyunki lookup array deta hai, $unwind usse flat object bana dega
            $unwind:"$videoDetails"
        },
        {
            // optional step jisme hum cideo ka owner bhi nikalege
            $lookup:{
                from:"users",
                localField:"videoDetails.owner",
                foreignField:"_id",
                as:"ownerDetails"

            }
        },
        {
            $unwind:"$ownerDetails"
        },
        {
             $sort:{
                createdAt:-1
            }
        },
        {
            $project:{
                _id: 1,
                likedAt: "$createdAt",
                video: {
                    _id: "$videoDetails._id",
                    videoFile: "$videoDetails.videoFile",
                    thumbnail: "$videoDetails.thumbnail",
                    title: "$videoDetails.title",
                    duration: "$videoDetails.duration",
                    views: "$videoDetails.views",
                    owner: {
                        username: "$ownerDetails.username",
                        fullName: "$ownerDetails.fullName",
                        avatar: "$ownerDetails.avatar"
                    }
                }
            }
        }

    ])
    return res
        .status(200)
        .json(
            new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
        );
});



export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}