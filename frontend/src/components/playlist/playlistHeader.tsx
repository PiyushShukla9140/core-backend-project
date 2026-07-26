import { CalendarDays, Play, Trash2, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import type { Playlist } from "@/types/playlist.types";

import { Button } from "@/components/ui/button";
import EditPlaylistDialog from "./EditPlaylistDialog";
import DeletePlaylistDialog from "./DeletePlaylistDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PlaylistHeaderProps {
  playlist: Playlist;
  refetch: () => void;
}

const PlaylistHeader = ({ playlist, refetch }: PlaylistHeaderProps) => {
  const thumbnail = playlist.videos?.[0]?.thumbnail;
  const navigate = useNavigate();

  const handlePlayAll = () => {
    if (playlist.videos.length === 0) {
      toast.error("This playlist has no videos.");
      return;
    }

    navigate(`/watch/${playlist.videos[0]._id}`);
  };

  return (
    <div className="flex flex-col gap-8 rounded-xl border bg-card p-6 shadow-sm lg:flex-row">
      {/* Playlist Cover */}
      <div className="w-full lg:w-80">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={playlist.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Play className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-sm text-white">
            {playlist.videos.length} videos
          </div>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Playlist
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {playlist.name}
          </h1>

          <p className="mt-4 max-w-3xl text-muted-foreground">
            {playlist.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">
                {playlist.videos.length}
              </strong>{" "}
              videos
            </span>

            <span>
              By{" "}
              <strong className="text-foreground">
                {playlist.owner.fullName}
              </strong>
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {formatDistanceToNow(
                new Date(playlist.createdAt),
                { addSuffix: true }
              )}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={handlePlayAll} disabled={playlist.videos.length === 0}>
            <Play className="mr-2 h-4 w-4 fill-current" />
            Play All
          </Button>

          <EditPlaylistDialog
            playlist={playlist}
            onSuccess={refetch}
          >
            <Button variant="outline" size="lg">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </EditPlaylistDialog>

          <DeletePlaylistDialog playlist={playlist}>
            <Button variant="destructive" size="lg">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </Button>
        </DeletePlaylistDialog>

         
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;