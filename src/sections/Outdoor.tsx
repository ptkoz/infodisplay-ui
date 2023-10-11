import styled from "@emotion/styled";
import Label from "../layout/Label.tsx";
import Box, { Humidity, Value } from "../layout/Box.tsx";
import { useAppSelector } from "../store/store.ts";
import { toLocaleFixed } from "../utils/toLocaleFixed.ts";
import { useEffect, useState } from "react";
import { CurrentWeather, getCurrentWeather, getNextSunriseOrSunsetAfter } from "../utils/weather.ts";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import { addHours, addSeconds, differenceInMilliseconds, min } from "date-fns";
import runBackgroundTask from "../utils/runBackgroundTask.ts";
import Degraded from "../layout/Degraded.tsx";
import { MeasureKind } from "../store/Measures/types.ts";

const OutdoorBox = styled(Box)`
    grid-column: 1 / span 2;
    grid-row: 2 / span 1;
    font-size: 2.4rem;
`;

const Weather = styled.div`
    flex: 0 0 0;
    margin-right: 1em;
    text-align: center;
    font-size: 0.3em;

    > img {
        height: 1.8em;
        margin-bottom: 0.2em;
    }
    
    @media (min-width: 700px) {
        font-size: 0.45em;

        > img {
            height: 2.1em;
            margin-bottom: 0.3em;
        }
    }
`;

function Outdoor() {
    const status = useAppSelector((state) => state.measure[MeasureKind.OUTDOOR]);
    const [weather, setWeather] = useState<CurrentWeather>({ code: "01d", desc: "słonecznie" });

    useEffect(() => {
        let refreshTimeout: NodeJS.Timer | null = null;

        const refreshWeather = () => {
            runBackgroundTask(async () => {
                setWeather(await getCurrentWeather());
            });

            // Run 10 seconds after at next full hour or 10 seconds after sunrise or sunset
            const now = new Date();

            const nextRunDate = min([
                addHours(new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 10, 0), 1),
                addSeconds(getNextSunriseOrSunsetAfter(now), 10),
            ]);

            refreshTimeout = setTimeout(refreshWeather, differenceInMilliseconds(nextRunDate, now));
        };

        refreshWeather();
        return () => {
            if (refreshTimeout) {
                clearInterval(refreshTimeout);
            }
        };
    }, []);

    return (
        <OutdoorBox>
            <Label>Na zewnątrz</Label>
            <Weather>
                <img src={`/assets/${weather.code}.svg`} alt={weather.desc} />
                {weather.desc}
            </Weather>
            <Value isDegraded={status.isDegraded}>
                {toLocaleUnit(status.temperature, "°C")}
                <Humidity>{toLocaleFixed(weather.humidity)}%</Humidity>
                {status.isDegraded && <Degraded since={status.lastTemperatureUpdate} />}
            </Value>
        </OutdoorBox>
    );
}

export default Outdoor;
