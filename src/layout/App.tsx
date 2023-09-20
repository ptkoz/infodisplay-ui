import "./App.css";
import LivingRoom from "../sections/LivingRoom.tsx";
import styled from "@emotion/styled";
import Bedroom from "../sections/Bedroom.tsx";
import Outdoor from "../sections/Outdoor.tsx";
import { useEffect } from "react";
import { store } from "../store.ts";
import { Provider } from "react-redux";
import Forecast from "../sections/Forecast.tsx";
import { isString } from "../utils/typeGuards.ts";

const Container = styled.div`
    display: grid;
    grid-template-columns: 50vw 50vw;
    grid-template-rows: 24vh 44vh 32vh;
`;

function App() {
    useEffect(() => {
        let socket: WebSocket | null = null;
        let reconnectTimeoutIntervalSeconds = 1;
        let reconnectTimeout: NodeJS.Timer | null = null;

        const clearReconnectTimeout = () => {
            reconnectTimeoutIntervalSeconds = 1;
            if (reconnectTimeout !== null) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }
        };

        const reconnectOnClose = () => {
            socket = null;
            console.warn(`Connection dropped, reconnecting in ${reconnectTimeoutIntervalSeconds}s...`);
            reconnectTimeout = setTimeout(connect, reconnectTimeoutIntervalSeconds * 1000);
            reconnectTimeoutIntervalSeconds = Math.min(reconnectTimeoutIntervalSeconds * 2, 15);
        };

        const dispatchMessage = (message: MessageEvent) => {
            if (isString(message.data)) {
                store.dispatch(JSON.parse(message.data));
            }
        };

        const connect = () => {
            socket = new WebSocket("wss://infodisplay.wro.tuxlan.es:44310");

            socket.addEventListener("open", clearReconnectTimeout);
            socket.addEventListener("message", dispatchMessage);
            socket.addEventListener("close", reconnectOnClose);
        };

        connect();

        return () => {
            clearReconnectTimeout();
            if (socket) {
                socket.removeEventListener("close", reconnectOnClose);
                socket.close();
            }
        };
    }, []);

    return (
        <Provider store={store}>
            <Container>
                <LivingRoom />
                <Bedroom />
                <Outdoor />
                <Forecast />
            </Container>
        </Provider>
    );
}

export default App;
