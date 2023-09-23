import { useAppSelector } from "../store/store.ts";
import styled from "@emotion/styled";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import Degraded from "../layout/Degraded.tsx";
import { ReactNode } from "react";
import {
    CoolingPoweredOnIcon,
    CoolingIconMono,
    HeatingPoweredOnIcon,
    HeatingIconMono,
    HeatingIcon,
    CoolingIcon,
} from "../layout/Icons.ts";
import { DeviceState } from "../store/Ac/types.ts";

const InfoBox = styled.div`
    position: absolute;
    right: 1vh;
    top: min(2vh, 2vw);
`;

const Container = styled.div`
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0.2em;
`;

const TargetTemperature = styled.div`
    font-size: min(3.5vh, 2.5vw);
    margin: 0 0.2em;
`;

interface DeviceInfoProps {
    status: DeviceState;
    deviceIcon: ReactNode;
    deviceEnabledIcon: ReactNode;
    powerOnIcon: ReactNode;
}

function DeviceInfo({ status, deviceIcon, deviceEnabledIcon, powerOnIcon }: DeviceInfoProps) {
    const mode = useAppSelector((state) => state.ac.mode);

    if (status.managedRooms.length === 0) {
        return null;
    }

    return (
        <>
            <Container style={{ color: status.isDegraded ? "#222" : "#aaa" }}>
                {status.isWorking && powerOnIcon}
                {status.isWorking ? deviceEnabledIcon : deviceIcon}
                <TargetTemperature>{toLocaleUnit(status.targetTemperature[mode], "°C")}</TargetTemperature>
            </Container>
            {status.isDegraded && (
                <Container>
                    <Degraded since={status.lastPingTimestamp} />
                </Container>
            )}
        </>
    );
}

export function DeviceInfoBox() {
    const coolingIconStyle = { fontSize: "min(3vh, 2.5vw)", paddingLeft: "calc(min(0.3vh, 0.3vw) - 0.07em)" };
    const heatingIconStyle = { fontSize: "min(3.3vh, 2.8vw)", marginRight: "-0.07em" };
    const powerIconStyle = { fontSize: "min(2vh, 1.6vw)" };

    return (
        <InfoBox>
            <DeviceInfo
                status={useAppSelector((state) => state.ac.cooling)}
                deviceIcon={<CoolingIconMono sx={coolingIconStyle} />}
                deviceEnabledIcon={<CoolingIcon sx={coolingIconStyle} />}
                powerOnIcon={<CoolingPoweredOnIcon sx={powerIconStyle} />}
            />
            <DeviceInfo
                status={useAppSelector((state) => state.ac.heating)}
                deviceIcon={<HeatingIconMono sx={heatingIconStyle} />}
                deviceEnabledIcon={<HeatingIcon sx={heatingIconStyle} />}
                powerOnIcon={<HeatingPoweredOnIcon sx={powerIconStyle} />}
            />
        </InfoBox>
    );
}
