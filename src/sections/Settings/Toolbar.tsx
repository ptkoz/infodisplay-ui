import { Typography, Toolbar as MuiToolbar, IconButton, Switch, FormControlLabel } from "@mui/material";
import { ChangeEvent, useCallback } from "react";
import SaveIcon from "@mui/icons-material/Done";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

interface ToolbarProps {
    isAway: boolean;

    onIsAwayChange(value: boolean): void;

    onClose(): void;

    onSave(): void;
}

function Toolbar({ isAway, onIsAwayChange, onClose, onSave }: ToolbarProps) {
    const handleReload = useCallback(() => {
        location.reload();
    }, []);

    const handleAwayChange = useCallback(
        (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            onIsAwayChange(checked);
        },
        [onIsAwayChange],
    );

    return (
        <MuiToolbar disableGutters sx={{ padding: "0 1em" }}>
            <Typography sx={{ flex: 1, display: { xs: "none", sm: "block" } }} variant="h6" component="div">
                Ustawienia
            </Typography>
            <FormControlLabel
                sx={{ flex: 1 }}
                control={<Switch checked={isAway} onChange={handleAwayChange} />}
                label={`Poza domem`}
            />
            <IconButton onClick={handleReload} color="inherit" style={{ marginRight: "0.6em" }}>
                <RefreshIcon />
            </IconButton>
            <IconButton onClick={onSave} color="inherit" style={{ marginRight: "0.6em" }}>
                <SaveIcon />
            </IconButton>
            <IconButton onClick={onClose} color="inherit">
                <CloseIcon />
            </IconButton>
        </MuiToolbar>
    );
}

export default Toolbar;
