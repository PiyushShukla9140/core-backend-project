import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api.types";
import type { Video } from "@/types/video.types";

const historyService = {
  getWatchHistory: async () => {
    const response =
      await api.get<ApiResponse<Video[]>>(
        API_ENDPOINTS.AUTH.WATCH_HISTORY
      );

    return response.data;
  },
};

export default historyService;