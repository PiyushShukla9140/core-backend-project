import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { User } from "../models/user.models.js" 
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getValidatedChannelId = async (req) => {
    const channelId = req.user?._id;

    if (!channelId) {
        throw new ApiError(401, "Unauthorized");
    }

    const exists = await User.exists({
        _id: channelId,
    });

    if (!exists) {
        throw new ApiError(404, "Channel not found");
    }

    return channelId;
};

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = await getValidatedChannelId(req);

    // Parallelizing queries efficiently using Promise.all
    const [
        totalSubscribers,
        videoStats, //  COMBINED: Holds total videos count and total views together
        likeStats,
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
    const {
        totalVideos = 0,
        totalViews = 0,
    } = videoStats[0] || {};

    const {
        totalLikes = 0,
    } = likeStats[0] || {};

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
     const channelId = await getValidatedChannelId(req);


     const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));

    const skip = (page - 1) * limit;

    const [videos, totalVideos] = await Promise.all([
        Video.find({
            owner: channelId,
        })
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit)
            .select(
                "title thumbnail views isPublished createdAt duration"
            )
            .populate("owner", "username fullName avatar")
            .lean(),

        Video.countDocuments({
            owner: channelId,
        }),
    ]);
    const totalPages = Math.max(
        1,
        Math.ceil(totalVideos / limit)
    );

    //lean() skips creating full Mongoose document instances, reducing memory usage and improving performance for read-only endpoints.

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalVideos,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                }
            },
            "Channel videos fetched successfully"
        )
    );
})

export {
    getChannelStats, 
    getChannelVideos
}


/* 
Line 1: Calculating page

    const page = Math.max(1, Number(req.query.page) || 1);

    Number(req.query.page): Converts the incoming URL string parameter (e.g., ?page=2) into a JavaScript number.

    || 1 (Fallback): If req.query.page is missing, empty, or invalid text (which evaluates to NaN), it falls back to 1 as a default starting page.

    Math.max(1, ...) (Lower Bound Guard): Protects against negative numbers or zero (e.g., ?page=-5 or ?page=0). Math.max(1, -5) forces the result to be 1, ensuring page numbers never drop below 1. 
    
    
Line 2: Calculating limit
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));

    Number(req.query.limit) || 10: Converts the limit parameter to a number. If missing or invalid, it defaults to returning 10 items per page.

    Math.min(50, ...) (Upper Bound Cap): Prevents a malicious user or bug from requesting huge payloads (e.g., ?limit=1000000) that would overwhelm server memory. Math.min(50, 1000) caps the maximum items per request at 50.

    Math.max(1, ...) (Lower Bound Guard): Ensures the limit is at least 1, preventing 0 or negative items per page.
    

Line 3: Calculating skip
    const skip = (page - 1) * limit;

    This formula computes the index offset passed directly to your database query (.skip(skip).limit(limit) in Mongoose/MongoDB or OFFSET skip LIMIT limit in SQL).
    Mathematical Breakdown in Action:
        Assuming limit = 10:
            Page 1: (1 - 1) * 10 = 0 -> Skip 0 documents (fetch items 1–10).
            Page 2: (2 - 1) * 10 = 10 => Skip first 10 documents (fetch items 11–20).
            MongoDB first applies the sorting (createdAt: -1), then skips the first skip documents from that sorted result, and finally returns the next limit documents.
            Page 3: (3 - 1) * 10 = 20 -> Skip first 20 documents (fetch items 21–30).'

            Hinglish explanation: jab pehla page khulega top pehle 10 videos yaa items aa jaayenge phir 
                                  next page pe first 10 items ke baad ke 10 items aane chahiyeh(11-20)
                                  toh uske yeh skip formula use hua h

*/