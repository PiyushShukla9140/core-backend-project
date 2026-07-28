import { Link } from "react-router-dom";

import { useLikedVideos } from "@/hooks/useLikedVideos.tsx";

import VideoCard from "@/components/video/videoCard";
import  LoadingSpinner from "@/components/common/LoadingSpinner";
import  ErrorState from "@/components/common/ErrorState";
import  EmptyState from "@/components/common/EmptyState";

const LikedVideos = () => {
    const {
        likedVideos,
        loading,
        error,
        refetch,
    } = useLikedVideos();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <ErrorState
                title="Failed to load liked videos"
                message={error}
                onRetry={refetch}
            />
        );
    }

    if (likedVideos.length === 0) {
        return (
            <EmptyState
                title="No liked videos"
                description="Videos you like will appear here."
            />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Liked Videos
                </h1>

                <p className="text-muted-foreground mt-2">
                    {likedVideos.length} videos
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {likedVideos.map(({ video }) => (
                    <Link
                        key={video._id}
                        to={`/watch/${video._id}`}
                    >
                        <VideoCard video={video} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LikedVideos;