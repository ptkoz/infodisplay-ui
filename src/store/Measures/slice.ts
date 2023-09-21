import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HumidityUpdatePayload, TemperatureUpdatePayload } from "./types.ts";
import { MAX_TEMPERATURE_AGE_SECONDS } from "./middleware.ts";
import { addSeconds, parseISO } from "date-fns";

export interface MeasuresState {
    livingRoom: {
        lastTemperatureUpdate: string;
        isDegraded: boolean;
        temperature?: number;
        humidity?: number;
    };
    bedroom: {
        lastTemperatureUpdate: string;
        isDegraded: boolean;
        temperature?: number;
        humidity?: number;
    };
    outdoor: {
        lastTemperatureUpdate: string;
        isDegraded: boolean;
        temperature?: number;
    };
}

const initialState: MeasuresState = {
    livingRoom: {
        lastTemperatureUpdate: "1970-01-01T00:00:00",
        isDegraded: true,
    },
    bedroom: {
        lastTemperatureUpdate: "1970-01-01T00:00:00",
        isDegraded: true,
    },
    outdoor: {
        lastTemperatureUpdate: "1970-01-01T00:00:00",
        isDegraded: true,
    },
};


export const measuresSlice = createSlice({
    name: "measures",
    initialState,
    reducers: {
        degrade: (state, action: PayloadAction<number>) => {
            switch (action.payload) {
                case 0x20:
                    state.livingRoom.isDegraded = true;
                    break;
                case 0x21:
                    state.bedroom.isDegraded = true;
                    break;
                case 0x41:
                    state.outdoor.isDegraded = true;
                    break;
            }
        },
        updateTemperature: (state, action: PayloadAction<TemperatureUpdatePayload>) => {
            const isDegraded = addSeconds(parseISO(action.payload.timestamp), MAX_TEMPERATURE_AGE_SECONDS) < new Date();

            switch (action.payload.kind) {
                case 0x20:
                    state.livingRoom.lastTemperatureUpdate = action.payload.timestamp;
                    state.livingRoom.temperature = action.payload.temperature;
                    state.livingRoom.isDegraded = isDegraded;
                    break;
                case 0x21:
                    state.bedroom.lastTemperatureUpdate = action.payload.timestamp;
                    state.bedroom.temperature = action.payload.temperature;
                    state.bedroom.isDegraded = isDegraded;
                    break;
                case 0x41:
                    state.outdoor.lastTemperatureUpdate = action.payload.timestamp;
                    state.outdoor.temperature = action.payload.temperature;
                    state.outdoor.isDegraded = isDegraded;
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

export const degradeMeasure = measuresSlice.actions.degrade;
export const updateTemperature = measuresSlice.actions.updateTemperature;
