import { FC, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import { IProject } from "../../../interfaces/project.interface";

interface SaveVideoPopupProps {
    open: boolean;
    onClose: () => void;
    onSave: (fileName: string, projectId: string) => void;
    projects: IProject[];
}

const SaveVideoPopup: FC<SaveVideoPopupProps> = ({ open, onClose, onSave, projects }) => {
    const [fileName, setFileName] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("");

    const handleSave = () => {
        if (fileName.trim()) {
            onSave(fileName.trim(), selectedProjectId);
            setFileName("");
            onClose();
        }
    };

    const handleClose = () => {
        setFileName("");
        setSelectedProjectId("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Video</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="File Name"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="project-select-label">Select Project</InputLabel>
                    <Select
                        labelId="project-select-label"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                        {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id}>
                                {project.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" disabled={!fileName.trim() || !selectedProjectId}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SaveVideoPopup;