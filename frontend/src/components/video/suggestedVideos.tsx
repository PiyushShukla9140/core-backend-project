import SuggestedVideoCard from "./suggestedVideoCard";

import type { Video } from "@/types/video.types";

interface SuggestedVideosProps {
  videos: Video[];
  currentVideoId: string;
}
// we need to find those video whose video does not match the video whcih is currently played by the video player
const SuggestedVideos = ({
  videos,
  currentVideoId,
}: SuggestedVideosProps) => {
  const suggestedVideos = videos.filter(
    (video) => video._id !== currentVideoId
  );

  return (
    <aside className="space-y-2">
      {suggestedVideos.map((video) => (
        <SuggestedVideoCard
          key={video._id}
          video={video}
        />
      ))}
    </aside>
  );
};

export default SuggestedVideos;