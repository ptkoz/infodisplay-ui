import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { formatDistance, parseISO } from "date-fns";

const Text = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 0.2em);
    color: #e88010;
    font-size: min(2.2vh, 2.2vw);
    text-align: center;
`;

export interface DegradedProps {
    since: string; // ISO timestamp
    className?: string;
}

export function Degraded({ since, ...props }: DegradedProps) {
    const [ message, setMessage ] = useState<string>(
        () => formatDistance(parseISO(since), new Date(), { addSuffix: true })
    );

    useEffect(() => {
        setMessage(formatDistance(parseISO(since), new Date()));

        const updateInterval = setInterval(() => {
            setMessage(formatDistance(parseISO(since), new Date()));
        }, 60 * 1000);

        return () => {
            clearInterval(updateInterval);
        };
    }, [since, setMessage]);

    return <Text {...props}>{message}</Text>
}

export default Degraded;
