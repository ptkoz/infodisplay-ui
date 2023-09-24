import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HumidityUpdatePayload, MeasureKind, MeasureStatus, TemperatureUpdatePayload } from "./types.ts";
import { MAX_TEMPERATURE_AGE_SECONDS } from "./middleware.ts";
import { addSeconds, parseISO } from "date-fns";

export type MeasureState = {
    [key in MeasureKind]: MeasureStatus;
};

const initialState: MeasureState = {
    [MeasureKind.LIVING_ROOM]: {
        lastTemperatureUpdate: "1970-01-01T00:00:00",
        isDegraded: true,
    },
    [MeasureKind.BEDROOM]: {
        lastTemperatureUpdate: "1970-01-01T00:00:00",
        isDegraded: true,
    },
    [MeasureKind.OUTDOOR]: {
        lastTemperatureUpdate: "1970-01-01T00:00:00",
        isDegraded: true,
    },
};

export const measureSlice = createSlice({
    name: "measure",
    initialState,
    reducers: {
        degrade: (state, action: PayloadAction<MeasureKind>) => {
            state[action.payload].isDegraded = true;
        },
        updateTemperature: (state, action: PayloadAction<TemperatureUpdatePayload>) => {
            const { kind, ...payload } = action.payload;
            state[kind].lastTemperatureUpdate = payload.timestamp;
            state[kind].temperature = payload.temperature;
            state[kind].isDegraded = addSeconds(parseISO(payload.timestamp), MAX_TEMPERATURE_AGE_SECONDS) < new Date();
        },
        updateHumidity: (state, action: PayloadAction<HumidityUpdatePayload>) => {
            state[action.payload.kind].humidity = action.payload.humidity;
        },
    },
});

export const degradeMeasure = measureSlice.actions.degrade;
export const updateTemperature = measureSlice.actions.updateTemperature;
