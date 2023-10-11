import styled from "@emotion/styled";
import Label from "../layout/Label.tsx";
import Box, { Humidity, Value } from "../layout/Box.tsx";
import { toLocaleFixed } from "../utils/toLocaleFixed.ts";
import { useAppSelector } from "../store/store.ts";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import Degraded from "../layout/Degraded.tsx";
import { MeasureKind } from "../store/Measures/types.ts";

const BedroomBox = styled(Box)`
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
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
