import { Link } from "react-router-dom";

import type { Video } from "@/types/video.types.ts";

import {
  formatDuration,
  formatTimeAgo,
  formatViews,
} from "@/lib/video.ts";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({
  video,
}: VideoCardProps) => {
  return (
    <Link
      aria-label={`Watch ${video.title}`}
      to={`/watch/${video._id}`}
      className="group block cursor-pointer rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"> 
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Duration */}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Content */}
      <div className="mt-3 flex gap-3">
        {/* Avatar */}
        <img
          src={video.owner.avatar}
          alt={video.owner.username}
          loading="lazy"
          className="h-9 w-9 rounded-full object-cover"
        />

        {/* Text */}
        <div className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-5">
            {video.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {video.owner.fullName}
          </p>

          <p className="text-sm text-muted-foreground">
            {formatViews(video.views)} views •{" "}
            {formatTimeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;