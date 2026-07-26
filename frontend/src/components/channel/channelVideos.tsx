import  EmptyState from "@/components/common/EmptyState";
import VideoCard from "@/components/video/videoCard";

import type{ ChannelVideo } from "@/types/channel.types";

interface ChannelVideosProps {
    videos: ChannelVideo[];
}

const ChannelVideos = ({
    videos,
}: ChannelVideosProps) => {
    if (videos.length === 0) {
        return (
            <EmptyState
                title="No videos"
                description="This channel hasn't uploaded any videos yet."
            />
        );
    }

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold">
                Videos
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videos.map((video) => (
                    <VideoCard
                        key={video._id}
                        video={video}
                    />
                ))}
            </div>
        </section>
    );
};

export default ChannelVideos;