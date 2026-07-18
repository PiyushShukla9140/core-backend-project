import { Link } from "react-router-dom";

import { formatTimeAgo, formatViews } from "@/lib/video";
import type { Video } from "@/types/video.types"
interface SugestedVideoCardProps{
    video:Video
}

const SuggestedVideoCard = (
    {video}:SugestedVideoCardProps
)=>{
    return(
        <Link
        to={`/watch/${video._id}`}
        className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
        >
        <img
        src={video.thumbnail}
        alt={video.title}
        className="
          aspect-video
          w-40
          rounded-lg
          object-cover
          transition-transform
          duration-300
          group-hover:scale-[1.02]"
        />
        <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold">
                {video.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
                {video.owner.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
                {formatViews(video.views)}views  •{" "}
                {formatTimeAgo(video.createdAt)}
            </p>
        </div>

        </Link>
    )
}

export default SuggestedVideoCard