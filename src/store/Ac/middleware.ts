import { AnyAction, Middleware } from "@reduxjs/toolkit";
import { addSeconds, differenceInMilliseconds, parseISO } from "date-fns";
import { degradeAc, registerAcPing } from "./slice.ts";

export const MAX_PING_AGE_SECONDS = 180;
let timeout: NodeJS.Timeout | null = null;

function isPingAction(action: AnyAction): action is ReturnType<typeof registerAcPing> {
    return action.type === registerAcPing.type;
}

export const pingDegradingMiddleware: Middleware = (store) => (next) => (action: AnyAction) => {
    if (isPingAction(action)) {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }

        const degradeTimestamp = addSeconds(parseISO(action.payload), MAX_PING_AGE_SECONDS);
        const now = new Date();

        if (degradeTimestamp >= now) {
            timeout = setTimeout(
                () => {
                    store.dispatch(degradeAc());
                },
                differenceInMilliseconds(degradeTimestamp, now),
            );
        }
    }

    return next(action) as unknown;
};
