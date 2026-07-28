import api from "@/api/axios";

const getCurrentUser = async ()=>{
    const response = await api.get("/users/current-user");

    return response.data.data;
}

const settingService={
    getCurrentUser,
}

export default settingService;