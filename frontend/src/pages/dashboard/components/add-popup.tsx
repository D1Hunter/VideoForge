import { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { IProject } from "../../../interfaces/project.interface";

interface AddTransactionPopupProps {
    open: boolean;
    onClose: () => void;
    onAddProject: (project: IProject) => void;
}

const AddProjectPopup = ({ open, onClose, onAddProject }: AddTransactionPopupProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleAddProject = () => {
        if (name && description) {
            onAddProject({
                id: "",
                name,
                description
            });
            onClose();
        } else {
            alert("Please fill out all fields.");
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent>
                <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Project Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Project Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleAddProject} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProjectPopup;