import { Link } from "react-router-dom";
import { FolderOpen, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import type { Playlist } from "@/types/playlist.types";

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const thumbnail = playlist.videos?.[0]?.thumbnail;

  return (
    <Link
      to={`/playlists/${playlist._id}`}
      className="group block overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={playlist.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FolderOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
          <Play className="h-3 w-3 fill-white" />
          {playlist.videos.length}
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h2 className="line-clamp-1 text-lg font-semibold">
          {playlist.name}
        </h2>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {playlist.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{playlist.videos.length} videos</span>

          <span>
            {formatDistanceToNow(new Date(playlist.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;