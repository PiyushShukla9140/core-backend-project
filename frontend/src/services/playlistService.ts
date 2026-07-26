import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api.types";
import type {
  Playlist,
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
} from "@/types/playlist.types";

const playlistService = {
  createPlaylist: async (data: CreatePlaylistRequest) => {
    const response = await api.post<ApiResponse<Playlist>>(
      API_ENDPOINTS.PLAYLISTS.CREATE,
      data
    );

    return response.data;
  },

  getUserPlaylists: async (userId: string) => {
    const response = await api.get<ApiResponse<Playlist[]>>(
      API_ENDPOINTS.PLAYLISTS.GET_USER_PLAYLISTS(userId)
    );

    return response.data;
  },

  getPlaylistById: async (playlistId: string) => {
    const response = await api.get<ApiResponse<Playlist>>(
      API_ENDPOINTS.PLAYLISTS.GET_BY_ID(playlistId)
    );

    return response.data;
  },

  updatePlaylist: async (
    playlistId: string,
    data: UpdatePlaylistRequest
  ) => {
    const response = await api.patch<ApiResponse<Playlist>>(
      API_ENDPOINTS.PLAYLISTS.UPDATE(playlistId),
      data
    );

    return response.data;
  },

  deletePlaylist: async (playlistId: string) => {
    const response = await api.delete<ApiResponse<{}>>(
      API_ENDPOINTS.PLAYLISTS.DELETE(playlistId)
    );

    return response.data;
  },

  addVideoToPlaylist: async (
    
    videoId: string,
    playlistId: string,
  ) => {
    const response = await api.patch<ApiResponse<Playlist>>(
      API_ENDPOINTS.PLAYLISTS.ADD_VIDEO(videoId, playlistId)
    );

    return response.data;
  },

  removeVideoFromPlaylist: async (
    
    videoId: string,
    playlistId: string,
  ) => {
    const response = await api.patch<ApiResponse<Playlist>>(
      API_ENDPOINTS.PLAYLISTS.REMOVE_VIDEO(videoId, playlistId)
    );

    return response.data;
  },
};

export default playlistService;