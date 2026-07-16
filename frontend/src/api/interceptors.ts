import type { AxiosInstance } from "axios";
//Instead of hardcoding our interceptor for one Axios client, we make it reusable.

import { store } from "@/store/store";
// We cannot use hooks here because they only work in react component
// Instead we are directly reading the redux state

export const setupInterceptors = (
  api: AxiosInstance
) => {
  api.interceptors.request.use(
    (config) => {
        // Reading the redux
      // Get access token from Redux
      const token =
        store.getState().auth.accessToken;

      // Attach Authorization header
      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      return config;
    },

    (error) => {
      return Promise.reject(error);
    }
  );
};