import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { SubscribeButton } from "../channel/subscribeButton"; //

interface ChannelCardProps {
    channelName: string;
    avatar: string;
    username: string;
    
    channelId: string;
    isSubscribed: boolean;
    subscribersCount: number;
}

const ChannelCard = ({
    channelName,
    avatar,
    username,
    channelId,
    isSubscribed,
    subscribersCount
}: ChannelCardProps) => {
    const currentUser = useAppSelector(
        (state) => state.auth.user
    );

    const isOwnChannel = currentUser?._id === channelId;

    const [subscribed, setSubscribed] = useState(isSubscribed);

    const [count, setCount] = useState(subscribersCount);

    useEffect(() => {
        setSubscribed(isSubscribed);
        setCount(subscribersCount);
    }, [isSubscribed, subscribersCount]);
    
    return (
        <div className="flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
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
                    <p className="text-xs text-muted-foreground">
                        {count.toLocaleString()} subscribers
                    </p>
                </div>
            </Link>

            {!isOwnChannel && (
                <SubscribeButton
                    channelId={channelId}
                    isSubscribed={subscribed}
                    setIsSubscribed={setSubscribed}
                    setSubscribersCount={setCount}
                />
            )}
        </div>
    );
};

export default ChannelCard;