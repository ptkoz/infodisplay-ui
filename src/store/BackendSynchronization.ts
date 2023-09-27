import { isString } from "../utils/typeGuards";
import { AppDispatch } from "./store";

let socket: WebSocket | null = null;

/**
 * Starts and maintains websocket communication with info-display backend. Information received from
 * backend are immediately dispatched as actions.
 */
export function maintainBackendCommunication(dispatch: AppDispatch) {
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
            dispatch(JSON.parse(message.data));
        }
    };

    const connect = () => {
        socket = new WebSocket("wss://infodisplay.wro.tuxlan.es:44310");

        socket.addEventListener("open", clearReconnectTimeout);
        socket.addEventListener("message", dispatchMessage);
        socket.addEventListener("close", reconnectOnClose);
    };

    connect();
}

export function sendToBackend(data: unknown): void {
    if (socket === null || socket.readyState !== WebSocket.OPEN) {
        throw new Error('Not connected');
    }

    socket.send(JSON.stringify(data));
}
