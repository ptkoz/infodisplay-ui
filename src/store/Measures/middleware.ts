import { AnyAction, Middleware, PayloadAction } from "@reduxjs/toolkit";
import { addSeconds, differenceInMilliseconds, parseISO } from "date-fns";
import { updateTemperature, degradeMeasure } from "./slice.ts";
import { TemperatureUpdatePayload } from "./types.ts";

export const MAX_TEMPERATURE_AGE_SECONDS = 1500;

function isTemperatureAction(action: AnyAction): action is PayloadAction<TemperatureUpdatePayload> {
    return action.type === updateTemperature.type;
}

export const createMeasureDegradeMiddlewareForKind = (
    kind: number,
    maxAge = MAX_TEMPERATURE_AGE_SECONDS,
): Middleware => {
    let timeout: NodeJS.Timeout | null = null;
    return (store) => (next) => (action: AnyAction) => {
        if (isTemperatureAction(action) && action.payload.kind === kind) {
            if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
            }

            const degradeTimestamp = addSeconds(parseISO(action.payload.timestamp), maxAge);
            const now = new Date();

            if (degradeTimestamp >= now) {
                timeout = setTimeout(
                    () => {
                        store.dispatch(degradeMeasure(kind));
                    },
                    differenceInMilliseconds(degradeTimestamp, now),
                );
            }
        }

        return next(action) as unknown;
    };
};
