import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import { Card, CardContent, Container, Grid2 as Grid, IconButton, Typography } from "@mui/material"
import AddProjectPopup from "./components/add-popup";
import { useState } from "react";
import { IProject } from "../../interfaces/project.interface";
import { projectAPI } from "../../services/project.service";
import { useNavigate } from "react-router-dom";
import EditProjectPopup from "./components/edit-popup";
import DeleteConfirmationDialog from "../../components/delete-dialog.component";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editProjectData, setEditProjectData] = useState<IProject | null>(null);
  const { data: projects = [], refetch } = projectAPI.useFetchProjectsQuery(null);
  const [addProject] = projectAPI.useAddProjectMutation();
  const [editProject] = projectAPI.useUpdateProjectMutation();
  const [deleteProject] = projectAPI.useDeleteProjectMutation();

  const handleAddProject = async (newProject: Omit<IProject, "id" | "createdAt">) => {
    try {
      await addProject(newProject).unwrap();
      setOpenAddPopup(false);
      refetch();
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const handleEditProject = (project: IProject) => {
    setEditProjectData(project);
    setOpenEditPopup(true);
  };

  const handleDeleteProject = async () => {
    try {
      if (selectedProjectId) {
        await deleteProject(selectedProjectId).unwrap();
        refetch();
      }
    }
    catch (err) {
      console.error("Error deleting project:", err);
    } finally {
      setOpenDeletePopup(false);
      setSelectedProjectId(null);
    }
  };

  const handleDeleteProjectConfirmation = (id: string) => {
    setSelectedProjectId(id);
    setOpenDeletePopup(true);
  };

  const handleSaveEditedProject = async (updatedProject: IProject) => {
    try {
      await editProject(updatedProject).unwrap();
      console.log("Edited")
      setOpenEditPopup(false);
      refetch();
    } catch (err) {
      console.error("Error editing project:", err);
    }
  };


  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "200px",
    minWidth: "150px",
    cursor: "pointer",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    bgcolor: "#e0dede"
  };

  return (
    <>
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Projects
        </Typography>
        <Grid container spacing={3} component={Grid}>
          {projects.map((project) => (
            <Grid sx={{ xs: 12, sm: 6, md: 3 }} key={project.id}>
              <Card sx={cardStyle} onClick={() => navigate("/project/" + project.id)}>
                <CardContent sx={{ textAlign: "center", width: "100%" }}>
                  <Typography variant="h6" component="div">
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                </CardContent>
                <Grid container justifyContent="space-between" sx={{ padding: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProject(project);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProjectConfirmation(project.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Card>
            </Grid>
          ))}
          <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                ...cardStyle,
                justifyContent: "center",
                border: "1px dashed #ccc",
                alignItems: "center",
                transition: "transform 0.2s ease-in-out",
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              onClick={() => setOpenAddPopup(true)}
            >
              <AddCircleOutline fontSize="large" color="action" />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                Add New Project
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <AddProjectPopup
        open={openAddPopup}
        onClose={() => setOpenAddPopup(false)}
        onAddProject={handleAddProject}
      />
      {editProjectData && (
        <EditProjectPopup
          open={openEditPopup}
          project={editProjectData}
          onClose={() => setOpenEditPopup(false)}
          onSave={handleSaveEditedProject}
        />
      )}
      <DeleteConfirmationDialog
        open={openDeletePopup}
        onClose={() => setOpenDeletePopup(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </>
  );
};

export default Dashboard;