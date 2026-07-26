import { useState, type ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";

import type { Playlist } from "@/types/playlist.types";
import type { PlaylistFormValues} from "@/schemas/playlist.schema";

import playlistService from "@/services/playlistService";

import PlaylistForm from "./playlistForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditPlaylistDialogProps {
  playlist: Playlist;
  children: ReactNode;
  onSuccess?: () => void;
}

const EditPlaylistDialog = ({
  playlist,
  children,
  onSuccess,
  
}: EditPlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (values: PlaylistFormValues) => {
    try {
      setLoading(true);

      await playlistService.updatePlaylist(
        playlist._id,
        values
      );

      toast.success("Playlist updated successfully!");

      onSuccess?.();

      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Failed to update playlist."
        );
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
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

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Playlist</DialogTitle>

          <DialogDescription>
            Update your playlist details.
          </DialogDescription>
        </DialogHeader>

        <PlaylistForm
          defaultValues={{
            name: playlist.name,
            description: playlist.description,
          }}
          submitLabel="Save Changes"
          loading={loading}
          onSubmit={handleUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPlaylistDialog;