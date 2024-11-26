import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Container, Grid2 as Grid, IconButton, Typography } from "@mui/material"
import AddProjectPopup from "./components/add-popup";
import { useState } from "react";
import { IProject } from "../../interfaces/project.interface";
import { projectAPI } from "../../services/project.service";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const { data: projects = [], refetch } = projectAPI.useFetchProjectsQuery(null);
  const [addProject] = projectAPI.useAddProjectMutation();
  const [deleteProject] = projectAPI.useDeleteProjectMutation();

  const handleAddProject = async (newProject: Omit<IProject, "id"|"createdAt">) => {
    try {
      await addProject(newProject).unwrap();
      setOpenPopup(false);
      refetch();
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const handleEditProject = (id:string) => {
    console.log(`Edit project ${id}`);
  };

  const handleDeleteProject = async (id:string) => {
    try {
      await deleteProject(id).unwrap();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "200px",
    cursor: "pointer",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    bgcolor:"#e0dede"
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
                      handleEditProject(project.id);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Card>
            </Grid>
          ))}

          {/* Add New Project Card */}
          <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                ...cardStyle,
                justifyContent: "center",
                border: "1px dashed #ccc",
                alignItems: "center",
              }}
              onClick={() => setOpenPopup(true)}
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
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onAddProject={handleAddProject}
      />
    </>
  );
};

export default Dashboard;