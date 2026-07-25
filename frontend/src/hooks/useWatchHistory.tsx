import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import historyService from "@/services/historyService";

import type { Video } from "@/types/video.types";

const useWatchHistory = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await historyService.getWatchHistory();

      setVideos(response.data ?? []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Failed to fetch watch history"
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    videos,
    loading,
    error,
    refetch: fetchHistory,
  };
};

export default useWatchHistory;