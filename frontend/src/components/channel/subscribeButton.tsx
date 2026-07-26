import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { channelService } from "@/services/channelService";

interface SubscribeButtonProps {
    channelId: string;
    initialSubscribed: boolean;
}

export const SubscribeButton = ({
    channelId,
    initialSubscribed,
}: SubscribeButtonProps) => {
    const [isSubscribed, setIsSubscribed] =
        useState(initialSubscribed);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsSubscribed(initialSubscribed);
    }, [initialSubscribed]);

    const handleToggleSubscription = async () => {
        try {
            setLoading(true);

            const response =
                await channelService.toggleSubscription(channelId);

            setIsSubscribed(response.data.isSubscribed);

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