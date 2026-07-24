
import VideoGrid from "@/components/video/videoGrid";
import VideoSkeleton from "@/components/video/videoSkeleton";
import useVideos from "@/hooks/useVideos";

import ErrorState from "@/components/common/ErrorState";


const Home = () => {
     const {
        videos,
        loading,
        error,
        refetch
    } = useVideos();


    if(loading){
        return (
            <div className="p-8">
                <VideoSkeleton/>
            </div>
        )
    }
    if (error) {
        return ( 
            <ErrorState
              message={error}
              onRetry={refetch}
            />
        );
    }

    return (
       <main>
         <VideoGrid videos={videos} />
       </main>
         
    );
};

export default Home;