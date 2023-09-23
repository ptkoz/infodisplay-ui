import { forwardRef, ReactElement, Ref } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";

interface Props extends TransitionProps {
    children: ReactElement;
}

const SlideTransition = forwardRef(
    function Transition(props: Props, ref: Ref<unknown>) {
        const { children, ...rest } = props;
        return <Slide direction="left" ref={ref} {...rest}>{children}</Slide>;
    }
);

export default SlideTransition;
