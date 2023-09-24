import styled from "@emotion/styled";
import Label from "../layout/Label.tsx";
import Box from "../layout/Box.tsx";
import { toLocaleFixed } from "../utils/toLocaleFixed.ts";
import { useAppSelector } from "../store/store.ts";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import Degraded from "../layout/Degraded.tsx";
import { MeasureKind } from "../store/Measures/types.ts";

const BedroomBox = styled(Box)`
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
`;

const Value = styled.div`
    position: relative;
    font-size: min(9vh, 5vw);
    color: ${(props: { isDegraded: boolean }) => props.isDegraded ? "#222" : "#fff"};
`;

const Humidity = styled.span`
    font-size: min(3vh, 3vw);
    margin-left: min(2vh, 2vw);
    color: #aaaaaa;
`;

function Bedroom() {
    const status = useAppSelector((state) => state.measure[MeasureKind.BEDROOM]);

    return (
        <BedroomBox>
            <Label>Sypialnia</Label>
            <Value isDegraded={status.isDegraded}>
                {toLocaleUnit(status.temperature, "°C")}
                <Humidity>{toLocaleFixed(status.humidity)}%</Humidity>
                {status.isDegraded && <Degraded since={status.lastTemperatureUpdate} />}
            </Value>
        </BedroomBox>
    );
}

export default Bedroom;
