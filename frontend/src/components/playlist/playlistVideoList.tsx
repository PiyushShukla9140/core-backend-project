import type { Playlist } from "@/types/playlist.types";


import EmptyState from "@/components/common/EmptyState";
import VideoCard from "@/components/video/videoCard";
import RemoveVideoButton from "./RemoveVideoFromPlaylist";

interface PlaylistVideoListProps {
  playlist: Playlist;
  
  refetch: () => Promise<void>;
}

const PlaylistVideoList = ({
  playlist,
  
  refetch,
}: PlaylistVideoListProps) => {
  
  if (playlist.videos.length === 0) {
    return (
      <EmptyState
        title="No videos in this playlist"
        description="Add videos to start building your playlist."
      />
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        Videos
      </h2>

      <div
        className="
          grid
          gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {playlist.videos.map((video) => (
            <div
                key={video._id}
                className="relative"
            >
                <VideoCard video={video} />

                <div className="absolute top-3 right-3">
                    <RemoveVideoButton
                        playlistId={playlist._id}
                        videoId={video._id}
                        onSuccess={refetch}
                    />
                </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default PlaylistVideoList;