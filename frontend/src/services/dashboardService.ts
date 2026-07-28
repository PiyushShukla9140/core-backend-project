import api from "@/api/axios";

const dashboardService = {
  async getChannelStats() {
    const response = await api.get("/dashboard/stats");
    return response.data.data;
  },

  async getChannelVideos(
    page: number = 1,
    limit: number = 10
  ) {
    const response = await api.get("/dashboard/videos", {
      params: {
        page,
        limit,
      },
    });

    return response.data.data;
  },
  async deleteVideo(videoId: string) {
    const response = await api.delete(
        `/videos/${videoId}`
    );

    return response.data.data;
  },

  async togglePublishStatus(videoId: string) {
      const response = await api.patch(
          `/videos/toggle/publish/${videoId}`
      );

      return response.data.data;
  },

  async updateVideo(
      videoId: string,
      formData: FormData
  ) {
      const response = await api.patch(
          `/videos/${videoId}`,
          formData
      );

      return response.data.data;
  },
};

export default dashboardService;