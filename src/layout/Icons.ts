import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThermostatIcon from "@mui/icons-material/Thermostat"
import PowerSettingsIcon from '@mui/icons-material/PowerSettingsNew';
import styled from "@emotion/styled";



export const CoolingIconMono = styled(AcUnitIcon)`
    color: #aaa;
`;

export const CoolingIcon = styled(AcUnitIcon)`
    color: #4984BF;
`

export const HeatingIconMono = styled(ThermostatIcon)`
    color: #aaa;
`;

export const HeatingIcon = styled(ThermostatIcon)`
    color: #E25822;
`

export const HeatingPoweredOnIcon = styled(PowerSettingsIcon)`
    color: #aaa;
    stroke: #E25822;
`;

export const CoolingPoweredOnIcon = styled(PowerSettingsIcon)`
    color: #aaa;
    stroke: #4984BF;
    stroke-width: 1px;
`;
