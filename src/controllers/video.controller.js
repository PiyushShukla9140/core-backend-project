import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import fs from "fs";

// Helper function to pull Cloudinary Public ID from its long absolute secure URL link
const getCloudinaryPublicId = (url) => {
    if (!url) return null;
    const parts = url.split("/");
    const fileName = parts[parts.length - 1]; // e.g., "sample.jpg"
    return fileName.split(".")[0]; // Returns raw public identification token string "sample"
};

const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination

    // Step 1) recieve userId from the query params 
    // Step 2) check if the userId  is valid or not
    // Step 3) check whether the user exists or not
    // Step 4) if user exists then
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query;

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    // Allowed sorting fields validation
    const allowedSortFields = ["createdAt", "views", "duration", "title"];
    if (!allowedSortFields.includes(sortBy)) {
        throw new ApiError(400, "Invalid sort field");
    }// we are showing only those videos that are publiclly available, no provate videos

    const sortDirection = sortType === "asc" ? 1 : -1;
    const matchStage = { isPublished: true };

    // Filter by Owner
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid User ID");
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    // Search query mapping using partial case-insensitive regex
    if (query && query.trim() !== "") {
        matchStage.$or = [
            { title: { $regex: query.trim(), $options: "i" } },
            { description: { $regex: query.trim(), $options: "i" } }
        ];
    }

    // Explanation: Agar user ne search bar mein kuch text (query) likha hai, toh hum MongoDB ka $or operator chalate hain. Hum check karte hain ki kya wo text video ke title mein hai YA description mein hai.
    // $regex: Yeh partial search allow karta hai. Agar aap poora word nahi bhi likhenge, tab bhi matching results mil jayenge.
    // $options: "i": Yeh case-insensitive search karta hai, yaani aap 'CHAI' likho ya 'chai', dono match ho jayenge.
    

    const result = await Video.aggregate([
        { $match: matchStage },
        //$facet: Yeh MongoDB ko allow karta hai ki wo ek hi data pool par do alag-alag operations parallelly (ek sath) chalaye.
        {
            // Parallel Query Engine Block
            // Explanation: $facet ke andar pehla rasta (pipeline branch) hai metadata. 
            // Yeh bina data badle seedhe count kar ke bata dega ki is filter ke hisab se database mein total kitne videos match huye hain.
            $facet: {
                metadata: [{ $count: "totalVideos" }],
                videos: [
                    //$sort: Dynamic field ke basis par pure data ko sort (line mein) karta hai.
                    //$skip & $limit: Humne jo pagination ki maths upar calculate ki thi, use yahan apply karke sirf specific page ka data nikalte hain.
                    { $sort: { [sortBy]: sortDirection } },
                    { $skip: skip },
                    { $limit: limitNumber },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails"
                        }
                    },
                    { $unwind: "$ownerDetails" },
                    {
                        $project: {
                            _id: 1,
                            videoFile: 1,
                            thumbnail: 1,
                            title: 1,
                            description: 1,
                            duration: 1,
                            views: 1,
                            createdAt: 1,
                            isPublished: 1,
                            owner: {
                                _id: "$ownerDetails._id",
                                username: "$ownerDetails.username",
                                fullName: "$ownerDetails.fullName",
                                avatar: "$ownerDetails.avatar"
                            }
                        }
                    }
                ]
            }
        }
    ]);

     // Safe extraction logic preventing runtime undefined failures
    const facetData = result[0] || { videos: [], metadata: [] };
    const videos = facetData.videos || [];
    //Explanation: Agar database poori tarah se khali ho, 
    //toh system crash na ho. Isliye hum default check lagate hain ki agar data na mile toh empty arrays [] fallback ho jayein.
    
    const totalVideos = facetData.metadata.length > 0 
        ? facetData.metadata[0].totalVideos 
        : 0;

    const totalPages = Math.ceil(totalVideos / limitNumber);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalVideos,
                    limit: limitNumber,
                    hasNextPage: pageNumber < totalPages,
                    hasPreviousPage: pageNumber > 1
                }
            },
            "Videos fetched successfully"
        )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    
    // Step 1) receive the title and description of the video from req.body
    // Step 2) validate the title and descriptiton of the videos
    // Step 3) check if the video exists on local server or not
    // Step 4) if it exists on local server then use uploadOnCloudinary to upload on cloudinary
    // Use multer req.files, for step 4
    // Step 5) now if the upload is successfull then save the cloudinary url in database 
    // Step 6) return res

    if (!title || title.trim() === "") {
        throw new ApiError(400, "Title cannot be empty")
    }

    if (!description || description.trim() === "") {
        throw new ApiError(400, "Description cannot be empty")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail image is required")
    }

    let videoFileCloudinary;
    let thumbnailCloudinary;

    try {
        videoFileCloudinary = await uploadOnCloudinary(videoFileLocalPath);
        thumbnailCloudinary = await uploadOnCloudinary(thumbnailLocalPath);

        if (!videoFileCloudinary || !thumbnailCloudinary) {
            throw new ApiError(500, "Failed to upload files to Cloudinary");
        }
    } catch (error) {
        if (fs.existsSync(videoFileLocalPath)) fs.unlinkSync(videoFileLocalPath);
        if (fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath);
        throw new ApiError(500, error?.message || "File upload orchestration failed");
    }

    const newVideo = await Video.create({
        videoFile: videoFileCloudinary.url,
        thumbnail: thumbnailCloudinary.url,
        title: title.trim(),
        description: description.trim(),
        duration: videoFileCloudinary.duration || 0,
        owner: req.user?._id,
        isPublished: true
    })

    if (!newVideo) {
        throw new ApiError(500, "Something went wrong while saving the video record to database")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newVideo, "Video published and uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id


    // Step 1) get the videoID from the req params
    // Step 2) validate the videoId using isValidObjectId
    
    // Step 3)  use find by id to get the video
    // Step 4) if the findById falis throw 404 error that video doesnt exists
    // Step 5) return response

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    const video = await Video.findById(videoId).populate("owner", "username fullName avatar")

    if (!video) {
        throw new ApiError(404, "Video doesn't exist")
    }

    // if the database fails then async handler will handle the error here 


    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"))
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail


    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }

    const { title, description } = req.body
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    const currentVideo = await Video.findById(videoId);
     // check whether the video exists or not

    if (!currentVideo) {
        throw new ApiError(404, "Cannot find the video")
    }

    if (!currentVideo.owner.equals(req.user?._id)) {
        if (thumbnailLocalPath && fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath);
        throw new ApiError(403, "Unauthorized")
    }

    const updateFields = {}

    if (title && title.trim() !== "") updateFields.title = title.trim()
    if (description && description.trim() !== "") updateFields.description = description.trim()
    
    if (thumbnailLocalPath) {
        let uploadedThumbnail;
        try {
            uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
            if (!uploadedThumbnail) {
                throw new ApiError(500, "Failed to upload thumbnail");
            }
            updateFields.thumbnail = uploadedThumbnail.url;

            //  FIXED: Old garbage asset drop handling from Cloudinary storage
            const oldThumbnailId = getCloudinaryPublicId(currentVideo.thumbnail);
            if (oldThumbnailId) {
                await deleteFromCloudinary(oldThumbnailId); 
            }
        } catch (error) {
            if (fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath);
            throw new ApiError(500, error?.message || "Thumbnail alteration failed");
        }
    }

    // If User did not send anything to update
    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).populate("owner", "username fullName avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))    
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user?._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    // FIXED: Convert absolute asset url parameters into valid public IDs before trigger deletion
    const videoPublicId = getCloudinaryPublicId(video.videoFile);
    const thumbnailPublicId = getCloudinaryPublicId(video.thumbnail);

    if (videoPublicId) await deleteFromCloudinary(videoPublicId);
    if (thumbnailPublicId) await deleteFromCloudinary(thumbnailPublicId);

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    return res.status(200).json(
        new ApiResponse(200, deletedVideo, "Video deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    // Step 1) Receive the videoId from req.params
    // Step 2) validate the videoId
    // Step 3) check the current status of the video
    // Step 4) if isPublished for the video is true then make it false
    // Step 5) if isPublished for the video is false then make it true
    // Step 6) return res

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user?._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            { isPublished: video.isPublished, video },
            `Video ${video.isPublished ? "published" : "unpublished"} successfully`
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}