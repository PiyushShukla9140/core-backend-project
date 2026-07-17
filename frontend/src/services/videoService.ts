import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api.types";

import type { Video,GetVideosResponse, } from "@/types/video.types";

const videoService = {
    getAllVideos: async (params?:{
        page?: number;
        limit?: number;
        query?: string;
        sortBy?: string;
        sortType?: "asc" | "desc";
        userId?: string;
    })=>{
        const response =
        await api.get<ApiResponse<GetVideosResponse>>(
            API_ENDPOINTS.VIDEOS.GET_ALL,
            {
            params,
            }
        );

        return response.data;
    },
    getVideoById: async (videoId: string) => {
    const response =
      await api.get<ApiResponse<Video>>(
        API_ENDPOINTS.VIDEOS.GET_BY_ID(videoId)
      );

    return response.data;
  },
}

export default videoService