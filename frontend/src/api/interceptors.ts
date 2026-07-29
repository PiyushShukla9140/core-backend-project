import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
// Instead of hardcoding our interceptor for one Axios client, we make it reusable.

import { store } from "@/store/store";
// We cannot use hooks here because they only work in react component
// Instead we are directly reading the redux state

import { toast } from "sonner";
import {
  logout,
  updateAccessToken,
} from "@/features/auth/authSlice";

interface ApiErrorResponse {
  message: string;
}

// -------------------------------------------------------------------
// Extending Axios Request Config
// -------------------------------------------------------------------
// Axios does not know about our custom "_retry" property.
// We extend its request configuration so TypeScript understands that
// every request can optionally have a "_retry" flag.
//
// This flag prevents infinite refresh loops.
//
// Example:
//
// Original Request
//      ↓
// Access Token Expired
//      ↓
// Refresh Token API
//      ↓
// Retry Original Request
//
// If the retried request again receives 401,
// "_retry" will already be true,
// therefore refresh logic will not execute again.

interface RetryAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// -------------------------------------------------------------------
// Global Flags
// -------------------------------------------------------------------

// Prevent showing multiple "Session Expired" toast messages.
let sessionExpiredHandled = false;

// Prevent multiple refresh token API calls.
//
// Imagine:
//
// Home Page
//      ↓
// 5 API calls start simultaneously
//      ↓
// Access token expires
//      ↓
// All five receive 401
//
// Without this flag:
//
// Request 1 → Refresh
// Request 2 → Refresh
// Request 3 → Refresh
// Request 4 → Refresh
// Request 5 → Refresh
//
// Five unnecessary refresh requests.
//
// With this flag:
//
// Request 1 → Refresh
// Requests 2–5 wait
//
// This is how production applications avoid duplicate refresh requests.

let isRefreshing = false;

// Queue of requests waiting for a new access token.
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

// -------------------------------------------------------------------
// Queue Processor
// -------------------------------------------------------------------
//
// Whenever refresh succeeds or fails,
// wake up every waiting request.

const processQueue = (
  error: unknown,
  token: string | null = null
) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};

export const setupInterceptors = (
  api: AxiosInstance
) => {
  // ---------------------------------------------------------
  // Request Interceptor
  // ---------------------------------------------------------
  api.interceptors.request.use(
    (config) => {
      // Reading the Redux

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

  // ---------------------------------------------------------
  // Response Interceptor
  // ---------------------------------------------------------
  // This interceptor is responsible for:
  //
  // • Detecting expired access tokens
  // • Refreshing the access token
  // • Updating Redux
  // • Retrying failed requests
  // • Logging the user out if refresh fails
  //
  // We'll implement the refresh flow in the next step.

  // ---------------------------------------------------------
// Response Interceptor
// ---------------------------------------------------------

  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest =
        error.config as RetryAxiosRequestConfig;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Handle only Unauthorized responses.
      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        // --------------------------------------------------
        // Another refresh is already running.
        // Wait for it.
        // --------------------------------------------------

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization =
                  `Bearer ${token}`;

                resolve(api(originalRequest));
              },

              reject,
            });
          });
        }

        isRefreshing = true;

        try {
          // ---------------------------------------------
          // Refresh Access Token
          // ---------------------------------------------

          const response = await api.post(
            "/users/refresh-token"
          );

          const newAccessToken =
            response.data.data.accessToken;

          // Update Redux

          store.dispatch(
            updateAccessToken(newAccessToken)
          );

          // Refresh succeeded.
          sessionExpiredHandled = false;

          // Wake every waiting request.

          processQueue(
            null,
            newAccessToken
          );

          // Retry current request.

          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Reject everyone waiting.

          processQueue(refreshError);

          if (!sessionExpiredHandled) {
            sessionExpiredHandled = true;

            store.dispatch(logout());

            toast.error(
              "Your session has expired. Please sign in again."
            );

            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

// -------------------------------------------------------------------
// Core Definition
// -------------------------------------------------------------------

// What it is:
// A centralized middleware configuration file that intercepts outgoing
// HTTP requests before they leave the application and incoming
// responses before they hit your components.

// Core Philosophy:
// Implements the DRY (Don't Repeat Yourself) principle by eliminating
// duplicate HTTP configuration logic spread across your service layers.

// -------------------------------------------------------------------
// Why Interceptors are Mandatory in Production
// -------------------------------------------------------------------

// 1. Centralized Authentication Management (Outbound)
//
// Eliminates the need to manually inject security tokens
// (Authorization: Bearer <token>) inside every individual API call.
//
// The request interceptor dynamically reads the token from your
// application's secure storage (Redux/Cookies) and automatically
// appends it to every protected request.

// 2. Globalized Error Handling (Inbound)
//
// Acts as a global safety net for error responses
// (401 Unauthorized, 403 Forbidden, 500 Internal Server Error).
//
// Instead of wrapping every component inside repetitive try/catch
// blocks, the response interceptor centrally handles these errors
// and performs actions like redirecting users to the login page.

// 3. Automated Token Refresh Mechanics
//
// Handles seamless authentication.
//
// When the access token expires:
//
// Request
//      ↓
// Backend returns 401
//      ↓
// Refresh Token API executes silently
//      ↓
// Redux receives new Access Token
//      ↓
// Original request is replayed automatically
//      ↓
// User never notices.
//
// This creates a seamless user experience similar to YouTube,
// GitHub, LinkedIn and other production applications.

// 4. Global Telemetry, Loaders and Metrics
//
// Simplifies UI state management by automatically starting
// global loaders when requests begin and stopping them when
// they complete.
//
// Also acts as a central place for:
//
// • Analytics
// • Logging
// • Performance Monitoring
// • Network Timing
// • Request Tracing

// -------------------------------------------------------------------
// Standard Production Implementation Template
// -------------------------------------------------------------------

// Save this production-ready structure:
//
// src/
// ├── api/
// │   ├── api.ts
// │   ├── interceptors.ts
// │   ├── authRefresh.ts
// │   └── types.ts
//
// This keeps authentication logic isolated and makes the
// interceptor easier to maintain as the application grows.

// -------------------------------------------------------------------
// System Placement Matrix
// -------------------------------------------------------------------

// React Component
//        │
//        ▼
// Custom Hook
//        │
//        ▼
// Service Layer
//        │
//        ▼
// Axios Client (api.ts)
//        │
//        ▼
// Interceptors
//        │
//        ▼
// Backend API
//
// Your hooks (useVideos, useComments, useHistory)
// call functions inside service files.
//
// Those service files use api.get(), api.post(), api.patch()
// instead of raw axios methods.
//
// Therefore, every request automatically inherits:
//
// • Authentication
// • Token Refresh
// • Error Handling
// • Logging
// • Future Global Features