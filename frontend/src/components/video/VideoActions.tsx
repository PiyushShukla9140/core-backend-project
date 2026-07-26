import { Bookmark, Share2} from "lucide-react";

import SaveToPlaylistDialog from "../playlist/SaveToPlaylistDialog";

import { Button } from "@/components/ui/button";

import type { Video } from "@/types/video.types";
import { LikeButton } from "../like/Likebutton";


interface VideoActionsProps {
  video: Video;
}

const VideoActions = ({ video }: VideoActionsProps) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // User cancelled share or browser blocked it.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Like */}
      <LikeButton
          video={video}
          
      />

      {/* Save */}
      <SaveToPlaylistDialog videoId={video._id}>
        <Button
          variant="secondary"
          className="rounded-full
            bg-gray-200
            hover:bg-gray-300
            transition-colors
            gap-2
            px-4
            py-2
            h-auto"
        >
          <Bookmark className="h-4 w-4" />
          Save
        </Button>
      </SaveToPlaylistDialog>

      {/* Share */}
      <Button
        variant="secondary"
        className="rounded-full
            bg-gray-200
            hover:bg-gray-300
            transition-colors
            gap-2
            px-4
            py-2
            h-auto"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
};

export default VideoActions;