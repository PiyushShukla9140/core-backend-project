import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api.types";
import type { PublishVideoPayload } from "@/types/video.types";

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
    createVideo: async (data: PublishVideoPayload,onProgress?: (progress: number) => void) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail);
    formData.append("videoFile", data.videoFile);

    const response = await api.post(
      API_ENDPOINTS.VIDEOS.CREATE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          onProgress?.(progress);
        },
      }
    );

    return response.data;
  },
}

export default videoService