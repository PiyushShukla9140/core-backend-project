import type { User } from "./user.types";
import type {Video} from "./video.types"

export interface Playlist{
    _id:string,
    name:string,
    description:string,
    videos:Video[],
    owner:User,
    createdAt:string,
    updatedAt:string

}

export interface CreatePlaylistRequest {
  name: string;
  description: string;
}

export interface UpdatePlaylistRequest {
  name: string;
  description: string;
}