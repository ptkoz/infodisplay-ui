import "./App.css";
import LivingRoom from "../sections/LivingRoom.tsx";
import styled from "@emotion/styled";
import Bedroom from "../sections/Bedroom.tsx";
import Outdoor from "../sections/Outdoor.tsx";
import { store } from "../store/store.ts";
import { Provider } from "react-redux";
import Forecast from "../sections/Forecast.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import Settings from "../sections/Settings.tsx";

const Container = styled.div`
    display: grid;
    grid-template-columns: 50vw 50vw;
    grid-template-rows: 24vh 44vh 32vh;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    
    @media (min-width: 1000px) {
        grid-template-columns: 500px 500px;
    }
    
    @media (min-height: 610px) {
        grid-template-rows: 170px 270px 170px;
    }
`;

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontWeightLight: "100",
        fontWeightMedium: "100",
        fontWeightRegular: "100",
        fontWeightBold: "300",
    }
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Provider store={store}>
                <Container>
                    <LivingRoom />
                    <Bedroom />
                    <Outdoor />
                    <Forecast />
                    <Settings />
                </Container>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
