import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import PowerSettingsIcon from "@mui/icons-material/PowerSettingsNew";
import FlightIcon from "@mui/icons-material/Flight";
import styled from "@emotion/styled";

export const CoolingIconMono = styled(AcUnitIcon)`
    color: #aaa;
`;

export const CoolingIcon = styled(AcUnitIcon)`
    color: #4984bf;
`;

export const HeatingIconMono = styled(ThermostatIcon)`
    color: #aaa;
`;

export const HeatingIcon = styled(ThermostatIcon)`
    color: #e25822;
`;

export const HeatingPoweredOnIcon = styled(PowerSettingsIcon)`
    color: #aaa;
    stroke: #e25822;
`;

export const CoolingPoweredOnIcon = styled(PowerSettingsIcon)`
    color: #aaa;
    stroke: #4984bf;
    stroke-width: 1px;
`;

export const AwayIcon = styled(FlightIcon)`
    color: white;
    font-size: 0.9rem;
`;
