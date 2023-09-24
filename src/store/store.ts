import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { measureSlice } from "./Measures/slice.ts";
import { deviceSlice } from "./Device/slice.ts";
import { createDeviceDegradeMiddleware } from "./Device/middleware.ts";
import { createMeasureDegradeMiddleware } from "./Measures/middleware.ts";
import { MeasureKind } from "./Measures/types.ts";
import { DeviceKind } from "./Device/types.ts";

export const store = configureStore({
    reducer: {
        measure: measureSlice.reducer,
        device: deviceSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            createDeviceDegradeMiddleware(DeviceKind.COOLING),
            createDeviceDegradeMiddleware(DeviceKind.HEATING),
            createMeasureDegradeMiddleware(MeasureKind.LIVING_ROOM, 180),
            createMeasureDegradeMiddleware(MeasureKind.BEDROOM),
            createMeasureDegradeMiddleware(MeasureKind.OUTDOOR),
        )
    },
    devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
