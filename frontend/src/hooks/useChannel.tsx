import { useCallback, useEffect, useState } from "react";

import { channelService } from "@/services/channelService";
import type { Channel } from "@/types/channel.types";

export const useChannel = (username: string) => {
    const [channel, setChannel] = useState<Channel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChannel = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

             


            const response = await channelService.getChannel(username);

            setChannel(response.data);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ??
                    "Failed to fetch channel."
            );
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            fetchChannel();
        }
    }, [username, fetchChannel]);

    return {
        channel,
        loading,
        error,
        refetch: fetchChannel,
    };
};