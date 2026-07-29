import { useState, type ReactNode } from "react";

import type { PlaylistFormValues } from "@/schemas/playlist.schema";

import { toast } from "sonner";
import playlistService from "@/services/playlistService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";



import  axios from "axios";
import PlaylistForm from "./playlistForm";

interface CreatePlaylistDialogProps{
    children:ReactNode;
    onSuccess?:()=>void;
}


const CreatePlaylistDialog = ({children,onSuccess}:CreatePlaylistDialogProps)=>{
    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)

    

    const onSubmit = async (values: PlaylistFormValues) => {
        try {
            setLoading(true);

            await playlistService.createPlaylist(values);

            toast.success("Playlist created successfully!");

            onSuccess?.();

            setOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ?? "Something went wrong"
                );
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>

                    <DialogDescription>
                        Organize your favourite videos into playlists.
                    </DialogDescription>
                </DialogHeader>

            <PlaylistForm
                submitLabel="Create Playlist"
                loading={loading}
                onSubmit={onSubmit}
            />
            </DialogContent>
        </Dialog>
    );
};

export default CreatePlaylistDialog

