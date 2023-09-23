import { Dialog, FormControlLabel, FormGroup, IconButton, Switch } from "@mui/material";
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
import { Room } from "../store/Measures/types.ts";

const SettingsButton = styled(IconButton)`
    position: absolute;
    top: 1vh;
    right: 1vh;
    color: #333;
`;

const createRoomsHandler =
    (rooms: Room[], room: Room, setState: Dispatch<SetStateAction<Room[]>>) =>
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (checked && !rooms.includes(room)) {
            setState([...rooms, room]);
        }

        if (!checked && rooms.includes(room)) {
            const newRooms = rooms.slice();
            newRooms.splice(rooms.indexOf(room), 1);
            setState(newRooms);
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

    const defaultCoolingTemp = useAppSelector((state) => state.ac.cooling.targetTemperature);
    const defaultHeatingTemp = useAppSelector((state) => state.ac.heating.targetTemperature);
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

    const defaultCoolingRooms = useAppSelector((state) => state.ac.cooling.managedRooms);
    const defaultHeatingRooms = useAppSelector((state) => state.ac.heating.managedRooms);
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
                    <Grid container component={FormGroup}>
                        <Grid xs={3} sx={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                            <CoolingIcon /> Chłodzenie
                        </Grid>
                        <Grid xs={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={coolingRooms.includes(Room.LIVING_ROOM)}
                                        onChange={useMemo(
                                            () =>
                                                createRoomsHandler(
                                                    coolingRooms,
                                                    Room.LIVING_ROOM,
                                                    setCoolingRooms,
                                                ),
                                            [coolingRooms, setCoolingRooms],
                                        )}
                                    />
                                }
                                label="Salon"
                            />
                        </Grid>
                    </Grid>
                    <Grid container component={FormGroup}>
                        <Grid xs={3} sx={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                            <HeatingIcon /> Ogrzewanie
                        </Grid>
                        <Grid xs={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={heatingRooms.includes(Room.LIVING_ROOM)}
                                        onChange={createRoomsHandler(
                                            heatingRooms,
                                            Room.LIVING_ROOM,
                                            setHeatingRooms,
                                        )}
                                    />
                                }
                                label="Salon"
                            />
                        </Grid>
                        <Grid xs={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={heatingRooms.includes(Room.BEDROOM)}
                                        onChange={createRoomsHandler(
                                            heatingRooms,
                                            Room.BEDROOM,
                                            setHeatingRooms,
                                        )}
                                    />
                                }
                                label="Sypialnia"
                            />
                        </Grid>
                    </Grid>
                </Section>
                <SectionHeader>
                    <DayIcon />
                    <SectionHeader.Text>W dzień (07:00 - 22:59)</SectionHeader.Text>
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
                    <SectionHeader.Text>W nocy (23:00 - 06:59)</SectionHeader.Text>
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
