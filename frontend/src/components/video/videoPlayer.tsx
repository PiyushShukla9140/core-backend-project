 interface videoPlayerProps{
    videoUrl:string;
    thumbnail?:string;
 }

 const VideoPlayer = ({
    videoUrl,thumbnail
 }:videoPlayerProps)=>{
    return(
        <video
            controls
            poster={thumbnail}
            className="aspect-video w-full rounded-xl bg-black"
        >
        <source
            src={videoUrl}
            type="video/mp4"
        />

        Your browser does not support the video tag.
    </video>
    )
 }

 export default VideoPlayer
 // this video tag is part of html 5, if the browser does not support this video tag
 // therefore we have written Your browser does not support the video tag.