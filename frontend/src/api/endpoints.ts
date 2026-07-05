
export const API_ENDPOINTS = {
    Auth:{
        REGISTER: "/users/register",
        LOGIN: "/users/login",
        LOGOUT: "/users/logout",
        REFRESH_TOKEN: "/users/refresh-token",
        CURRENT_USER: "/users/current-user",
        UPDATE_ACCOUNT: "/users/update-account",
        CHANGE_PASSWORD: "/users/change-password",
        UPDATE_AVATAR: "/users/avatar",
        UPDATE_COVER_IMAGE: "/users/cover-image",
    },
    VIDEOS:{
        GET_ALL: "/videos",
        CREATE: "/videos",
        GET_BY_ID: (videoId: string) => `/videos/${videoId}`,
        UPDATE: (videoId: string) => `/videos/${videoId}`,
        DELETE: (videoId: string) => `/videos/${videoId}`,
        TOGGLE_PUBLISH: (videoId: string) =>
            `/videos/toggle/publish/${videoId}`,
    },
    COMMENTS:{
        GET_ALL: (videoId: string) => `/comments/${videoId}`,
        ADD: (videoId: string) => `/comments/${videoId}`,
        UPDATE: (commentId: string) => `/comments/c/${commentId}`,
        DELETE: (commentId: string) => `/comments/c/${commentId}`,
    },
    PLAYLISTS:{
         CREATE: "/playlist",
        GET_BY_ID: (playlistId: string) => `/playlist/${playlistId}`,
        UPDATE: (playlistId: string) => `/playlist/${playlistId}`,
        DELETE: (playlistId: string) => `/playlist/${playlistId}`,
        ADD_VIDEO: (videoId: string, playlistId: string) =>
            `/playlist/add/${videoId}/${playlistId}`,
        REMOVE_VIDEO: (videoId: string, playlistId: string) =>
            `/playlist/remove/${videoId}/${playlistId}`,
        GET_USER_PLAYLISTS: (userId: string) =>
            `/playlist/user/${userId}`,
    },
    LIKES:{
        TOGGLE_VIDEO: (videoId: string) =>
            `/likes/toggle/v/${videoId}`,
        TOGGLE_COMMENT: (commentId: string) =>
            `/likes/toggle/c/${commentId}`,
        TOGGLE_TWEET: (tweetId: string) =>
            `/likes/toggle/t/${tweetId}`,
        GET_LIKED_VIDEOS: "/likes/videos",
    },
    SUBSCRIPTONS:{
        TOGGLE: (channelId: string) =>
            `/subscriptions/c/${channelId}`,
        GET_SUBSCRIBERS: (channelId: string) =>
            `/subscriptions/c/${channelId}`,
        GET_SUBSCRIBED_CHANNELS: (subscriberId: string) =>
            `/subscriptions/u/${subscriberId}`,
    },
    DASHBOARD:{
        STATS: "/dashboard/stats",
        VIDEOS: "/dashboard/videos",
    }    
    
} as const