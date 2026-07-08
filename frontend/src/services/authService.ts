import api from "../api/axios.ts";
import { API_ENDPOINTS } from "../api/endpoints.ts";

import type {
    LoginRequest,
    SignupRequest,
    AuthResponse,
} from "../types/auth.types.ts";

import type { ApiResponse } from "../types/api.types.ts";
import type { User } from "../types/user.types.ts";

const authService = {
    login: async (credentials: LoginRequest) => {
        const response = await api.post<ApiResponse<AuthResponse>>
        (
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );

        return response.data;
    },

    signup: async (data: SignupRequest) => {
        const response = await api.post<ApiResponse<AuthResponse>>
        (
            API_ENDPOINTS.AUTH.REGISTER,
            data
        );

        return response.data;
    },

    logout: async () => {
        const response = await api.post<ApiResponse<null>>
        (
            API_ENDPOINTS.AUTH.LOGOUT
        );

        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get<ApiResponse<User>>
        (
            API_ENDPOINTS.AUTH.CURRENT_USER
        );

        return response.data;
    },
};

export default authService;