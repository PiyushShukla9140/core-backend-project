// only for the home feed where many videos will be displayed
import { useEffect, useState } from "react";

import axios from "axios";

import videoService from "@/services/videoService";

import type { Video } from "@/types/video.types";

const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response =
          await videoService.getAllVideos();

        setVideos(response.data.videos);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ??
              "Failed to fetch videos"
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
  };
};

export default useVideos;