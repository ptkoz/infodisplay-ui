import styled from "@emotion/styled";
import Label from "../layout/Label.tsx";
import Box from "../layout/Box.tsx";
import { useAppSelector } from "../store.ts";
import { toLocaleFixed } from "../utils/toLocaleFixed.ts";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";

const LivingRoomBox = styled(Box)`
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
`;

const Value = styled.div`
    font-size: min(9vh, 10vw);
`;

const Humidity = styled.span`
    font-size: min(3vh, 4vw);
    margin-left: min(2vh, 2vw);
    color: #aaaaaa;
`;

function LivingRoom() {
    const temperature = useAppSelector((state) => state.measures.livingRoom.temperature);
    const humidity = useAppSelector((state) => state.measures.livingRoom.humidity);

    return (
        <LivingRoomBox>
            <Label>Salon</Label>
            <Value>
                {toLocaleUnit(temperature, "°C")}
                <Humidity>{toLocaleFixed(humidity)}%</Humidity>
            </Value>
        </LivingRoomBox>
    );
}

export default LivingRoom;
