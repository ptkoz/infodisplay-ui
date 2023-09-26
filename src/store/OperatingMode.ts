import { OperatingMode } from "./Device/types";
import { setOperatingMode } from "./Device/slice";
import { addHours, differenceInMilliseconds } from "date-fns";
import { AppDispatch } from "./store";

function determineOperatingMode(forDate: Date) {
    if (6 <= forDate.getHours() && forDate.getHours() < 23) {
        return OperatingMode.DAY;
    }

    return OperatingMode.NIGHT;
}

export function maintainOperatingMode(dispatch: AppDispatch) {
    const now = new Date();
    dispatch(setOperatingMode(determineOperatingMode(now)));

    const nextRunDate = addHours(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0),
        1,
    );

    setTimeout(() => maintainOperatingMode(dispatch), differenceInMilliseconds(nextRunDate, now));
}
