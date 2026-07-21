import { UploadCloud } from "lucide-react";

const UploadHeader = ()=>{
    return(
        <div className="mb-10 flex itmes-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 ">
                <UploadCloud className="h7 w-7 text-primary"/>
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Upload video
                </h1>

                <p className="mt-1 text-muted-foreground">
                    Share your content with the community.
                </p>
            </div>
        </div>
    )
}

export default UploadHeader