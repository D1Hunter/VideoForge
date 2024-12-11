import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import { FC } from "react";

interface DeleteConfirmationDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps> = ({
    open,
    title = "Delete Confirmation",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    onClose,
    onConfirm,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;