import { ThumbsUp,Share2 } from "lucide-react";

import { formatTimeAgo,formatViews } from "@/lib/video";

interface VideoInfoProps{
    title:string,
    createdAt:string,
    views:number,
   
}


const VideoHeader = (
    {
        title,
        createdAt,
        views,
        
    }:VideoInfoProps
)=>{
    return(
        <div className="space-y-4">
            <h1 className="mt-4 text-3xl font-bold tracking-tight">
                {title}
            </h1>
            {/* now a div which would include the like share and created at info */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* a paragraph element for the formatTimeAgo */}
                <div className="rounded-xl bg-gray-100 p-4">
                     <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                        <p className="text-sm text-muted-foreground">
                            {formatViews(views)} views •{" "}
                            {formatTimeAgo(createdAt)}
                        </p>
                     </div>
                   
                </div>
                
               

                {/* a div for both the buttons (share and like) */}
                <div className="flex items-center gap-3">
                    <button className="
                    flex items-center gap-2 rounded-full bg-gray-300 px-4 py-2
                    text-sm transition-colors hover:bg-muted/80
                    ">
                        <ThumbsUp size={18} />
                         Like
                    </button>


                    <button className="
                    flex items-center gap-2 rounded-full bg-gray-300 px-4 py-2
                    text-sm transition-colors hover:bg-muted/80
                    ">
                        <Share2 size={18}/>
                        Share
                    </button>
                </div>
                
            </div>
        </div>
    )
}

export default VideoHeader