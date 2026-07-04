import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.models.js"


const createPlaylist = asyncHandler(async (req, res) => {
    

    //TODO: create playlist

    // Step 1) receive the name and description from the req.body
    // Step 2) validate the name and description
    // Step 3) now create the playlist using Playlist.create
    // Step 4) check if the playlist created successfully or not
    // Step 5) return response
    const {name, description} = req.body
    const user = req.user?._id

    if(!name||name.trim()===""){
        throw new ApiError(400,"Playlist name is required, cannot be empty")
    }

    if(!description||description.trim()===""){
        throw new ApiError(400,"Playlist description is required, cannot be empty")
    }

    const playlist = await Playlist.create({
        name:name.trim(),
        description:description.trim(),
        owner:user
    })

    if(!playlist){
        throw new ApiError(500,"Error while creating the playlist")
    }

    return res
    .status(201)
    .json(new ApiResponse(200,playlist,"Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    // Step 1) extract the userId from req.params
    // Step 2) validate the userId
    // Step 3) check whehther the user exists or not using User.exists method
    // Step 4) if user exists, then 




    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user ID")
    }

    // const user = await User.findOne({
    //     username: username.toLowerCase()
    // }).select("_id");
    // this can only be used when we are extracting the username param
    // but we are using uerId 
    const userExists = await User.exists({ _id: userId });

    if(!userExists){
        throw new ApiError(404,"User not found")
    }

    const userPlaylists = await Playlist.find({owner:userId})
    .populate("owner","username fullName avatar")
    .sort({createdAt:-1});

    // as .find returns [] and it does not return null
    if(userPlaylists.length===0){
        return res
        .status(200)
        .json(new ApiResponse(200,[],"User playlists fetched successfully"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,userPlaylists,"User playlist fetched successfully"))

    
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    // Step 1) fetch the playlistId from the params
    // Step 2) validate the playlist id
    // Step 3) find the playlist using the playlistId
    // Step 4) check whether the playlist exists or not
    // Step 5) if it exists, then find the playlist by id
    // Step 6) return the res


    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id")
    }

  

    const playlist = await Playlist.findById(playlistId)
    .populate("owner", "username fullName avatar")
    .populate("videos", "title thumbnail duration owner");

    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }


    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    

    // Step 1) recevie the playlistId and videoId from  the req.params
    // Step 2) validate the playlistId and videoId
    // Step 3) check whether the playlist exists or not
    // Step 4) check whther the video exists or not 
    // Step 5) check whether the user is authorized to add video in playlist
    // Step 6) after authirization, push cideo into playlist using mongoDb operator
    // Step 7) return res

    // there are two operators which can push video into playlist
    // 1) $push: Yeh operator bina check kiye video ID ko seedhe array ke end mein insert kar deta hai.
    // 2) $addToSet: Playlists ke liye industry mein hamesha $addToSet use kiya jata hai taaki agar user ek hi video ko do baar add kare, 
    //               toh database mein duplicate entry na bane.
    // We are going to use addToSET operator

    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }

    // const playlistExists = await Playlist.exists({_id:playlistId}).select("owner")
    // cannot use .exists and .select togethier

    // we are going to use .findbyId 

    const playlistExists = await Playlist.findById(playlistId).select("owner")

    const videoExists = await Video.exists({_id:videoId})

    if(!playlistExists){
        throw new ApiError(404,"Playlist not found")
    }

    if(!videoExists){
        throw new ApiError(404,"Video not found")
    }

    if(!playlistExists.owner.equals(req.user?._id)){
        throw new ApiError(403,"Unauthorized request")
    }

    const addToPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $addToSet:{
                videos:videoId
            }
        },{new:true}
    ).populate("owner","username fullName avatar")
    .populate("videos", "title thumbnail duration")

    if(!addToPlaylist){
        throw new ApiError(500,"Error while adding the video in playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,addToPlaylist,"Video successfully added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist


    // Step 1) Recieve the playlistId and videoId from req.params
    // Step 2) validate the playlistId and videoId 
    // Step 3) check whether the playlist and video, both exists or not
    // Step 4) if both of them exists then check whether the user is authorized or not
    // Step 5) if user is authorized then use $pull operator to remove the video from playlist
    // Step 6) if the mongoDb operation fails throw error
    // Step 7) return response 

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid Playlist ID")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }

    const playlistExists = await Playlist.findById(playlistId).select("owner")

    const videoExists = await Video.exists({_id:videoId})

    if(!playlistExists){
        throw new ApiError(404,"Playlist not found")
    }

    if(!videoExists){
        throw new ApiError(404,"Video not found")
    }

    if(!playlistExists.owner.equals(req.user?._id)){
        throw new ApiError(403,"Unauthorized request")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull:{
                videos:videoId
            }
        },{new:true}
    ).populate("owner", "username fullName avatar")
     .populate("videos", "title thumbnail duration");

    if(!updatedPlaylist){
        throw new ApiError(500,"Error while deleting the video from playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlaylist,"Playlist deleted successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    // Step 1) receive the playlistId from req.params
    // Step 2) validate the playlistId
    // Step 3) check whether the playlist exists or not
    // Step 4) check whether the user is authorized or not
    // Step 5) if user is authorized then delete the playlist
    // Step 6) check whether the playlist is delted or not
    // Step 7) retrun the response

    // if we are using the findbyid and delete it will work but what happens behind the scene?
    // Nahi, videos delete NAHI honge. Hamare playlist schema mein videos ka sirf reference link (ObjectId) store hota hai, actual video file ya video data store nahi hota.

     //Iska Matlab: Jab aap findByIdAndDelete chala kar poori playlist uda dete hain, toh sirf wo playlist waala document database se delete hota hai.
     // Jo videos us playlist ke andar list programming mein reference the, wo Videos collection mein bilkul safe pade rahenge.
     //  Kisi bhi video par koi asar nahi padega.
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID format");
    }

    const playlist = await Playlist.findById(playlistId).select("owner");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    
    if (!playlist.owner.equals(req.user?._id)) {
        throw new ApiError(403, "You do not have permission to delete this playlist");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
        throw new ApiError(500, "Something went wrong while deleting the playlist");
    }

    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted successfully at once")
        );
});


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id")
    }

    if(!name||name.trim()===""){
        throw new ApiError(400,"Playlist name cannot be empty")
    }

    if(!description|| description.trim()===""){
        throw new ApiError(400,"Description cannot be empty")

    }

   

    

    const playlist = await Playlist.findById(playlistId).select("owner")
    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }


    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(403, "Unauthorized request");
    }


    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set:{
                name:name.trim(),
                description: description.trim()
            }
        },{new:true}
    )
    .populate("owner", "username fullName avatar")
    .populate("videos", "title thumbnail duration");

    if(!updatedPlaylist){
        throw new ApiError(500,"Error while updating the playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlaylist,"Playlist updated successfully"))


})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}