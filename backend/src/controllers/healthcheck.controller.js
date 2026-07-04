import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                status: "healthy",
                "data": {
                "status": "healthy",
                "database": "connected",
                "uptime": 3520,
                "timestamp": "2026-06-30T10:30:00.000Z"
    },
                uptime: process.uptime()
            },
            "Server is up and running smoothly"
        )
    );
})

export {
    healthcheck
    }
    