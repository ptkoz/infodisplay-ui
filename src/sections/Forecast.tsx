import styled from "@emotion/styled";
import Box from "../layout/Box.tsx";
import { useEffect, useState } from "react";
import { getWeatherForecast, WeatherForecast } from "../utils/weather.ts";
import { addHours, differenceInMilliseconds, format } from "date-fns";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import runBackgroundTask from "../utils/runBackgroundTask.ts";

const ForecastBox = styled(Box)`
    grid-column: 1 / span 2;
    grid-row: 3 / span 1;
    color: #aaaaaa;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: flex-start;
`;

const ForecastItem = styled.div`
    font-size: min(3vh, 2vw);
    flex: 0 0 15vw;
    max-width: 19vw;

    > div {
        text-overflow: ellipsis;
        text-align: center;
        margin: 0.2em 0;
    }

    img {
        height: min(6.5vh, 7vw);
        margin: 0.5em;
    }
`;

function Forecast() {
    const [forecast, setForecast] = useState<WeatherForecast[]>([]);

    useEffect(() => {
        let refreshTimeout: NodeJS.Timer | null = null;

        const refreshForecast = () => {
            runBackgroundTask(async () => {
                setForecast(await getWeatherForecast());
            })

            // Run 10 seconds after at next full hour
            const now = new Date();
            const nextRunDate = addHours(
                new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 10, 0),
                1,
            );

            refreshTimeout = setTimeout(refreshForecast, differenceInMilliseconds(nextRunDate, now));
        };

        refreshForecast();
        return () => {
            if (refreshTimeout) {
                clearInterval(refreshTimeout);
            }
        };
    }, []);

    return (
        <ForecastBox>
            {forecast.map((item, key) => (
                <ForecastItem key={key}>
                    <div>{format(item.date, "EE, HH:mm")}</div>
                    <div>
                        <img src={`/assets/${item.code}.svg`} alt={item.desc} />
                    </div>
                    <div>{toLocaleUnit(item.temperature, "°C", 0)}</div>
                    <div>{item.desc}</div>
                </ForecastItem>
            ))}
        </ForecastBox>
    );
}

export default Forecast;
