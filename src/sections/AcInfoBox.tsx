import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import { useAppSelector } from "../store/store.ts";
import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import Degraded from "../layout/Degraded.tsx";

const InfoBox = styled.div`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
`;

const Container = styled.div`
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
`;

interface StatusProps {
    isWorking: boolean;
    isDegraded: boolean;
}

const TargetTemperature = styled.div`
    font-size: min(3.5vh, 4.5vw);
    color: ${(props: StatusProps) => (props.isDegraded ? "#222" : "#aaa")};
    margin: 0 0.2em;
`;

const styledIconsOptions = {
    shouldForwardProp: (prop: string) => isPropValid(prop),
};

const BlowingIcon = styled(AirIcon, styledIconsOptions)`
    font-size: min(2.5vh, 2.5vw);
    color: ${(props: StatusProps) => (props.isDegraded ? "#222" : props.isWorking ? "#4984BF" : "#444")};
    display: ${(props: StatusProps) => (props.isWorking ? "block" : "none")};
`;

const AcUnitPictogram = styled(AcUnitIcon, styledIconsOptions)`
    font-size: min(3vh, 3vw);
    color: ${(props: StatusProps) => (props.isDegraded ? "#222" : props.isWorking ? "#4984BF" : "#444")};
`;

export function AcInfoBox() {
    const isDegraded = useAppSelector((state) => state.ac.isDegraded);
    const isWorking = useAppSelector((state) => state.ac.isWorking);
    const lastPing = useAppSelector((state) => state.ac.lastPingTimestamp);
    const targetTemperature = useAppSelector((state) => state.ac.targetTemperature);

    return (
        <InfoBox>
            <Container>
                <BlowingIcon isWorking={isWorking} isDegraded={isDegraded} />
                <AcUnitPictogram isWorking={isWorking} isDegraded={isDegraded} />
                <TargetTemperature isWorking={isWorking} isDegraded={isDegraded}>
                    {toLocaleUnit(targetTemperature, "°C")}
                </TargetTemperature>
            </Container>

            {isDegraded && (
                <Container>
                    <Degraded since={lastPing} />
                </Container>
            )}
        </InfoBox>
    );
}
