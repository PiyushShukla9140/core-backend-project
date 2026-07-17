import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

interface channelCardProps{
    channelName:string;
    avatar:string;
    username:string;
    // later add subscriberCount and isSubscribed
}

const ChannelCard = (
    {
        channelName,
        avatar,
        username
    }:channelCardProps
)=>{
    return(
        <div className="flex items-center justify-between rounded-xl border px-6 py-5">
            <div className="flex items-center gap-4">
                <Avatar className="h-14 w-15">
                    <AvatarImage src={avatar} alt={channelName} />
                    <AvatarFallback>
                        {channelName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                     <h3 className="font-semibold">
                        {channelName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        @{username}
                    </p>
                </div>

            </div>
            <Button className="rounded-full">
                Subscribe
            </Button>
        </div>
    )
}

export default ChannelCard
