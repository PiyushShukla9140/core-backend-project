import {
    useDispatch,
    useSelector,
} from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import type { RootState, AppDispatch } from "./store";

// Type-Safe Dispatch Hook

export const useAppDispatch = () => useDispatch<AppDispatch>();

// Type-safe Selector Hook

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;