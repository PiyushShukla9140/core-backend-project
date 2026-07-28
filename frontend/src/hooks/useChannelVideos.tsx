import { useCallback, useEffect, useState } from "react";

import { channelService } from "@/services/channelService";
import type { ChannelVideo } from "@/types/channel.types";

export const useChannelVideos = (username: string) => {
    const [videos, setVideos] = useState<ChannelVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await channelService.getChannelVideos(username);

            setVideos(response.data);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ??
                    "Failed to fetch channel videos."
            );
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            fetchVideos();
        }
    }, [username, fetchVideos]);

    return {
        videos,
        loading,
        error,
        refetch: fetchVideos,
    };
};