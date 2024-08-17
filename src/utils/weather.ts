import { addDays, addHours, fromUnixTime, min } from "date-fns";
import { getTimes as getSunTimes } from "suncalc";
import { isForecastResponse, isString, isWeatherResponse } from "./typeGuards.ts";

const LAT = 51.083594782357665;
const LON = 17.015219351090085;
const API_KEY: string = isString(import.meta.env.VITE_WEATHER_API_KEY) ? import.meta.env.VITE_WEATHER_API_KEY : "";

export interface CurrentWeather {
    code: string;
    desc: string;
    humidity?: number;
    temperature?: number;
}

export interface WeatherResponse {
    weather: {
        icon: string;
        description: string;
    }[];
    main: {
        temp?: number;
        humidity?: number;
    }
}

export const getCurrentWeather = async (): Promise<CurrentWeather> => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=pl`,
    );

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: unknown = await response.json();
    if (!isWeatherResponse(data)) {
        throw new Error("Invalid response received");
    }

    return {
        code: data.weather[0].icon,
        desc: data.weather[0].description,
        humidity: data.main.humidity,
        temperature: data.main.temp,
    };
};

export interface WeatherForecast {
    date: Date;
    code: string;
    desc: string;
    temperature: number;
}

export interface ForecastResponse {
    list: {
        dt: number;
        main: {
            temp: number;
        };
        weather: {
            icon: string;
            description: string;
        }[];
    }[];
}

export const getWeatherForecast = async (): Promise<WeatherForecast[]> => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&cnt=7&lang=pl`,
    );
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: unknown = await response.json();
    if (!isForecastResponse(data)) {
        throw new Error("Invalid response received");
    }

    const minDisplayDate = addHours(new Date(), 1);
    return data.list.map((item): WeatherForecast => ({
        date: fromUnixTime(item.dt),
        code: item.weather[0].icon,
        desc: item.weather[0].description,
        temperature: item.main.temp,
    })).filter((item) => item.date > minDisplayDate).slice(0, 6)
};

/**
 * Get the first sunrise / sunset happening after given time
 */
export const getNextSunriseOrSunsetAfter = (after: Date): Date => {
    const today = getSunTimes(after, LAT, LON);
    const tomorrow = getSunTimes(addDays(after, 1), LAT, LON);

    const possibilities = [today.sunriseEnd, today.sunset, tomorrow.sunriseEnd, tomorrow.sunset];

    return min(possibilities.filter((item) => item > after));
};
