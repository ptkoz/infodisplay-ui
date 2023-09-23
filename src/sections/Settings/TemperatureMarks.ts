import { toLocaleUnit } from "../../utils/toLocaleUnit.ts";

export const MIN_TEMP = 18;
export const MAX_TEMP = 26;
export const MIN_TEMP_DISTANCE = 1.2;

function generateMarks(min: number, max: number) {
    return [...Array(max - min + 1).keys()].map((temp) => ({
        value: temp + min,
        label: toLocaleUnit(temp + min, "°C"),
    }));
}

const temperatureMarks = generateMarks(MIN_TEMP, MAX_TEMP);

export default temperatureMarks;
