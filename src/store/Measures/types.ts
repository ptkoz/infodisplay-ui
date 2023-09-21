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
