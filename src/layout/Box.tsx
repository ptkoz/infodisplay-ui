import styled from "@emotion/styled";

export default styled.div`
    padding: 0.5rem;
    margin: 0.2rem;
    background: #060606;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
`;

export const Value = styled.div`
    position: relative;
    font-size: 1em;
    color: ${(props: { isDegraded: boolean }) => props.isDegraded ? "#222" : "#fff"};

    @media (min-width: 500px) {
        font-size: 1.8em;
    }

    @media (min-width: 700px) {
        font-size: 2.5em;
    }
`;

export const Humidity = styled.span`
    font-size: min(0.36em, 1.3rem);
    margin-left: 0.7em;
    color: #aaaaaa;
    container: box-humidity;
`;
