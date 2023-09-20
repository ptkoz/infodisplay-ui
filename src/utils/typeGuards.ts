import { ForecastResponse, WeatherResponse } from "./weather.ts";

export function isString(data: unknown): data is string {
    return typeof data === "string";
}

export function isWeatherResponse(data: unknown): data is WeatherResponse {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if (!("main" in data) || !("weather" in data) || !Array.isArray(data.weather) || data.weather.length === 0) {
        return false;
    }

    const weather: unknown = data.weather[0];
    if (typeof weather !== "object" || weather === null) {
        return false;
    }

    if (
        !("icon" in weather) ||
        !("description" in weather) ||
        !isString(weather.icon) ||
        !isString(weather.description)
    ) {
        return false;
    }

    return (
        typeof data.main === "object" && data.main !== null && "temp" in data.main && Number.isFinite(data.main.temp)
    );
}

export function isForecastResponse(data: unknown): data is ForecastResponse {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if (!("list" in data) || !Array.isArray(data.list)) {
        return false;
    }

    return (
        data.list.filter((item) => isWeatherResponse(item) && "dt" in item && Number.isFinite(item.dt)).length ===
        data.list.length
    );
}
