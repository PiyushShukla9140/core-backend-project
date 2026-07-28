import { Bookmark, Share2 } from "lucide-react";
import { useState } from "react";

import SaveToPlaylistDialog from "../playlist/SaveToPlaylistDialog";
import ShareVideoDialog from "./shareVideoDialog";

import { Button } from "@/components/ui/button";
import { share } from "@/lib/share";

import type { Video } from "@/types/video.types";
import { LikeButton } from "../like/Likebutton";

interface VideoActionsProps {
    video: Video;
}

const VideoActions = ({ video }: VideoActionsProps) => {
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

    const videoUrl = `${window.location.origin}/watch/${video._id}`;

    const handleShare = async () => {
        const result = await share({
            title: video.title,
            text: video.description,
            url: videoUrl,
        });

        if (result === "unsupported") {
            setIsShareDialogOpen(true);
        }
    };

    return (
        <>
            <div className="flex flex-wrap items-center gap-3">
                {/* Like */}
                <LikeButton video={video} />

                {/* Save */}
                <SaveToPlaylistDialog videoId={video._id}>
                    <Button
                        variant="secondary"
                        className="
                            rounded-full
                            bg-gray-200
                            hover:bg-gray-300
                            transition-colors
                            gap-2
                            px-4
                            py-2
                            h-auto
                        "
                    >
                        <Bookmark className="h-4 w-4" />
                        Save
                    </Button>
                </SaveToPlaylistDialog>

                {/* Share */}
                <Button
                    variant="secondary"
                    className="
                        rounded-full
                        bg-gray-200
                        hover:bg-gray-300
                        transition-colors
                        gap-2
                        px-4
                        py-2
                        h-auto
                    "
                    onClick={handleShare}
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </div>

            <ShareVideoDialog
                url={videoUrl}
                open={isShareDialogOpen}
                onOpenChange={setIsShareDialogOpen}
            />
        </>
    );
};

export default VideoActions;