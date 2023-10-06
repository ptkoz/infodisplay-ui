import { MeasureKind } from "../Measures/types.ts";

export enum OperatingMode {
    DAY = "day", // comfort mode
    NIGHT = "night", // economy mode
}

export enum DeviceKind {
    COOLING = 0x30,
    HEATING = 0x31,
}

export interface DeviceStatus {
    lastPingTimestamp: string; // when did we receive the most recent ping
    isDegraded: boolean; // is the most recent ping older than 3 minutes
    isWorking: boolean; // is the device supposedly working
}

export interface DeviceSettings {
    targetTemperature: { // what is the target temperature set for this device
        [key in OperatingMode]: number;
    };
    controlledBy: { // what measures do control this device
        [key in OperatingMode]: MeasureKind[];
    };
}

export interface PingPayload {
    kind: DeviceKind; // device kind
    timestamp: string; // the ping timestamp
}

export interface UpdateStatusPayload {
    kind: DeviceKind; // device kind
    isWorking: boolean; // whether device is turned on or not
}

export interface UpdateTargetTemperaturePayload {
    kind: DeviceKind; // for which device this target temperature applies
    mode: OperatingMode; // for which operating mode this target temperature applies
    temperature: number; // the temperature
}

export interface UpdateDeviceControlPayload {
    deviceKind: DeviceKind; // which device manages these rooms
    controlledBy: {  // what measures do control this device
        [key in OperatingMode]: MeasureKind[]
    };
}
