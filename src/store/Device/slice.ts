import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addSeconds, parseISO } from "date-fns";
import { MAX_PING_AGE_SECONDS } from "./middleware.ts";
import {
    DeviceKind, DeviceSettings,
    DeviceStatus,
    OperatingMode,
    PingPayload,
    UpdateDeviceControlPayload,
    UpdateStatusPayload,
    UpdateTargetTemperaturePayload,
} from "./types.ts";
import { MAX_TEMP, MIN_TEMP } from "../../sections/Settings/TemperatureMarks.ts";

export interface DeviceState {
    mode: OperatingMode;
    status: {
        [key in DeviceKind]: DeviceStatus;
    };
    settings: {
        [key in DeviceKind]: DeviceSettings;
    };
}

const initialState: DeviceState = {
    mode: OperatingMode.DAY,
    status: {
        [DeviceKind.COOLING]: {
            lastPingTimestamp: "1970-01-01T00:00:00",
            isDegraded: true,
            isWorking: false,
        },
        [DeviceKind.HEATING]: {
            lastPingTimestamp: "1970-01-01T00:00:00",
            isDegraded: true,
            isWorking: false,
        },
    },
    settings: {
        [DeviceKind.COOLING]: {
            targetTemperature: {
                day: MAX_TEMP,
                night: MAX_TEMP,
            },
            controlledBy: {
                day: [],
                night: [],
            },
        },
        [DeviceKind.HEATING]: {
            targetTemperature: {
                day: MIN_TEMP,
                night: MIN_TEMP,
            },
            controlledBy: {
                day: [],
                night: [],
            },
        },
    }
};

export const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {
        degrade: (state, action: PayloadAction<DeviceKind>) => {
            state.status[action.payload].isDegraded = true;
        },
        ping: (state, action: PayloadAction<PingPayload>) => {
            const { kind, timestamp } = action.payload;
            state.status[kind].lastPingTimestamp = timestamp;
            state.status[kind].isDegraded = addSeconds(parseISO(timestamp), MAX_PING_AGE_SECONDS) < new Date();
        },
        updateStatus: (state, action: PayloadAction<UpdateStatusPayload>) => {
            state.status[action.payload.kind].isWorking = action.payload.isWorking;
        },
        updateTargetTemperature: (state, action: PayloadAction<UpdateTargetTemperaturePayload>) => {
            state.settings[action.payload.kind].targetTemperature[action.payload.mode] = action.payload.temperature;
        },
        updateDeviceControl: (state, action: PayloadAction<UpdateDeviceControlPayload>) => {
            state.settings[action.payload.deviceKind].controlledBy = action.payload.controlledBy;
        },
        setOperatingMode: (state, action: PayloadAction<OperatingMode>) => {
            state.mode = action.payload
        }
    },
});

export const registerDevicePing = deviceSlice.actions.ping;
export const degradeDevice = deviceSlice.actions.degrade;
export const setOperatingMode = deviceSlice.actions.setOperatingMode;
