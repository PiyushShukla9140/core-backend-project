import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "sonner";

import type { Playlist } from "@/types/playlist.types";

import playlistService from "@/services/playlistService";

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

interface DeletePlaylistDialogProps {
    playlist: Playlist;
    children: ReactNode;
}

const DeletePlaylistDialog = ({playlist,children}:DeletePlaylistDialogProps) =>{
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            setLoading(true);

            await playlistService.deletePlaylist(playlist._id);

            toast.success("Playlist deleted successfully!");

            navigate("/playlists");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                    "Failed to delete playlist."
                );
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete Playlist?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        <strong> {playlist.name}</strong> and remove all of its
                        videos.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>

                    
                        
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeletePlaylistDialog;