import { Dialog, FormControlLabel, IconButton, Switch, useMediaQuery } from "@mui/material";
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

const DAY_HOURS = "06:00 - 21:59";
const NIGHT_HOURS = "23:00 - 05:59";

type ControllingStatus = DeviceSettings["controlledBy"];

const SettingsButton = styled(IconButton)`
    position: absolute;
    top: 0.2em;
    right: 0.2em;
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

    const defaultIsAway = useAppSelector((state) => state.device.isAway);
    const defaultThresholdTemp = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(devicesSettings).map(([kind, settings]) => [kind, settings.thresholdTemperature]),
            ),
        [devicesSettings],
    );
    const defaultControlMeasures = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(devicesSettings).map(([kind, settings]) => [kind, settings.controlledBy]),
            ),
        [devicesSettings],
    );

    const [thresholdTemp, setThresholdTemp] = useState(defaultThresholdTemp);
    const [controlMeasures, setControlMeasures] = useState(defaultControlMeasures);
    const [isAway, setIsAway] = useState(defaultIsAway);

    useEffect(() => setThresholdTemp(defaultThresholdTemp), [defaultThresholdTemp, isOpened]);
    useEffect(() => setControlMeasures(defaultControlMeasures), [defaultControlMeasures, isOpened]);
    useEffect(() => setIsAway(defaultIsAway), [defaultIsAway, isOpened]);

    const handleSave = () => {
        try {
            sendToBackend({
                isAway,
                controlMeasures,
                thresholdTemperature: thresholdTemp,
            });
            handleClose();
        } catch {
            alert("Saving failed!");
        }
    };

    return (
        <>
            <SettingsButton onClick={handleOpen}>
                <SettingsIcon />
            </SettingsButton>
            <Dialog
                open={isOpened}
                fullScreen={useMediaQuery("(max-width: 800px)")}
                onClose={handleClose}
                TransitionComponent={SlideTransition}
            >
                <Toolbar onClose={handleClose} onSave={handleSave} isAway={isAway} onIsAwayChange={setIsAway} />
                <Section>
                    <Grid container>
                        <Grid xs={12} sm={3}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5em", paddingTop: "0.4em" }}>
                                <CoolingIcon /> Chłodzenie
                            </div>
                        </Grid>
                        <Grid xs={6} sm={4}>
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
                                label={`Salon (dzień)`}
                            />
                        </Grid>
                        <Grid xs={6} sm={4}>
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
                                label={`Salon (noc)`}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid xs={12} sm={3}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5em", paddingTop: "0.4em" }}>
                                <HeatingIcon /> Ogrzewanie
                            </div>
                        </Grid>
                        <Grid xs={6} sm={4}>
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
                                label={`Salon (dzień)`}
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
                                label={`Sypialnia (dzień)`}
                            />
                        </Grid>
                        <Grid xs={6} sm={4}>
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
                                label={`Salon (noc)`}
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
                                label={`Sypialnia (noc)`}
                            />
                        </Grid>
                    </Grid>
                </Section>
                <SectionHeader>
                    <DayIcon />
                    <SectionHeader.Text>W dzień ({DAY_HOURS})</SectionHeader.Text>
                    <HeatingIcon /> {toLocaleUnit(thresholdTemp[DeviceKind.HEATING].day, "°C")}
                    <CoolingIcon /> {toLocaleUnit(thresholdTemp[DeviceKind.COOLING].day, "°C")}
                </SectionHeader>
                <Section>
                    <TemperatureSlider
                        value={[thresholdTemp[DeviceKind.HEATING].day, thresholdTemp[DeviceKind.COOLING].day]}
                        onChange={createTempHandler(thresholdTemp, OperatingMode.DAY, setThresholdTemp)}
                        marks={temperatureMarks}
                    />
                </Section>
                <SectionHeader>
                    <NightIcon />
                    <SectionHeader.Text>W nocy ({NIGHT_HOURS})</SectionHeader.Text>
                    <HeatingIcon /> {toLocaleUnit(thresholdTemp[DeviceKind.HEATING].night, "°C")}
                    <CoolingIcon /> {toLocaleUnit(thresholdTemp[DeviceKind.COOLING].night, "°C")}
                </SectionHeader>
                <Section>
                    <TemperatureSlider
                        value={[thresholdTemp[DeviceKind.HEATING].night, thresholdTemp[DeviceKind.COOLING].night]}
                        onChange={createTempHandler(thresholdTemp, OperatingMode.NIGHT, setThresholdTemp)}
                        marks={temperatureMarks}
                    />
                </Section>
            </Dialog>
        </>
    );
}

export default Settings;
