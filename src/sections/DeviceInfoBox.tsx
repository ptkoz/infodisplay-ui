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
import { DeviceKind, DeviceSettings, DeviceStatus } from "../store/Device/types.ts";

const InfoBox = styled.div`
    position: absolute;
    right: 0.3em;
    top: 0.6em;
`;

const Container = styled.div`
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0.5em;
    position: relative;
    font-size: 1rem;
`;

const TargetTemperature = styled.div`
    margin: 0 0.2em;
`;

const DegradedDevice = styled(Degraded)`
    top: calc(100% - 0.2em);
    font-size: 0.6em;
`;

interface DeviceInfoProps {
    status: DeviceStatus;
    settings: DeviceSettings;
    deviceIcon: ReactNode;
    deviceEnabledIcon: ReactNode;
    powerOnIcon: ReactNode;
}

function DeviceInfo({ status, settings, deviceIcon, deviceEnabledIcon, powerOnIcon }: DeviceInfoProps) {
    const mode = useAppSelector((state) => state.device.mode);

    if (settings.controlledBy[mode].length === 0) {
        return null;
    }

    return (
        <Container style={{ color: status.isDegraded ? "#222" : "#aaa" }}>
            {status.isWorking && powerOnIcon}
            {status.isWorking ? deviceEnabledIcon : deviceIcon}
            <TargetTemperature>{toLocaleUnit(settings.targetTemperature[mode], "°C")}</TargetTemperature>
            {status.isDegraded && <DegradedDevice since={status.lastPingTimestamp} />}
        </Container>
    );
}

export function DeviceInfoBox() {
    const coolingIconStyle = { fontSize: "0.9em", paddingLeft: "0.07rem" };
    const heatingIconStyle = { fontSize: "1em", marginRight: "-0.07rem" };
    const powerIconStyle = { fontSize: "0.6em" };

    return (
        <InfoBox>
            <DeviceInfo
                status={useAppSelector(state => state.device.status[DeviceKind.COOLING])}
                settings={useAppSelector(state => state.device.settings[DeviceKind.COOLING])}
                deviceIcon={<CoolingIconMono sx={coolingIconStyle} />}
                deviceEnabledIcon={<CoolingIcon sx={coolingIconStyle} />}
                powerOnIcon={<CoolingPoweredOnIcon sx={powerIconStyle} />}
            />
            <DeviceInfo
                status={useAppSelector((state) => state.device.status[DeviceKind.HEATING])}
                settings={useAppSelector(state => state.device.settings[DeviceKind.HEATING])}
                deviceIcon={<HeatingIconMono sx={heatingIconStyle} />}
                deviceEnabledIcon={<HeatingIcon sx={heatingIconStyle} />}
                powerOnIcon={<HeatingPoweredOnIcon sx={powerIconStyle} />}
            />
        </InfoBox>
    );
}
