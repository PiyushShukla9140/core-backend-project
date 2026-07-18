import { createSlice,type PayloadAction, } from "@reduxjs/toolkit";

import type { User } from "../../types/user.types.ts";



// AuthState interface
interface AuthState {
  user: User | null;
  accessToken:string|null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// creating the initial using AuthState as type
//The Initial State is the default state of a slice 
// before any action has been dispatched.
const initialState: AuthState = {
  user: null,
  accessToken:null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

type LoginSuccessPayload = {
  user: User;
  accessToken: string;
};

// we are going to use createSlice() method here
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state){
            state.loading = true,
            state.error = null
        },
        loginSuccess(
            state,
            action: PayloadAction<LoginSuccessPayload>
            ) {
            state.loading = false;

            state.isAuthenticated = true;

            state.user = action.payload.user;

            state.accessToken =
                action.payload.accessToken;

            state.error = null;
        },
        loginFailure(state,action: PayloadAction<string>){
            state.loading = false,
            state.error = action.payload
        },
        logout(state) {
            state.user = null;

            state.accessToken = null;

            state.isAuthenticated = false;

            state.loading = false;

            state.error = null;
        }
    },
});

// we have updated this file because our backend is returning accessToken and refreshToken
// first we updated the authState and then the initial state
// Then we imported the type payloadAction and then we created the payload type
// then we updated the loginSuccess and logout reducers


export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
} = authSlice.actions;

export default authSlice.reducer;

// Some notes about auth slice
/*Core Definition
What it is: An authSlice is a centralized state management file created using Redux Toolkit's createSlice method. It acts as the single source of truth for all authentication-related data across your entire application.

Core Philosophy: Instead of passing user authentication data up and down components via complex prop-drilling or React Context setups, authSlice isolates authentication logic into a globally accessible container.

2. Why an authSlice is Mandatory in Production
Global Session Management:

Multiple components across your app need to know if a user is logged in (e.g., the Navbar needs to display a profile picture, the Comment section needs to enable typing, and the Video uploader needs a user ID).

authSlice keeps this data globally readable by any component via useSelector.

Centralized State Transitions (Reducers):

It maps out explicit actions that modify authentication states:

loginSuccess: Stores user credentials and sets isAuthenticated to true.

logout: Wipes user details from the global store and resets isAuthenticated to false.

updateProfile: Seamlessly updates specific user records without rebuilding the entire store state.

Decoupled Business Logic:

By managing status updates (like tracking asynchronous login requests through createAsyncThunk), your UI components don't have to deal with loading spinners, state variables, or authentication handling code. They simply dispatch a centralized event.


3. How it Interacts with the Rest of Your Architecture
The Interceptor Connection: When your Axios interceptor catches a 401 Unauthorized token expiry failure, it forces cleanups and redirects. In full-scale implementations, you can cleanly clear local storage and simultaneously dispatch the global logoutSuccess action to instantly clear the UI state.

The Layered Flow:

A user clicks "Login" on the Page Layer.

The page calls a method inside your Hook Layer.

The hook contacts the Service Layer (Axios client) to verify passwords with the backend.

Once successful, the hook dispatches loginSuccess(userData) to update the global authSlice, causing the UI to re-render automatically.
*/