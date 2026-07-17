import { useParams } from "react-router-dom"
import useVideo from "@/hooks/useVideo"
import VideoPlayer from "@/components/video/videoPlayer"
import VideoInfo from "@/components/video/videoInfo"
import ChannelCard from "@/components/video/channelCard"
const  Watch = ()=> {
  const{videoId} = useParams()

  const{video, loading, error} = useVideo(videoId!)

  if(loading){
    return(
      <div className="mx-auto max-w-7xl px-6 py-8">
        Loading....
      </div>
    )
  }

  if(error){
    return(
      <div className="mx-auto max-w-7xl px-6 py-8 text-red-500">
        {error}
      </div>
    )
  }

  if(!video){
    return(
      <div className="mx-auto max-w-7xl px-6 py-8 text-red-500">
        Video not found
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div>
        {/* left side */}
        <div className="space-y-4">
          <VideoPlayer
          videoUrl={video.videoFile}
          thumbnail={video.thumbnail}
        />
        {/* video info */}
        <VideoInfo
          title={video.title}
          views={video.views}
          createdAt={video.createdAt}
          description={video.description}
        />
        {/* channel Card */}
        <ChannelCard
          avatar={video.owner.avatar}
          channelName={video.owner.fullName}
          username={video.owner.username}
        />
        {/* comments */}
        </div>

        {/* right side */}
        <aside>
          {/* suggested videos */}
        </aside>
      </div>
    </div>
  )
}

export default Watch