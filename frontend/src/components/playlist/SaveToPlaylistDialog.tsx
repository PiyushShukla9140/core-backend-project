import { useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import type { RootState } from "@/store/store";

import playlistService from "@/services/playlistService";

import { usePlaylists } from "@/hooks/usePlaylists";

import CreatePlaylistDialog from "./CreatePlaylistDialog";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";

interface SaveToPlaylistDialogProps {
    videoId: string;
    children: ReactNode;
}

const SaveToPlaylistDialog = ({
    videoId,
    children,
}: SaveToPlaylistDialogProps) => {
    const [open, setOpen] = useState(false);

    const { user } = useSelector(
        (state: RootState) => state.auth
    );

    const {
        playlists,
        loading,
        error,
        refetch,
    } = usePlaylists(user?._id);

    const handleTogglePlaylist = async (
        playlistId: string,
        checked: boolean
    ) => {
        try {
            if (checked) {
                await playlistService.addVideoToPlaylist(
                    videoId,
                    playlistId
                );

                toast.success("Video added to playlist!");
            } else {
                await playlistService.removeVideoFromPlaylist(
                    videoId,
                    playlistId
                );

                toast.success("Video removed from playlist!");
            }

            await refetch();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                        "Something went wrong"
                );
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Save to Playlist
                    </DialogTitle>

                    <DialogDescription>
                        Select playlists to save this video.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <LoadingSpinner text="Loading playlists..." />
                ) : error ? (
                    <ErrorState
                        title="Couldn't load playlists"
                        message={error}
                        onRetry={refetch}
                    />
                ) : playlists.length === 0 ? (
                    <EmptyState
                        title="No playlists found"
                        description="Create your first playlist below."
                    />
                ) : (
                    <div className="space-y-3">
                        {playlists.map((playlist) => {
                            const isSaved =
                                playlist.videos.some(
                                    (video) =>
                                        video._id ===
                                        videoId
                                );

                            return (
                                <div
                                    key={playlist._id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {playlist.name}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {
                                                playlist
                                                    .videos
                                                    .length
                                            }{" "}
                                            videos
                                        </p>
                                    </div>

                                    <Checkbox
                                        checked={
                                            isSaved
                                        }
                                        onCheckedChange={(
                                            checked
                                        ) =>
                                            handleTogglePlaylist(
                                                playlist._id,
                                                Boolean(
                                                    checked
                                                )
                                            )
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                <CreatePlaylistDialog
                    onSuccess={refetch}
                >
                    <Button
                        variant="outline"
                        className="w-full"
                    >
                        + Create Playlist
                    </Button>
                </CreatePlaylistDialog>
            </DialogContent>
        </Dialog>
    );
};

export default SaveToPlaylistDialog;