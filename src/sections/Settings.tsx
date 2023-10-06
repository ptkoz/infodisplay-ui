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
import { DeviceKind, DeviceSettings, OperatingMode } from "../store/Device/types.ts";
import { sendToBackend } from "../store/BackendSynchronization.ts";

const DAY_HOURS = "06:00 - 22:59";
const NIGHT_HOURS = "23:00 - 05:59";

type ControllingStatus = DeviceSettings["controlledBy"];

const SettingsButton = styled(IconButton)`
    position: absolute;
    top: 1vh;
    right: 1vh;
    color: #333;
`;

const createMeasureHandler =
    (
        status: Record<string, ControllingStatus>,
        device: DeviceKind,
        measure: MeasureKind,
        mode: OperatingMode,
        setState: Dispatch<SetStateAction<Record<string, ControllingStatus>>>,
    ) =>
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (checked && !status[device][mode].includes(measure)) {
            const measureKinds = status[device][mode].slice();
            measureKinds.push(measure);
            setState({ ...status, [device]: { ...status[device], [mode]: measureKinds } });
        }

        if (!checked && status[device][mode].includes(measure)) {
            const measureKinds = status[device][mode].slice();
            measureKinds.splice(status[device][mode].indexOf(measure), 1);
            setState({ ...status, [device]: { ...status[device], [mode]: measureKinds } });
        }
    };

const createTempHandler =
    (
        status: Record<string, { [key in OperatingMode]: number }>,
        mode: OperatingMode,
        setState: Dispatch<SetStateAction<Record<string, { [key in OperatingMode]: number }>>>,
    ) =>
    (_event: Event, value: number | number[], activeThumb: number) => {
        if (!Array.isArray(value)) {
            return;
        }

        const mapToState = (heating: number, cooling: number) => ({
            ...status,
            [DeviceKind.HEATING]: {
                ...status[DeviceKind.HEATING],
                [mode]: heating,
            },
            [DeviceKind.COOLING]: {
                ...status[DeviceKind.COOLING],
                [mode]: cooling,
            },
        });

        if (value[1] - value[0] < MIN_TEMP_DISTANCE) {
            if (activeThumb === 0) {
                const clamped = Math.min(value[0], MAX_TEMP - MIN_TEMP_DISTANCE);
                setState(mapToState(clamped, clamped + MIN_TEMP_DISTANCE));
            } else {
                const clamped = Math.max(value[1], MIN_TEMP + MIN_TEMP_DISTANCE);
                setState(mapToState(clamped - MIN_TEMP_DISTANCE, clamped));
            }
        } else {
            setState(mapToState(value[0], value[1]));
        }
    };

function Settings() {
    const [isOpened, setIsOpened] = useState(false);
    const handleOpen = useCallback(() => setIsOpened(true), []);
    const handleClose = useCallback(() => setIsOpened(false), []);

    const devicesSettings = useAppSelector((state) => state.device.settings);

    const defaultTargetTemp = useMemo(
        () =>
            Object.fromEntries(Object.entries(devicesSettings).map(([kind, settings]) => [kind, settings.targetTemperature])),
        [devicesSettings],
    );
    const defaultControlMeasures = useMemo(
        () => Object.fromEntries(Object.entries(devicesSettings).map(([kind, settings]) => [kind, settings.controlledBy])),
        [devicesSettings],
    );

    const [targetTemp, setTargetTemp] = useState(defaultTargetTemp);
    const [controlMeasures, setControlMeasures] = useState(defaultControlMeasures);

    useEffect(() => setTargetTemp(defaultTargetTemp), [defaultTargetTemp, isOpened]);
    useEffect(() => setControlMeasures(defaultControlMeasures), [defaultControlMeasures, isOpened]);

    const handleSave = () => {
        try {
            sendToBackend({
                targetTemperature: targetTemp,
                controlMeasures: controlMeasures,
            });
            handleClose();
        } catch {
            alert('Saving failed!')
        }

    };

    return (
        <>
            <SettingsButton onClick={handleOpen}>
                <SettingsIcon />
            </SettingsButton>
            <Dialog open={isOpened} fullScreen={true} onClose={handleClose} TransitionComponent={SlideTransition}>
                <Toolbar onClose={handleClose} onSave={handleSave} />
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
                                        checked={controlMeasures[DeviceKind.COOLING].day.includes(
                                            MeasureKind.LIVING_ROOM,
                                        )}
                                        onChange={createMeasureHandler(
                                            controlMeasures,
                                            DeviceKind.COOLING,
                                            MeasureKind.LIVING_ROOM,
                                            OperatingMode.DAY,
                                            setControlMeasures,
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
                                        checked={controlMeasures[DeviceKind.COOLING].night.includes(
                                            MeasureKind.LIVING_ROOM,
                                        )}
                                        onChange={createMeasureHandler(
                                            controlMeasures,
                                            DeviceKind.COOLING,
                                            MeasureKind.LIVING_ROOM,
                                            OperatingMode.NIGHT,
                                            setControlMeasures,
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
                                        checked={controlMeasures[DeviceKind.HEATING].day.includes(
                                            MeasureKind.LIVING_ROOM,
                                        )}
                                        onChange={createMeasureHandler(
                                            controlMeasures,
                                            DeviceKind.HEATING,
                                            MeasureKind.LIVING_ROOM,
                                            OperatingMode.DAY,
                                            setControlMeasures,
                                        )}
                                    />
                                }
                                label={`Salon (${DAY_HOURS})`}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={controlMeasures[DeviceKind.HEATING].day.includes(MeasureKind.BEDROOM)}
                                        onChange={createMeasureHandler(
                                            controlMeasures,
                                            DeviceKind.HEATING,
                                            MeasureKind.BEDROOM,
                                            OperatingMode.DAY,
                                            setControlMeasures,
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
                                        checked={controlMeasures[DeviceKind.HEATING].night.includes(
                                            MeasureKind.LIVING_ROOM,
                                        )}
                                        onChange={createMeasureHandler(
                                            controlMeasures,
                                            DeviceKind.HEATING,
                                            MeasureKind.LIVING_ROOM,
                                            OperatingMode.NIGHT,
                                            setControlMeasures,
                                        )}
                                    />
                                }
                                label={`Salon (${NIGHT_HOURS})`}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={controlMeasures[DeviceKind.HEATING].night.includes(
                                            MeasureKind.BEDROOM,
                                        )}
                                        onChange={createMeasureHandler(
                                            controlMeasures,
                                            DeviceKind.HEATING,
                                            MeasureKind.BEDROOM,
                                            OperatingMode.NIGHT,
                                            setControlMeasures,
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
                    <HeatingIcon /> {toLocaleUnit(targetTemp[DeviceKind.HEATING].day, "°C")}
                    <CoolingIcon /> {toLocaleUnit(targetTemp[DeviceKind.COOLING].day, "°C")}
                </SectionHeader>
                <Section>
                    <TemperatureSlider
                        value={[targetTemp[DeviceKind.HEATING].day, targetTemp[DeviceKind.COOLING].day]}
                        onChange={createTempHandler(targetTemp, OperatingMode.DAY, setTargetTemp)}
                        marks={temperatureMarks}
                    />
                </Section>
                <SectionHeader>
                    <NightIcon />
                    <SectionHeader.Text>W nocy ({NIGHT_HOURS})</SectionHeader.Text>
                    <HeatingIcon /> {toLocaleUnit(targetTemp[DeviceKind.HEATING].night, "°C")}
                    <CoolingIcon /> {toLocaleUnit(targetTemp[DeviceKind.COOLING].night, "°C")}
                </SectionHeader>
                <Section>
                    <TemperatureSlider
                        value={[targetTemp[DeviceKind.HEATING].night, targetTemp[DeviceKind.COOLING].night]}
                        onChange={createTempHandler(targetTemp, OperatingMode.NIGHT, setTargetTemp)}
                        marks={temperatureMarks}
                    />
                </Section>
            </Dialog>
        </>
    );
}

export default Settings;
