import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { measuresSlice } from "./Measures/slice.ts";
import { acSlice } from "./Ac/slice.ts";
import { pingDegradingMiddleware } from "./Ac/middleware.ts";
import { createMeasureDegradeMiddlewareForKind } from "./Measures/middleware.ts";

export const store = configureStore({
    reducer: {
        measures: measuresSlice.reducer,
        ac: acSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            pingDegradingMiddleware,
            createMeasureDegradeMiddlewareForKind(0x20, 180),
            createMeasureDegradeMiddlewareForKind(0x21),
            createMeasureDegradeMiddlewareForKind(0x41),
        )
    },
    devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
