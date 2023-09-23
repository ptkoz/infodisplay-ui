import { Slider, SliderProps, SliderThumb } from "@mui/material";
import { Mark } from "@mui/base/useSlider/useSlider.types";
import styled from "@emotion/styled";
import { HTMLAttributes } from "react";
import { CoolingIconMono, HeatingIconMono } from "../../layout/Icons.ts";

type TemperatureSliderProps = Omit<SliderProps, "valueLabelDisplay" | "step" | "min" | "max" | "marks"> & {
    marks: Mark[];
};

const SliderContainer = styled.div`
    padding: 0 1em;
`;

const StyledSlider = styled(Slider)``;
const StyledSliderThumb = styled(SliderThumb)`
    background: ${(props) => ("data-index" in props && props["data-index"] === 0 ? "#E25822" : "#4984BF")};
    font-size: 90%;
`;

function Thumb(props: HTMLAttributes<unknown>) {
    const { children, ...other } = props;

    return (
        <StyledSliderThumb {...other}>
            {children}
            {"data-index" in props && props["data-index"] === 1 ? (
                <CoolingIconMono style={{ fontSize: "80%", color: "#fff" }} />
            ) : (
                <HeatingIconMono style={{ fontSize: "90%", color: "#fff" }} />
            )}
        </StyledSliderThumb>
    );
}

function TemperatureSlider(props: TemperatureSliderProps) {
    return (
        <SliderContainer>
            <StyledSlider
                slots={{ thumb: Thumb }}
                valueLabelDisplay="off"
                step={0.1}
                min={props.marks[0].value}
                max={props.marks[props.marks.length - 1].value}
                {...props}
            />
        </SliderContainer>
    );
}

export default TemperatureSlider;
