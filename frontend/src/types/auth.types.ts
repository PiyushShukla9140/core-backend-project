import type { User } from "./user.types.ts";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    fullName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}