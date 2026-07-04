import mongoose,{isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    // Steps:
    // 1) Receive the video id from the req params
    // 2) Check whtether the id is valid or not
    // 3) Check whether the video exists or not
    // 4) if video exists check is there any comments or not
    // 5) if there any comments exists, use mongoDb aggregation pipeline to get all the comments


    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }

    
    //const video = await Video.findById(videoId);
    // this method is also correct for finding video but there is also an more optimized way

    const video = await Video.exists({
        _id: videoId
    });

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));


    if(!video){
        throw new ApiError(404,"Cannot find the video")
    }

    const videoComments = await Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(videoId)

            }
        },{
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"userDetails"
            }
        },
        {
            $unwind:"$userDetails"
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $skip: (pageNumber - 1) * limitNumber
        },
        {
            $limit: limitNumber
        },

        {
            $project:{
                _id:1,
                content:1,
                createdAt:1,
                owner:{
                    username:"$userDetails.username",
                    fullName:"$userDetails.fullName",
                    avatar:"$userDetails.avatar"         
                }
            }
        },

    ])

    if (videoComments.length === 0){
        return res
        .status(200)
        .json(new ApiResponse(200,[],"Comments fetched successfully"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,videoComments,"Video comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video


    // Step 1) Receive the content and videoId from the requests
    // Step 2) check if content is there or not and check whether the videoId is valid or not 
    // Step 3) check whether the video exists or not
    // Step 4) Now create new content using .create method
    // Step 5) return the res
    const {content} = req.body
      const {videoId} = req.params

      if(!content|| content.trim()===""){
        throw new ApiError (400,"Content is empty")
      }

      if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
      }

      const videoExists = await Video.exists({_id:videoId})

      if(!videoExists){
        throw new ApiError(404,"Video not found")
      }
    
      const createComment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user?._id
      })


      if(!createComment){
        throw new ApiError(500,"Error adding the comment")
      }

      const populatedComment = await Comment.findById(newComment._id)
      .populate("owner","username fullName avatar");

      return res
      .status(200)
      .json(new ApiResponse(201,populatedComment,"Comment added successfully"))

  




})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    // Step 1) Receive the commentId from req.params
    // Step 2) Get the updatedContent from the req.body 
    // Step 3) Check both the steps using if 
    // Step 4) Check if the comment is exists in the database or not
    // Step 5) Check the wser whether it is the same who created the comment or not
    // Step 6) if the user is authorized then update the comment 
    // Step 7) retrun the successful response

    const {commentId} = req.params
    const userId = req.user?._id
    const {content} = req.body

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment Id")
    }

    if(!content||content.trim()===""){
        throw new ApiError(400,"Update content cannot be empty")
    }

    const oldComment = await Comment.findById(commentId).select("owner")
    if(!oldComment){
        throw new ApiError(404,"Comment cannot be found")
    }

    

    // if(userId.toString()!== oldComment.owner.toString()){
    //     throw new ApiError(403,"Unauthorized request")
    // }

    // instead of convertinf the objectId to string we can use inbuilt mongo db method to compare the object id

    if(!oldComment.owner.equals(userId)){
        throw new ApiError(403,"Unauthorized request")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId,
    {
        content:content.trim(),

    },{new:true, runValidators: true}).populate("owner", "username fullName avatar")

    if(!updatedComment){
        throw new ApiError(500,"Error while updating the content")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedComment,"Comment updated successfully"))


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    // Step 1) extract the comment id from the req.params
    // Step 2) validate the comment id 
    // Step 3) Find the comment in the databse using comment.findbyid
    // Step 4) if comment not found then throw api error
    // Step 5) if comment exists then check whether the user is authorized or not
    // Step 6) if user is authorized then use findidanddelete method 
    // Step 7) return response


    const{commentId} = req.params
    const userId = req.user?._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Comment ID is invalid")
    }

    const comment = await Comment.findById(commentId).select("owner");
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    if(!comment.owner.equals(userId)){
        throw new ApiError(403,"Unauthorized Request")
    }

    const deleteComment = await Comment.findByIdAndDelete(commentId)

    if(!deleteComment){
        throw new ApiError(500,"Error while deleting the comment")
    }

    return res
    .status(200).json(new ApiResponse(200,null,"Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }