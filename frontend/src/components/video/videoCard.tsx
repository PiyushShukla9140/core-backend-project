import { Link } from "react-router-dom";

import type { Video } from "@/types/video.types";

import {
  formatDuration,
  formatTimeAgo,
  formatViews,
} from "@/lib/video";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <div
      className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Thumbnail */}
      <Link
        to={`/watch/${video._id}`}
        aria-label={`Watch ${video.title}`}
        className="block overflow-hidden rounded-xl"
      >
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
            {formatDuration(video.duration)}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="mt-3 flex gap-3">
        {/* Avatar */}
        <Link to={`/channel/${video.owner.username}`}>
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            loading="lazy"
            className="h-9 w-9 rounded-full object-cover"
          />
        </Link>

        <div className="flex-1">
          {/* Title */}
          <Link
            to={`/watch/${video._id}`}
            className="block"
          >
            <h3 className="line-clamp-2 text-sm font-semibold leading-5 hover:underline">
              {video.title}
            </h3>
          </Link>

          {/* Channel */}
          <Link
            to={`/channel/${video.owner.username}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            {video.owner.fullName}
          </Link>

          <p className="text-sm text-muted-foreground">
            {formatViews(video.views)} views •{" "}
            {formatTimeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;