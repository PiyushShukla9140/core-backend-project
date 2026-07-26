import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

interface ChannelCardProps {
    channelName: string;
    avatar: string;
    username: string;
    // later:
    // channelId: string;
    // isSubscribed: boolean;
    // subscriberCount: number;
}

const ChannelCard = ({
    channelName,
    avatar,
    username,
}: ChannelCardProps) => {
    return (
        <div className="flex items-center justify-between rounded-xl border px-6 py-5">
            <Link
                to={`/channel/${username}`}
                className="flex items-center gap-4 rounded-lg transition-opacity hover:opacity-90"
            >
                <Avatar className="h-14 w-14">
                    <AvatarImage
                        src={avatar}
                        alt={channelName}
                    />

                    <AvatarFallback>
                        {channelName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <h3 className="font-semibold hover:underline">
                        {channelName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        @{username}
                    </p>
                </div>
            </Link>

            <Button className="rounded-full">
                Subscribe
            </Button>
        </div>
    );
};

export default ChannelCard;