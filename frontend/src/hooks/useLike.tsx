import { useState } from "react";
import { toast } from "sonner";

import { likeService } from "@/services/likeService";

interface UseLikeProps {
    videoId: string;
    initialLiked: boolean;
    initialCount: number;
}

export const useLike = ({
    videoId,
    initialLiked,
    initialCount,
}: UseLikeProps) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const toggleLike = async () => {
        if (loading) return;

        setLoading(true);

        // Save previous state for rollback
        const previousLiked = isLiked;
        const previousCount = likesCount;

        // Optimistic UI update
        setIsLiked(!previousLiked);
        setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

        try {
            const response = await likeService.toggleVideoLike(videoId);

            setIsLiked(response.data.isLiked);
            setLikesCount(response.data.likesCount);

            toast.success(response.message);
        } catch (error: any) {
            // Rollback
            setIsLiked(previousLiked);
            setLikesCount(previousCount);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to update like."
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        isLiked,
        likesCount,
        loading,
        toggleLike,
    };
};