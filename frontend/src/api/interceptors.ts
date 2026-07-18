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


// Core Definition
// What it is: A centralized middleware configuration file that intercepts outgoing HTTP requests before they leave the application and incoming responses before they hit your components.

// Core Philosophy: Implements the DRY (Don't Repeat Yourself) principle by eliminating duplicate HTTP configuration logic spread across your service layers.

// 2. Why Interceptors are Mandatory in Production
// Centralized Authentication Management (Outbound):

// Eliminates the need to manually inject security tokens (Authorization: Bearer <token>) inside every individual API call.

// The request interceptor dynamically reads the token from your application's secure storage (Cookies/LocalStorage) and automatically appends it to headers for all protected endpoints.

// Globalized Error Handling (Inbound):

// Acts as a global safety net for error responses (like HTTP codes 401 Unauthorized, 403 Forbidden, 500 Server Error).

// Instead of wrapping every application component in redundant try/catch error checking loops, the response interceptor centrally catches errors to trigger automated events (e.g., auto-routing to /login on a 401 status).

// Automated Token Refresh Mechanics:

// Handles seamless session management. When a short-lived access token expires and the backend rejects a call, the interceptor freezes the failed request, fires a silent background API call to refresh the token, updates storage, and replays the original user request instantly.

// Global Telemetry, Loaders, and Metrics:

// Simplifies UI state management by triggering top-loading bars or global spinners automatically when network activity starts and stopping them when it resolves.

// Provides a singular choke point to profile network latency or log outbound telemetry for production monitoring systems.

// 3. Standard Production Implementation Template
// Save this standard, production-ready structure (src/services/apiClient.js) to wire up your layered architecture (Page -> Hook -> Service -> Backend)
// 4. System Placement Matrix
// Where it sits: Directly beneath your Service Layer.

// How it interacts: Your custom hooks (useVideos, useComments) invoke functions within files like videoService.js. These service files execute calls using apiClient.get() or apiClient.post() instead of raw axios.get(), inheriting the security headers and global error handling strategies automatically.