export interface TemperatureUpdatePayload {
    timestamp: string;
    kind: number;
    temperature: number;
}

export interface HumidityUpdatePayload {
    timestamp: string;
    kind: number;
    humidity: number;
}

export enum Room {
    LIVING_ROOM = 0x20,
    BEDROOM = 0x21,
    OUTDOOR = 0x41
}
