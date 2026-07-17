
import VideoGrid from "@/components/video/videoGrid";
import VideoSkeleton from "@/components/video/videoSkeleton";
import useVideos from "@/hooks/useVideo";


const Home = () => {
     const {
        videos,
        loading,
        error,
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
            <div className="p-6 text-red-500">
                {error}
            </div>
        );
    }

    return (
       <main>
        <div className="mx-auto max-w-7xl px-6 py-8">
            <h1 className="mb-8 3xl font-bold tracking-tight">
                Home feed
            </h1>
        </div>
         <VideoGrid videos={videos} />
       </main>
         
    );
};

export default Home;