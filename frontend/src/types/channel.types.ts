import type { Video } from "./video.types";

export interface Channel {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    avatar: string;
    coverImage: string;

    subscribersCount: number;
    channelsSubscribedToCount: number;

    isSubscribed: boolean;
}

export interface Subscriber {
    subscribedAt: string;

    subscriber: {
        _id: string;
        username: string;
        fullName: string;
        avatar: string;
    };
}

export interface SubscribedChannel {
    subscribedAt: string;

    channel: {
        _id: string;
        username: string;
        fullName: string;
        avatar: string;
    };
}

export type ChannelVideo = Video;