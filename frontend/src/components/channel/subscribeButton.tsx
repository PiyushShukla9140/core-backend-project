import {  useState } from "react";
import type{Dispatch, SetStateAction,} from "react"
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { channelService } from "@/services/channelService";

interface SubscribeButtonProps {
    channelId: string;
    isSubscribed: boolean;
    setIsSubscribed: Dispatch<SetStateAction<boolean>>;
    setSubscribersCount: Dispatch<SetStateAction<number>>;
}

export const SubscribeButton = ({
    channelId,
    isSubscribed,
    setIsSubscribed,
    setSubscribersCount,
}: SubscribeButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleToggleSubscription = async () => {
        try {
            setLoading(true);

            const response =
                await channelService.toggleSubscription(channelId);

            setIsSubscribed(response.data.isSubscribed);
            setSubscribersCount(response.data.subscribersCount);

            toast.success(
                response.data.isSubscribed
                    ? "Subscribed successfully"
                    : "Subscription removed"
            );
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                    "Failed to update subscription."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            disabled={loading}
            onClick={handleToggleSubscription}
            variant={isSubscribed ? "secondary" : "default"}
        >
            {loading
                ? "Please wait..."
                : isSubscribed
                ? "Subscribed"
                : "Subscribe"}
        </Button>
    );
};