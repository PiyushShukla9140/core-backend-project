import { formatTimeAgo, formatViews } from "@/lib/video";

import VideoActions from "./VideoActions";

import type { Video } from "@/types/video.types";

interface VideoHeaderProps {
  video: Video;
}

const VideoHeader = ({ video }: VideoHeaderProps) => {
  return (
    <div className="space-y-4">
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        {video.title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Views & Date */}
        <div className="rounded-xl bg-muted px-4 py-3">
          <p className="text-sm font-medium text-muted-foreground">
            {formatViews(video.views)} views •{" "}
            {formatTimeAgo(video.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <VideoActions video={video} />
      </div>
    </div>
  );
};

export default VideoHeader;