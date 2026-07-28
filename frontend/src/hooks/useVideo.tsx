import { useEffect, useState } from "react";

import axios from "axios";

import videoService from "@/services/videoService";

import type { Video } from "@/types/video.types";

const useVideo = (videoId: string) => {
  const [video, setVideo] = useState<Video | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const fetchVideo = async () => {
      try {
        setLoading(true)
        setError("")
        const response =
          await videoService.getVideoById(
            videoId
          );

        setVideo(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ??
              "Failed to fetch video"
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!videoId) return;
    fetchVideo();
  }, [videoId]);
  // as child component me videoId pass ho rha, fetch video nhi, isliye useCallback is not needed here

  return {
    video,
    loading,
    error,
    refetch:fetchVideo,
  };
};

export default useVideo;