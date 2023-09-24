import { Dialog, FormControlLabel, IconButton, Switch } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import SettingsIcon from "@mui/icons-material/Settings";
import DayIcon from "@mui/icons-material/LightMode";
import NightIcon from "@mui/icons-material/DarkMode";
import Toolbar from "./Settings/Toolbar.tsx";
import SlideTransition from "./Settings/SlideTransition.tsx";
import { Section, SectionHeader } from "./Settings/Section.tsx";
import styled from "@emotion/styled";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../store/store.ts";
import temperatureMarks, { MAX_TEMP, MIN_TEMP, MIN_TEMP_DISTANCE } from "./Settings/TemperatureMarks.ts";
import { toLocaleUnit } from "../utils/toLocaleUnit.ts";
import TemperatureSlider from "./Settings/TemperatureSlider.tsx";
import { CoolingIcon, HeatingIcon } from "../layout/Icons.ts";
import { MeasureKind } from "../store/Measures/types.ts";
import { DeviceKind, DeviceStatus, OperatingMode } from "../store/Device/types.ts";

const DAY_HOURS = "06:00 - 22:59";
const NIGHT_HOURS = "23:00 - 05:59";

type ControllingStatus = DeviceStatus["controlledBy"];

const SettingsButton = styled(IconButton)`
    position: absolute;
    top: 1vh;
    right: 1vh;
    color: #333;
`;

const createRoomsHandler =
    (
        status: ControllingStatus,
        measure: MeasureKind,
        mode: OperatingMode,
        setState: Dispatch<SetStateAction<ControllingStatus>>,
    ) =>
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (checked && !status[mode].includes(measure)) {
            const measureKinds = status[mode].slice();
            measureKinds.push(measure);
            setState({ ...status, [mode]: measureKinds });
        }

        if (!checked && status[mode].includes(measure)) {
            const measureKinds = status[mode].slice();
            measureKinds.splice(status[mode].indexOf(measure), 1);
            setState({ ...status, [mode]: measureKinds });
        }
    };

const createTempHandler =
    (setState: Dispatch<SetStateAction<number[]>>) =>
    (_event: Event, value: number | number[], activeThumb: number) => {
        if (!Array.isArray(value)) {
            return;
        }

        if (value[1] - value[0] < MIN_TEMP_DISTANCE) {
            if (activeThumb === 0) {
                const clamped = Math.min(value[0], MAX_TEMP - MIN_TEMP_DISTANCE);
                setState([clamped, clamped + MIN_TEMP_DISTANCE]);
            } else {
                const clamped = Math.max(value[1], MIN_TEMP + MIN_TEMP_DISTANCE);
                setState([clamped - MIN_TEMP_DISTANCE, clamped]);
            }
        } else {
            setState(value);
        }
    };

function Settings() {
    const [isOpened, setIsOpened] = useState(false);
    const handleOpen = useCallback(() => setIsOpened(true), []);
    const handleClose = useCallback(() => setIsOpened(false), []);

    const defaultCoolingTemp = useAppSelector((state) => state.device.status[DeviceKind.COOLING].targetTemperature);
    const defaultHeatingTemp = useAppSelector((state) => state.device.status[DeviceKind.HEATING].targetTemperature);
    const [dayTemp, setDayTemp] = useState([defaultHeatingTemp.day, defaultCoolingTemp.day]);
    const [nightTemp, setNightTemp] = useState([defaultHeatingTemp.night, defaultCoolingTemp.night]);
    useEffect(
        () => setDayTemp([defaultHeatingTemp.day, defaultCoolingTemp.day]),
        [defaultCoolingTemp, defaultHeatingTemp],
    );
    useEffect(
        () => setNightTemp([defaultHeatingTemp.night, defaultCoolingTemp.night]),
        [defaultCoolingTemp, defaultHeatingTemp],
    );

    const defaultCoolingRooms = useAppSelector((state) => state.device.status[DeviceKind.COOLING].controlledBy);
    const defaultHeatingRooms = useAppSelector((state) => state.device.status[DeviceKind.HEATING].controlledBy);
    const [coolingRooms, setCoolingRooms] = useState(defaultCoolingRooms);
    const [heatingRooms, setHeatingRooms] = useState(defaultHeatingRooms);
    useEffect(() => setCoolingRooms(defaultCoolingRooms), [defaultCoolingRooms]);
    useEffect(() => setHeatingRooms(defaultHeatingRooms), [defaultHeatingRooms]);

    return (
        <>
            <SettingsButton onClick={handleOpen}>
                <SettingsIcon />
            </SettingsButton>
            <Dialog open={isOpened} fullScreen={true} onClose={handleClose} TransitionComponent={SlideTransition}>
                <Toolbar onClose={handleClose} onSave={handleClose} />
                <Section>
                    <Grid container>
                        <Grid xs={3}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5em", paddingTop: "0.4em" }}>
                                <CoolingIcon /> Chłodzenie
                            </div>
                        </Grid>
                        <Grid xs={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={coolingRooms.day.includes(MeasureKind.LIVING_ROOM)}
                                        onChange={useMemo(
                                            () =>
                                                createRoomsHandler(
                                                    coolingRooms,
                                                    MeasureKind.LIVING_ROOM,
                                                    OperatingMode.DAY,
                                                    setCoolingRooms,
                                                ),
                                            [coolingRooms, setCoolingRooms],
                                        )}
                                    />
                                }
                                label={`Salon (${DAY_HOURS})`}
                            />
                        </Grid>
                        <Grid xs={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={coolingRooms.night.includes(MeasureKind.LIVING_ROOM)}
                                        onChange={useMemo(
                                            () =>
                                                createRoomsHandler(
                                                    coolingRooms,
                                                    MeasureKind.LIVING_ROOM,
                                                    OperatingMode.NIGHT,
                                                    setCoolingRooms,
                                                ),
                                            [coolingRooms, setCoolingRooms],
                                        )}
                                    />
                                }
                                label={`Salon (${NIGHT_HOURS})`}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid xs={3}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5em", paddingTop: "0.4em" }}>
                                <HeatingIcon /> Ogrzewanie
                            </div>
                        </Grid>
                        <Grid xs={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={heatingRooms.day.includes(MeasureKind.LIVING_ROOM)}
                                        onChange={createRoomsHandler(
                                            heatingRooms,
                                            MeasureKind.LIVING_ROOM,
                                            OperatingMode.DAY,
                                            setHeatingRooms,
                                        )}
                                    />
                                }
                                label={`Salon (${DAY_HOURS})`}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={heatingRooms.day.includes(MeasureKind.BEDROOM)}
                                        onChange={createRoomsHandler(
                                            heatingRooms,
                                            MeasureKind.BEDROOM,
                                            OperatingMode.DAY,
                                            setHeatingRooms,
                                        )}
                                    />
                                }
                                label={`Sypialnia (${DAY_HOURS})`}
                            />
                        </Grid>
                        <Grid xs={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={heatingRooms.night.includes(MeasureKind.LIVING_ROOM)}
                                        onChange={createRoomsHandler(
                                            heatingRooms,
                                            MeasureKind.LIVING_ROOM,
                                            OperatingMode.NIGHT,
                                            setHeatingRooms,
                                        )}
                                    />
                                }
                                label={`Salon (${NIGHT_HOURS})`}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={heatingRooms.night.includes(MeasureKind.BEDROOM)}
                                        onChange={createRoomsHandler(
                                            heatingRooms,
                                            MeasureKind.BEDROOM,
                                            OperatingMode.NIGHT,
                                            setHeatingRooms,
                                        )}
                                    />
                                }
                                label={`Sypialnia (${NIGHT_HOURS})`}
                            />
                        </Grid>
                    </Grid>
                </Section>
                <SectionHeader>
                    <DayIcon />
                    <SectionHeader.Text>W dzień ({DAY_HOURS})</SectionHeader.Text>
                    <HeatingIcon /> {toLocaleUnit(dayTemp[0], "°C")}
                    <CoolingIcon /> {toLocaleUnit(dayTemp[1], "°C")}
                </SectionHeader>
                <Section>
                    <TemperatureSlider
                        value={dayTemp}
                        onChange={createTempHandler(setDayTemp)}
                        marks={temperatureMarks}
                    />
                </Section>
                <SectionHeader>
                    <NightIcon />
                    <SectionHeader.Text>W nocy ({NIGHT_HOURS})</SectionHeader.Text>
                    <HeatingIcon /> {toLocaleUnit(nightTemp[0], "°C")}
                    <CoolingIcon /> {toLocaleUnit(nightTemp[1], "°C")}
                </SectionHeader>
                <Section>
                    <TemperatureSlider
                        value={nightTemp}
                        onChange={createTempHandler(setNightTemp)}
                        marks={temperatureMarks}
                    />
                </Section>
            </Dialog>
        </>
    );
}

export default Settings;
