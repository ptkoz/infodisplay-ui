import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addSeconds, parseISO } from "date-fns";
import { MAX_PING_AGE_SECONDS } from "./middleware.ts";
import { DeviceState } from "./types.ts";
import { MAX_TEMP, MIN_TEMP } from "../../sections/Settings/TemperatureMarks.ts";
import { Room } from "../Measures/types.ts";

export interface AcState {
    mode: "day" | "night";
    cooling: DeviceState;
    heating: DeviceState;
}

const initialState: AcState = {
    mode: "day",
    cooling: {
        lastPingTimestamp: "1970-01-01T00:00:00",
        isDegraded: true,
        isWorking: false,
        targetTemperature: {
            day: MAX_TEMP,
            night: MAX_TEMP,
        },
        managedRooms: [],
    },
    heating: {
        lastPingTimestamp: "1970-01-01T00:00:00",
        isDegraded: true,
        isWorking: false,
        targetTemperature: {
            day: MIN_TEMP,
            night: MIN_TEMP,
        },
        managedRooms: [],
    },
};

export const acSlice = createSlice({
    name: "ac",
    initialState,
    reducers: {
        degrade: (state) => {
            state.cooling.isDegraded = true;
            state.heating.isDegraded = true;
        },
        ping: (state, action: PayloadAction<string>) => {
            state.cooling.lastPingTimestamp = action.payload;
            state.heating.lastPingTimestamp = action.payload;
            state.cooling.isDegraded = addSeconds(parseISO(action.payload), MAX_PING_AGE_SECONDS) < new Date();
            state.heating.isDegraded = addSeconds(parseISO(action.payload), MAX_PING_AGE_SECONDS) < new Date();
        },
        updateStatus: (state, action: PayloadAction<boolean>) => {
            state.cooling.isWorking = action.payload;
        },
        updateTargetTemperature: (state, action: PayloadAction<number>) => {
            state.cooling.targetTemperature.day = action.payload;
            state.heating.targetTemperature.day = action.payload - 4.3;
            state.cooling.targetTemperature.night = action.payload - 2.7;
            state.heating.targetTemperature.night = action.payload - 5.2;
        },
        updateManagementStatus: (state, action: PayloadAction<boolean>) => {
            state.cooling.managedRooms = [];
            state.heating.managedRooms = [];

            if (action.payload) {
                state.cooling.managedRooms.push(Room.LIVING_ROOM)
                state.heating.managedRooms.push(Room.LIVING_ROOM)
            }
        },
    },
});

export const registerAcPing = acSlice.actions.ping;
export const degradeAc = acSlice.actions.degrade;
