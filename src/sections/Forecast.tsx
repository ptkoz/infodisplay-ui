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
    gap: 0.5em;
`;

const ForecastItem = styled.div`
    font-size: 0.5rem;
    flex: 1 1 0;

    > div {
        text-overflow: ellipsis;
        text-align: center;
        margin: 0.2em 0;
    }

    img {
        height: 20px;
        margin: 0.5em;
    }

    @media (min-width: 600px) {
        font-size: 0.9rem;

        img {
            height: 31px;
        }
    }
`;

const AirQuality = styled(ForecastItem)`
    margin-right: 1remq;
`;

function Forecast() {
    const [forecast, setForecast] = useState<WeatherForecast[]>([]);

    useEffect(() => {
        let refreshTimeout: NodeJS.Timer | null = null;

        const refreshForecast = () => {
            runBackgroundTask(async () => {
                setForecast(await getWeatherForecast());
            });

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
            <AirQuality>
                <iframe
                    id="airly_1499970474"
                    src="https://airly.org/widget/v2/?width=200height=150&displayMeasurements=false&displayCAQI=true&autoHeight=false&autoWidth=false&language=pl&indexType=AIRLY_US_AQI&unitSpeed=metric&unitTemperature=celsius&latitude=51.0835207349&longitude=17.01502344"
                    style={{ border: "0px none", width: "200px" }}
                ></iframe>
            </AirQuality>
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
