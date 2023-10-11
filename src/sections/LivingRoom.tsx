import styled from "@emotion/styled";
import Label from "../layout/Label.tsx";
import Box, { Humidity, Value } from "../layout/Box.tsx";
import { useAppSelector } from "../store/store.ts";
import { toLocaleFixed } from "../utils/toLocaleFixed.ts";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import { DeviceInfoBox } from "./DeviceInfoBox.tsx";
import Degraded from "../layout/Degraded.tsx";
import { MeasureKind } from "../store/Measures/types.ts";

const LivingRoomBox = styled(Box)`
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
`;

function LivingRoom() {
    const status = useAppSelector((state) => state.measure[MeasureKind.LIVING_ROOM]);

    return (
        <LivingRoomBox>
            <Label>Salon</Label>
            <Value isDegraded={status.isDegraded}>
                {toLocaleUnit(status.temperature, "°C")}
                <Humidity>{toLocaleFixed(status.humidity)}%</Humidity>
                {status.isDegraded && <Degraded since={status.lastTemperatureUpdate} />}
            </Value>
            <DeviceInfoBox />
        </LivingRoomBox>
    );
}

export default LivingRoom;
