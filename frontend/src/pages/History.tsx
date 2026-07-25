import VideoGrid from "@/components/video/videoGrid";
import VideoSkeleton from "@/components/video/videoSkeleton";
import ErrorState from "@/components/common/ErrorState";

import useWatchHistory from "@/hooks/useWatchHistory";

const History = () => {
  const {
    videos,
    loading,
    error,
    refetch,
  } = useWatchHistory();

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
        onRetry={refetch}
      />
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">
          Your watch history is empty.
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Watch History
        </h1>

        <p className="text-muted-foreground mt-2">
          Videos you've watched recently.
        </p>
      </div>

      <VideoGrid videos={videos} />
    </main>
  );
};

export default History;