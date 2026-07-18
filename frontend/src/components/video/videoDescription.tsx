interface VideoDescriptionProps{
    description:string
}
const VideoDescription=(
    {
        description
    }:VideoDescriptionProps
)=>{
    if (!description.trim()) {
        return null;
    }
    return(
        <div className="rounded-xl border bg-gray-200 p-5">
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                {description}
            </p>
        </div>
    )
}

export default VideoDescription