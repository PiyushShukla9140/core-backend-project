import { useEffect, useState } from "react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { SubscribeButton } from "./subscribeButton";

import type { Channel } from "@/types/channel.types";

interface ChannelHeaderProps {
    channel: Channel;
}

export const ChannelHeader = ({
    channel,
}: ChannelHeaderProps) => {
    const [isSubscribed, setIsSubscribed] = useState(
        channel.isSubscribed
    );

    const [subscribersCount, setSubscribersCount] = useState(
        channel.subscribersCount
    );

    useEffect(() => {
        setIsSubscribed(channel.isSubscribed);
        setSubscribersCount(channel.subscribersCount);
    }, [channel]);

    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
                <Avatar className="h-24 w-24">
                    <AvatarImage
                        src={channel.avatar}
                        alt={channel.fullName}
                    />

                    <AvatarFallback>
                        {channel.fullName
                            .charAt(0)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">
                        {channel.fullName}
                    </h1>

                    <p className="text-muted-foreground">
                        @{channel.username}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {subscribersCount} Subscribers •{" "}
                        {channel.channelsSubscribedToCount} Following
                    </p>
                </div>
            </div>

            <SubscribeButton
                channelId={channel._id}
                isSubscribed={isSubscribed}
                setIsSubscribed={setIsSubscribed}
                setSubscribersCount={setSubscribersCount}
            />
        </div>
    );
};

export default ChannelHeader;