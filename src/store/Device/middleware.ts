import { AnyAction, Middleware } from "@reduxjs/toolkit";
import { addSeconds, differenceInMilliseconds, parseISO } from "date-fns";
import { degradeDevice, registerDevicePing } from "./slice.ts";
import { DeviceKind } from "./types.ts";

export const MAX_PING_AGE_SECONDS = 180;

function isPingAction(action: AnyAction): action is ReturnType<typeof registerDevicePing> {
    return action.type === registerDevicePing.type;
}

export const createDeviceDegradeMiddleware = (
    kind: DeviceKind,
    maxAge = MAX_PING_AGE_SECONDS,
): Middleware => {
    let timeout: NodeJS.Timeout | null = null;
    return (store) => (next) => (action: AnyAction) => {
        if (isPingAction(action) && action.payload.kind === kind) {
            if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
            }

            const degradeTimestamp = addSeconds(parseISO(action.payload.timestamp), maxAge);
            const now = new Date();

            if (degradeTimestamp >= now) {
                timeout = setTimeout(
                    () => {
                        store.dispatch(degradeDevice(kind));
                    },
                    differenceInMilliseconds(degradeTimestamp, now),
                );
            }
        }

        return next(action) as unknown;
    };
}
