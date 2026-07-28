import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import dashboardService from "@/services/dashboardService";
import type { ChannelVideosResponse } from "@/types/dashboard.types";

export const useDashboardVideos = (
    page: number,
    limit: number = 10
) => {
    const [data, setData] = useState<ChannelVideosResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await dashboardService.getChannelVideos(
                page,
                limit
            );

            setData(data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ??
                        "Failed to fetch dashboard videos."
                );
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    return {
        data,
        loading,
        error,
        refetch: fetchVideos,
    };
};