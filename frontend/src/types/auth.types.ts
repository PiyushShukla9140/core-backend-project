import type { User } from "./user.types.ts";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;

  avatar: File;

  coverImage?: File;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}