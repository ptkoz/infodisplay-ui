import { PropsWithChildren } from "react";
import styled from "@emotion/styled";

const SectionDiv = styled.div`
    padding: 0;
    margin: 0.2em 1em;
`;

const HeaderDiv = styled(SectionDiv)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5em;
    padding: 0.5em 0;
    border-top: solid 1px #999;
    border-bottom: solid 1px #999;
`;

export function Section(props: PropsWithChildren) {
    return <SectionDiv>{props.children}</SectionDiv>
}

export function SectionHeader(props: PropsWithChildren) {
    return <HeaderDiv>{props.children}</HeaderDiv>
}

SectionHeader.Text = styled.div`
    flex: 1;
`;
