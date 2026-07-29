import api from "@/api/axios";

import type {
    Channel,
    ChannelVideo,
    Subscriber,
    SubscribedChannel,
} from "@/types/channel.types";

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

export const channelService = {
    async getChannel(username: string) {
       
        const response = await api.get<ApiResponse<Channel>>(
            `/users/c/${username}`
        );

        return response.data;
    },

    async getChannelVideos(username: string) {
        const response = await api.get<ApiResponse<ChannelVideo[]>>(
            `/videos/channel/${username}`
        );

        return response.data;
    },

    async toggleSubscription(channelId: string) {
        const response = await api.post<
            ApiResponse<{
                isSubscribed: boolean;
                subscribersCount: number;
            }>
        >(`/subscriptions/c/${channelId}`);

        return response.data;
    },

    async getSubscribers(channelId: string) {
        const response = await api.get<ApiResponse<Subscriber[]>>(
            `/subscriptions/channel/${channelId}`
        );

        return response.data;
    },

    async getSubscribedChannels(userId: string) {
        const response = await api.get<
            ApiResponse<SubscribedChannel[]>
        >(`/subscriptions/u/${userId}`);

        return response.data;
    },
};