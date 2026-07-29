export interface VideoOwner{
    _id:string,
    username:string,
    fullName:string,
    avatar:string,
    subscribersCount: number;
    isSubscribed: boolean;
}

export interface Video{
    _id:string,
    videoFile:string,
    thumbnail:string,
    title:string,
    description:string,
    views:number,
    duration:number,
    createdAt: string;
    isPublished: boolean;
    owner: VideoOwner;
    likesCount: number;
    isLiked: boolean;

}
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetVideosResponse {
  videos: Video[];

  pagination: Pagination;
}

export interface PublishVideoPayload {
  title: string;
  description: string;
  thumbnail: File;
  videoFile: File;
}

export interface GetVideosParams {
  page?: number;
  limit?: number;
  query?: string;
  sortBy?: string;
  sortType?: "asc" | "desc";
  userId?: string;
}