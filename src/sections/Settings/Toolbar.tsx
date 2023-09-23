import { Button, Typography, Toolbar as MuiToolbar } from "@mui/material";
import { useCallback } from "react";

function Toolbar(props: { onClose: () => void; onSave: () => void }) {
    const handleReload = useCallback(() => {
        location.reload();
    }, []);

    return (
        <MuiToolbar disableGutters sx={{ padding: "0 1em" }}>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Ustawienia
            </Typography>
            <Button onClick={handleReload} color="inherit" style={{ marginRight: "1em" }} variant="outlined">
                przeładuj
            </Button>
            <Button onClick={props.onSave} color="inherit" style={{ marginRight: "1em" }} variant="outlined">
                zapisz
            </Button>
            <Button onClick={props.onClose} color="inherit" variant="outlined">
                zamknij
            </Button>
        </MuiToolbar>
    );
}

export default Toolbar;
