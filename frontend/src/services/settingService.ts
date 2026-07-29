import api from "@/api/axios";

import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types/user.types";


interface UpdateAccountPayload{
    fullName:string,
    username:string,
    email:string
}


const settingService = {
    async updateAccount(payload:UpdateAccountPayload){
        const response = await api.patch<ApiResponse<User>>("/users/update-account",
            payload);
        
        return response.data
    },

    async updateAvatar(formData:FormData){
        const response = await api.patch<ApiResponse<User>>("/users/avatar",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }

        )
        
        return response.data
    },
    async deleteAvatar() {
        const response = await api.delete<ApiResponse<User>>(
            "/users/avatar"
        );

        return response.data;
    },

    async updateCoverImage(formData: FormData) {
        const response = await api.patch<ApiResponse<User>>(
            "/users/cover-image",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    async deleteCoverImage() {
        const response = await api.delete<ApiResponse<User>>(
            "/users/cover-image"
        );

        return response.data;
    },
}

export default settingService;