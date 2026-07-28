import { useCallback, useEffect, useState } from "react";

import { likeService } from "@/services/likeService";
import type { LikedVideo } from "@/types/like.types";

export const useLikedVideos = () => {
    const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLikedVideos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await likeService.getLikedVideos();

            setLikedVideos(response.data);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ??
                    "Failed to fetch liked videos."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLikedVideos();
    }, [fetchLikedVideos]);

    return {
        likedVideos,
        loading,
        error,
        refetch: fetchLikedVideos,
    };
};