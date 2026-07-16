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