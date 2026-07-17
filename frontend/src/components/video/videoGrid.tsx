import type { Video } from "@/types/video.types";

import VideoCard from "./videoCard.tsx";

interface VideoGridProps {
  videos: Video[];
}

const VideoGrid = ({
  videos,
}: VideoGridProps) => {
    // If there are no videos uploaded then 
    if (videos.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">
                    No videos yet
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                    Upload your first video to get started.
                    </p>
                </div>
            </div>
        );
    }
  return (
    <section
      className="
        grid
        gap-6

        grid-cols-1  

        sm:grid-cols-2

        lg:grid-cols-3

        xl:grid-cols-4
      "
    >
    {/* these grid columns are used for different screen sizes
    for mobile only 1 video in each column
    for tablet two video in each column */}
      {videos.map((video) => (
        <VideoCard 
          key={video._id}
          video={video}
        />
      ))}
    </section>
  );
};

export default VideoGrid;