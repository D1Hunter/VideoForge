import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { useState } from "react";
import { IProject } from "../../../interfaces/project.interface";

interface EditProjectPopupProps {
  open: boolean;
  project: IProject;
  onClose: () => void;
  onSave: (updatedProject: IProject) => void;
}

const EditProjectPopup: React.FC<EditProjectPopupProps> = ({ open, project, onClose, onSave }) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);

  const handleSave = () => {
    onSave({ ...project, title, description });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectPopup;