import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

interface MeasuresState {
    livingRoom: {
        lastTemperatureUpdate?: string;
        temperature?: number;
        humidity?: number;
    };
    bedroom: {
        lastTemperatureUpdate?: string;
        temperature?: number;
        humidity?: number;
    };
    outdoor: {
        lastTemperatureUpdate?: string;
        temperature?: number;
    };
}

interface TemperatureUpdatePayload {
    timestamp: string;
    kind: number;
    temperature: number;
}

interface HumidityUpdatePayload {
    timestamp: string;
    kind: number;
    humidity: number;
}

const initialState: MeasuresState = {
    livingRoom: {},
    bedroom: {},
    outdoor: {},
};

const measuresSlice = createSlice({
    name: "measures",
    initialState,
    reducers: {
        updateTemperature: (state, action: PayloadAction<TemperatureUpdatePayload>) => {
            switch (action.payload.kind) {
                case 0x20:
                    state.livingRoom.lastTemperatureUpdate = action.payload.timestamp;
                    state.livingRoom.temperature = action.payload.temperature;
                    break;
                case 0x21:
                    state.bedroom.lastTemperatureUpdate = action.payload.timestamp;
                    state.bedroom.temperature = action.payload.temperature;
                    break;
                case 0x41:
                    state.outdoor.lastTemperatureUpdate = action.payload.timestamp;
                    state.outdoor.temperature = action.payload.temperature;
                    break;
            }
        },
        updateHumidity: (state, action: PayloadAction<HumidityUpdatePayload>) => {
            switch (action.payload.kind) {
                case 0x20:
                    state.livingRoom.humidity = action.payload.humidity;
                    break;
                case 0x21:
                    state.bedroom.humidity = action.payload.humidity;
                    break;
            }
        },
    },
});

export const store = configureStore({
    reducer: {
        measures: measuresSlice.reducer,
    },
    devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
