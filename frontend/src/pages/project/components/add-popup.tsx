import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

interface AddVideoPopupProps {
    open: boolean;
    onClose: () => void;
}


const AddVideoPopup = ({ open, onClose }: AddVideoPopupProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleAddProject = () => {
        if (name && description) {
            onClose();
        } else {
            alert("Please fill out all fields.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Upload Video</DialogTitle>
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

export default AddVideoPopup;