import styled from "@emotion/styled";
import Label from "../layout/Label.tsx";
import Box from "../layout/Box.tsx";
import { useAppSelector } from "../store/store.ts";
import { toLocaleFixed } from "../utils/toLocaleFixed.ts";
import { useEffect, useState } from "react";
import { CurrentWeather, getCurrentWeather, getNextSunriseOrSunsetAfter } from "../utils/weather.ts";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import { addHours, addSeconds, differenceInMilliseconds, min } from "date-fns";
import runBackgroundTask from "../utils/runBackgroundTask.ts";
import Degraded from "../layout/Degraded.tsx";

const OutdoorBox = styled(Box)`
    grid-column: 1 / span 2;
    grid-row: 2 / span 1;
`;

const Value = styled.div`
    position: relative;
    font-size: min(20vh, 12vw);
    color: ${(props: { isDegraded: boolean }) => props.isDegraded ? "#222" : "#fff"};
`;

const Humidity = styled.span`
    font-size: min(4vh, 5vw);
    margin-left: min(4vh, 4vw);
    color: #aaaaaa;
`;

const Weather = styled.div`
    flex: 0 0 0;
    margin-right: min(5vh, 5vw);
    text-align: center;
    font-size: min(4vh, 5vw);

    > img {
        height: min(8vh, 9vw);
        margin-bottom: 1.2vh;
    }
`;

function Bedroom() {
    const temperature = useAppSelector((state) => state.measures.outdoor.temperature);
    const [weather, setWeather] = useState<CurrentWeather>({ code: "01d", desc: "słonecznie" });
    const isDegraded = useAppSelector((state) => state.measures.outdoor.isDegraded);
    const lastUpdate = useAppSelector((state) => state.measures.outdoor.lastTemperatureUpdate);

    useEffect(() => {
        let refreshTimeout: NodeJS.Timer | null = null;

        const refreshWeather = () => {
            runBackgroundTask(async () => {
                setWeather(await getCurrentWeather());
            })

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
            <Value isDegraded={isDegraded}>
                {toLocaleUnit(temperature, "°C")}
                <Humidity>{toLocaleFixed(weather.humidity)}%</Humidity>
                {isDegraded && <Degraded since={lastUpdate} />}
            </Value>
        </OutdoorBox>
    );
}

export default Bedroom;
