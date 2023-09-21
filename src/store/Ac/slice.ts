import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addSeconds, parseISO } from "date-fns";
import { MAX_PING_AGE_SECONDS } from "./middleware.ts";

export interface AcState {
    isManaged: boolean; // do we manage AC or is management off
    lastPingTimestamp: string; // when the most recent ping was received
    isDegraded: boolean; // was the most recent ping more than 3 minutes ago

    isWorking: boolean; // is ac unit currently working
    targetTemperature: number; // what is the configured target temperature
}

const initialState: AcState = {
    isManaged: false,
    isDegraded: true,
    lastPingTimestamp: "1970-01-01T00:00:00",
    isWorking: false,
    targetTemperature: 30.0,
};

export const acSlice = createSlice({
    name: "ac",
    initialState,
    reducers: {
        degrade: (state) => {
            state.isDegraded = true;
        },
        ping: (state, action: PayloadAction<string>) => {
            state.lastPingTimestamp = action.payload;
            state.isDegraded = addSeconds(parseISO(action.payload), MAX_PING_AGE_SECONDS) < new Date();
        },
        updateStatus: (state, action: PayloadAction<boolean>) => {
            state.isWorking = action.payload;
        },
        updateTargetTemperature: (state, action: PayloadAction<number>) => {
            state.targetTemperature = action.payload;
        },
    },
});

export const registerAcPing = acSlice.actions.ping;
export const degradeAc = acSlice.actions.degrade;
