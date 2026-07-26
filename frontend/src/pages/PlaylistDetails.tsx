import { useParams } from "react-router-dom";

import usePlaylist from "@/hooks/usePlaylist";

import PlaylistHeader from "@/components/playlist/playlistHeader";
import PlaylistVideoList from "@/components/playlist/playlistVideoList";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";

const PlaylistDetail = () => {
  const { playlistId } = useParams();

  const {
    playlist,
    loading,
    error,
    refetch,
  } = usePlaylist(playlistId);

  if (loading) {
    return <LoadingSpinner text="Loading playlist..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load playlist"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!playlist) {
    return (
      <EmptyState
        title="Playlist not found"
        description="The playlist you're looking for doesn't exist."
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <PlaylistHeader 
      playlist={playlist} 
      refetch={refetch}/>

      <PlaylistVideoList
        playlist={playlist}
        refetch={refetch}
      />
    </div>
  );
};

export default PlaylistDetail;