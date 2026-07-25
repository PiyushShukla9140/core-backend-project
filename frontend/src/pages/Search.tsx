import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";

import videoService from "@/services/videoService";

import VideoGrid from "@/components/video/videoGrid";
import VideoSkeleton from "@/components/video/videoSkeleton";
import ErrorState from "@/components/common/ErrorState";

import type { Video } from "@/types/video.types";

function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q")?.trim() ?? "";

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSearchResults = async () => {
    if (!query) {
      setVideos([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await videoService.getAllVideos({
        query,
      });

      setVideos(response.data.videos);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Failed to fetch search results."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="p-8">
        <VideoSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchSearchResults}
      />
    );
  }

  if (!query) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-muted-foreground">
          Enter a search term to find videos.
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-muted-foreground">
          No videos found for "{query}"
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <div>

        <p className="text-muted-foreground mt-2">
          Results for "{query}"
        </p>
      </div>

      <VideoGrid videos={videos} />
    </main>
  );
}

export default Search;