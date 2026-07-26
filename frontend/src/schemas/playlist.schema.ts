import {z} from "zod"

export const playlistSchema = z.object(
    {
        name:z.
        string().
        trim().
        min(1,"Playlist name is required").
        max(50, "Name cannot exceed 50 character"),

        description:z.
        string().
        trim().
        min(1,"Description is required").
        max(150, "Name cannot exceed 150 character"),




    }
)

export type PlaylistFormValues = z.infer<typeof playlistSchema>