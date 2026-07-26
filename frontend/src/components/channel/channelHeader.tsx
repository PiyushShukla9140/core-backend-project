import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { SubscribeButton } from "./subscribeButton";

import type { Channel } from "@/types/channel.types";

interface ChannelHeaderProps {
    channel: Channel;
}

export const ChannelHeader = ({
    channel,
}: ChannelHeaderProps) => {
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
                        {channel.subscribersCount} Subscribers •{" "}
                        {channel.channelsSubscribedToCount} Following
                    </p>
                </div>
            </div>

            <SubscribeButton
                channelId={channel._id}
                initialSubscribed={channel.isSubscribed}
            />
        </div>
    );
}