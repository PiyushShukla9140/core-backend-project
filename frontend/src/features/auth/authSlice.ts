import { createSlice } from "@reduxjs/toolkit";


// AuthState interface
interface AuthState {
  user: null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// creating the initial using AuthState as type
//The Initial State is the default state of a slice 
// before any action has been dispatched.
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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
        loginSuccess(state,action){// action contains user data
            state.loading = false,
            state.isAuthenticated = true,
            state.user = action.payload,
            state.error = null
        },
        loginFailure(state,action){
            state.loading = false,
            state.error = action.payload
        },
        logout(state){
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        }
    },
});
export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
} = authSlice.actions;

export default authSlice.reducer;