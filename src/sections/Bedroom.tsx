import styled from "@emotion/styled";
import Label from "../layout/Label.tsx";
import Box from "../layout/Box.tsx";
import { toLocaleFixed } from "../utils/toLocaleFixed.ts";
import { useAppSelector } from "../store/store.ts";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import Degraded from "../layout/Degraded.tsx";

const BedroomBox = styled(Box)`
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
`;

const Value = styled.div`
    position: relative;
    font-size: min(9vh, 10vw);
    color: ${(props: { isDegraded: boolean }) => props.isDegraded ? "#222" : "#fff"};
`;

const Humidity = styled.span`
    font-size: min(3vh, 4vw);
    margin-left: min(2vh, 2vw);
    color: #aaaaaa;
`;

function Bedroom() {
    const temperature = useAppSelector((state) => state.measures.bedroom.temperature);
    const humidity = useAppSelector((state) => state.measures.bedroom.humidity);
    const isDegraded = useAppSelector((state) => state.measures.bedroom.isDegraded);
    const lastUpdate = useAppSelector((state) => state.measures.bedroom.lastTemperatureUpdate);

    return (
        <BedroomBox>
            <Label>Sypialnia</Label>
            <Value isDegraded={isDegraded}>
                {toLocaleUnit(temperature, "°C")}
                <Humidity>{toLocaleFixed(humidity)}%</Humidity>
                {isDegraded && <Degraded since={lastUpdate} />}
            </Value>
        </BedroomBox>
    );
}

export default Bedroom;
