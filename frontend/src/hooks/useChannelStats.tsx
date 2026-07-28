import { useCallback, useEffect, useState } from "react";
import dashboardService from "@/services/dashboardService";
import type { ChannelStats } from "@/types/dashboard.types";

export const useChannelStats = () => {
    const [stats, setStats] = useState<ChannelStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await dashboardService.getChannelStats();

            setStats(data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    "Failed to fetch channel statistics"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats,
    };
};