import { useParams } from "react-router-dom"
import useVideo from "@/hooks/useVideo"
import VideoPlayer from "@/components/video/videoPlayer"
import VideoHeader from "@/components/video/videoHeader"
import ChannelCard from "@/components/video/channelCard"
import VideoDescription from "@/components/video/videoDescription"
import SuggestedVideos from "@/components/video/suggestedVideos"
import useVideos from "@/hooks/useVideos"
const  Watch = ()=> {
  const{videoId} = useParams()

  const{video, loading, error} = useVideo(videoId!)
  const {
      videos,
  } = useVideos();

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
    <div className="mx-auto max-w-[1700px] px-6 py-8">
      <div className="grid grid-cols-3 gap-8">
        {/* This above grid tailwind is temporary */}
        {/* left side */}
        <div className="space-y-5 lg:col-span-2">
          <VideoPlayer
          videoUrl={video.videoFile}
          thumbnail={video.thumbnail}
        />
        {/* video header */}
        <VideoHeader
          title={video.title}
          views={video.views}
          createdAt={video.createdAt}
        />
        {/* video description */}
        <VideoDescription
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
        <aside  className="lg:sticky lg:top-24">
          <SuggestedVideos
          videos={videos} 
          currentVideoId={video._id} 
          />
        </aside>
      </div>
    </div>
  )
}

export default Watch