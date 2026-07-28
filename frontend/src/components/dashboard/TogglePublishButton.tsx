import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import dashboardService from "@/services/dashboardService";

import { Button } from "@/components/ui/button";

interface TogglePublishButtonProps {
    videoId: string;
    isPublished: boolean;
    onToggle: () => void;
}

function TogglePublishButton({
    videoId,
    isPublished,
    onToggle,
}: TogglePublishButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        try {
            setLoading(true);

            await dashboardService.togglePublishStatus(videoId);

            toast.success(
                isPublished
                    ? "Video unpublished successfully."
                    : "Video published successfully."
            );

            onToggle();
        } catch (error) {
            console.error(error);

            toast.error("Failed to update video status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            onClick={handleToggle}
        >
            {isPublished ? (
                <EyeOff className="h-4 w-4" />
                
            ) : (
                <Eye className="h-4 w-4" />
            )}
        </Button>
    );
}

export default TogglePublishButton;