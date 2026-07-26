import { useCallback, useEffect, useState } from "react";

import playlistService from "@/services/playlistService";

import type { Playlist } from "@/types/playlist.types";

const usePlaylist = (playlistId?: string) => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylist = useCallback(async () => {
    /* Wrapped in useCallback so the function reference isn't re-created on every render unless playlistId changes.
    Early Guard Clause: If no playlistId is provided, it resets the playlist to null, stops loading, and exits early without making an unnecessary network request.
    if we wont use useCallback it would get stuck in the infint loop */
    if (!playlistId) {
      setPlaylist(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await playlistService.getPlaylistById(playlistId);

      setPlaylist(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch playlist"
      );
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    void fetchPlaylist();
  }, [fetchPlaylist]);
/* Automatically triggers fetchPlaylist() when the component loads (Mounting) or whenever fetchPlaylist changes (which happens when playlistId changes).

The void keyword explicitly tells TypeScript/ESLint that we are intentionally invoking an asynchronous function inside useEffect without awaiting its return value directly inside the hook body. */

  return {
    playlist,
    loading,
    error,
    refetch: fetchPlaylist,
  };
};

export default usePlaylist;