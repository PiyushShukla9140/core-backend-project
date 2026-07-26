import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

import { useLike } from "@/hooks/useLike";
import type { Video } from "@/types/video.types";
interface LikeButtonProps {
    video: Video
}

export const LikeButton = ({
    video
}: LikeButtonProps) => {
    const {
        _id,
        isLiked: initialLiked,
        likesCount: initialCount,
    } = video;
    const {
        isLiked,
        likesCount,
        loading,
        toggleLike,
    } = useLike({
        videoId: _id,
        initialLiked,
        initialCount,
    });

    return (
        <Button
            variant="ghost"
            disabled={loading}
            onClick={toggleLike}
            className={`
                rounded-full
                hover:bg-gray-300
                px-4
                py-2
                h-auto
                gap-2
                transition-colors
                ${
                    isLiked
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-600"
                        : "bg-gray-200 hover:bg-gray-300"
                }
            `}
        >
            <ThumbsUp
                className={`h-5 w-5 ${
                    isLiked ? "fill-current" : ""
                }`}
            />

            <span>{likesCount}</span>
        </Button>
    );
};