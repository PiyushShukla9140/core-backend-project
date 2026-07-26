import api from "@/api/axios";
import type { ApiResponse } from "@/types/api.types";
import type {
    LikedVideo,
    ToggleLikeResponse,
} from "@/types/like.types";

class LikeService {
    async toggleVideoLike(
        videoId: string
    ): Promise<ApiResponse<ToggleLikeResponse>> {
        const response = await api.post<ApiResponse<ToggleLikeResponse>>(
            `/likes/toggle/v/${videoId}`
        );

        return response.data;
    }

    async getLikedVideos(): Promise<ApiResponse<LikedVideo[]>> {
        const response = await api.get<ApiResponse<LikedVideo[]>>(
            "/likes/videos"
        );

        return response.data;
    }
}

export const likeService = new LikeService();