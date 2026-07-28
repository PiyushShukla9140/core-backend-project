import { useCallback, useEffect, useState } from "react";

import authService from "@/services/authService";

import type { User } from "@/types/user.types";

const useCurrentUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.getCurrentUser();

            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch current user:", error);

            setError("Failed to fetch current user.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return {
        user,
        loading,
        error,
        refetch: fetchCurrentUser,
    };
};

export default useCurrentUser;