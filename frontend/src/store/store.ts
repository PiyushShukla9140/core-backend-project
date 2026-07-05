import {configureStore} from "@reduxjs/toolkit"
//Redux Toolkit provides a helper called configureStore().
//Instead of manually creating a Redux store 
// (which required a lot of boilerplate in older Redux),
// Redux Toolkit gives us a cleaner, production-ready setup.

import authReducer from "../features/auth/authSlice";
import {persistReducer, persistStore} from "redux-persist"
import {combineReducers} from "@reduxjs/toolkit"

import  storage  from "redux-persist/lib/storage";


const rootReducer = combineReducers({
    auth:authReducer
})

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};

const persistedReducer = persistReducer(
    persistConfig,
    rootReducer
);


export const store = configureStore({
    //This creates the application's only Redux Store.
    reducer:persistedReducer
    //This reducer:{} tells Redux: 
    //"These are all the slices that belong to the store."
})

export const persistor = persistStore(store);
// export types
export type RootState = ReturnType<typeof store.getState>;
//This automatically creates the type of our entire Redux state.
//Instead of manually writing:
// TypeScript infers it from the store. 
// As you add slices, RootState updates automatically.


export type AppDispatch = typeof store.dispatch;
// Every action in redux is sent by using dispatch
//This type ensures TypeScript knows exactly what 
// actions your store can dispatch.