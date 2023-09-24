export enum MeasureKind {
    LIVING_ROOM = 0x20,
    BEDROOM = 0x21,
    OUTDOOR = 0x41
}

export interface MeasureStatus {
    lastTemperatureUpdate: string;
    isDegraded: boolean;
    temperature?: number;
    humidity?: number;
}

export interface TemperatureUpdatePayload {
    timestamp: string;
    kind: MeasureKind;
    temperature: number;
}

export interface HumidityUpdatePayload {
    timestamp: string;
    kind: MeasureKind;
    humidity: number;
}
