import { useParams } from "react-router-dom";

import { useChannel } from "@/hooks/useChannel";
import { useChannelVideos } from "@/hooks/useChannelVideos";

import LoadingSpinner  from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";

// Components (we'll build these next)
import { ChannelBanner } from "@/components/channel/channelBanner";
import { ChannelHeader } from "@/components/channel/channelHeader";
import  ChannelVideos  from "@/components/channel/channelVideos";

const Channel = () => {
    const { username } = useParams<{ username: string }>();

    if (!username) {
        return (
            <ErrorState
                title="Invalid Channel"
                message="Channel username is missing."
            />
        );
    }

    const {
        channel,
        loading: channelLoading,
        error: channelError,
        refetch: refetchChannel,
    } = useChannel(username);

    const {
        videos,
        loading: videosLoading,
        error: videosError,
        refetch: refetchVideos,
    } = useChannelVideos(username);

    if (channelLoading || videosLoading) {
        return <LoadingSpinner />;
    }

    if (channelError || videosError) {
        return (
            <ErrorState
                title="Failed to load channel"
                message={channelError ?? videosError ?? ""}
                onRetry={() => {
                    refetchChannel();
                    refetchVideos();
                }}
            />
        );
    }

    if (!channel) {
        return (
            <ErrorState
                title="Channel not found"
                message="The requested channel does not exist."
            />
        );
    }

    return (
        <div className="space-y-8">
            <ChannelBanner
                coverImage={channel.coverImage}
            />

            <ChannelHeader
                channel={channel}
            />

            <ChannelVideos
                videos={videos}
            />
        </div>
    );
};

export default Channel;