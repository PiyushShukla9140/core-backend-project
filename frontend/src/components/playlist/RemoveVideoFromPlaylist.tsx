import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import playlistService from "@/services/playlistService";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface RemoveVideoButtonProps {
    playlistId: string;
    videoId: string;
    onSuccess: () => void;
}

const RemoveVideoButton = ({
    playlistId,
    videoId,
    onSuccess,
}: RemoveVideoButtonProps) => {
    const [loading, setLoading] = useState(false);
    const handleRemove = async () => {
        setLoading(true)
        try {

            await playlistService.removeVideoFromPlaylist(
                videoId,
                playlistId
            );

            toast.success("Video removed from playlist.");
            
            // since refetch returns promise

            await onSuccess();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                        "Something went wrong."
                );
            } else {
                toast.error("Something went wrong.");
            }
        }finally{
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Remove video?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This video will be removed from this playlist.
                        The original video won't be deleted and you can
                        always add it back later.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        onClick={handleRemove}
                    >
                        {loading ? "Removing..." : "Remove"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RemoveVideoButton;