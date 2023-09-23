import { Room } from "../Measures/types.ts";

export interface TargetTemperature {
    day: number;
    night: number;
}

export interface DeviceState {
    lastPingTimestamp: string; // when did we receive the most recent ping
    isDegraded: boolean; // is the most recent ping older than 3 minutes
    isWorking: boolean; // is the device supposedly working
    targetTemperature: TargetTemperature; // what is the target temperature set for this device
    managedRooms: Room[]; // what rooms does this device manage
}
