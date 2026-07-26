import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import CreatePlaylistDialog from "@/components/playlist/CreatePlaylistDialog";
import PlaylistCard from "@/components/playlist/playlistCard";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import { useAppSelector } from "@/store/hooks";
import usePlaylists from "@/hooks/usePlaylists";

const Playlists = () => {
  const user = useAppSelector((state) => state.auth.user);

  const {
    playlists,
    loading,
    error,
    refetch,
  } = usePlaylists(user?._id);

  if (loading) {
    return <LoadingSpinner text="Loading playlists..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load playlists"
        message={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Your Playlists
          </h1>

          <p className="mt-2 text-muted-foreground">
            Organize your favourite videos into playlists.
          </p>
        </div>

        <CreatePlaylistDialog onSuccess={refetch}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Playlist
          </Button>
        </CreatePlaylistDialog>
      </div>

      {playlists.length === 0 ? (
        <EmptyState
          title="No playlists yet"
          description="Create your first playlist and start organizing your favourite videos."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Playlists;