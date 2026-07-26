import type { Video } from "./video.types";

export interface ToggleLikeResponse {
    isLiked: boolean;
    likesCount: number;
}

export interface LikedVideo {
    _id: string;
    likedAt: string;
    video: Video;
}