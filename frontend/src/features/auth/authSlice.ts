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
    reducers: {},
});

export default authSlice.reducer;