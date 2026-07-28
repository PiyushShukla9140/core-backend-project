export interface ChannelStats {
  totalSubscribers: number;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
}

export interface DashboardVideo {
  _id: string;
  title: string;
  thumbnail: string;
  views: number;
  duration: number;
  isPublished: boolean;
  createdAt: string;

  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ChannelVideosResponse {
  videos: DashboardVideo[];
  pagination: Pagination;
}