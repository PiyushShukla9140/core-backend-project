import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { User } from "../models/user.model.js" 
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user?._id;

    if (!channelId) {
        throw new ApiError(401, "Unauthorized");
    }

    const channelExists = await User.exists({
        _id: channelId,
    });

    if (!channelExists) {
        throw new ApiError(404, "Channel not found");
    }

    // Parallelizing queries efficiently using Promise.all
    const [
        totalSubscribers,
        videoMetricsResult, //  COMBINED: Holds total videos count and total views together
        totalLikesResult,
    ] = await Promise.all([
        Subscription.countDocuments({
            channel: channelId,
        }),

        // Highly optimized single aggregation for both video count and views sum
        Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId),
                },
            },
            {
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1 }, // Replaced the separate countDocuments call
                    totalViews: { $sum: "$views" },
                },
            },
        ]),

        Like.aggregate([
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "videoDetails",
                },
            },
            {
                $unwind: "$videoDetails",
            },
            {
                $match: {
                    "videoDetails.owner": new mongoose.Types.ObjectId(channelId),
                },
            },
            {
                $count: "totalLikes",
            },
        ]),
    ]);

    // Flattening variables safely with fallback bounds
    const totalVideos = videoMetricsResult.length > 0 ? videoMetricsResult[0].totalVideos : 0;
    const totalViews = videoMetricsResult.length > 0 ? videoMetricsResult[0].totalViews : 0;
    const totalLikes = totalLikesResult.length > 0 ? totalLikesResult[0].totalLikes : 0;

    const stats = {
        totalSubscribers,
        totalVideos,
        totalViews,
        totalLikes,
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            stats,
            "Channel statistics fetched successfully"
        )
    );
})

const getChannelVideos = asyncHandler(async (req, res) => {
     const channelId = req.user?._id;

    if (!channelId) {
        throw new ApiError(401, "Unauthorized");
    }

    const channelExists = await User.exists({
        _id: channelId,
    });

    if (!channelExists) {
        throw new ApiError(404, "Channel not found");
    }

    const videos = await Video.find({
        owner: channelId,
    })
        .sort({
            createdAt: -1,
        })
        .populate("owner", "username fullName avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Channel videos fetched successfully"
        )
    );
})

export {
    getChannelStats, 
    getChannelVideos
}