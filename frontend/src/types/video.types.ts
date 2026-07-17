export interface VideoOwner{
    _id:string,
    username:string,
    fullName:string,
    avatar:string
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