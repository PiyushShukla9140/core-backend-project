import { useCallback, useEffect, useState } from "react";

import playlistService from "@/services/playlistService";

import type { Playlist } from "@/types/playlist.types";

export const usePlaylists = (userId?: string) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    if (!userId) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await playlistService.getUserPlaylists(userId);

      setPlaylists(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch playlists"
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchPlaylists();
  }, [fetchPlaylists]);

  return {
    playlists,
    loading,
    error,
    refetch: fetchPlaylists,
  };
};

export default usePlaylists;