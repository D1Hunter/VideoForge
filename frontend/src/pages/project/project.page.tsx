import { Box, Button, Card, CardContent, CircularProgress, Container, Grid2 as Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectAPI } from "../../services/project.service";

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = projectAPI.useFetchProjectQuery(projectId ? projectId : "");

  useEffect(() => {
    if (!projectId) {
      navigate("/");
    }
  }, [projectId, navigate]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !project) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" color="error">
          Project not found
        </Typography>
        <Button onClick={() => navigate("/")} variant="contained" sx={{ mt: 2 }}>
          Go Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        {project.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {project.description}
        <Typography variant="body1">
          <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
        </Typography>
      </Typography>

      <Grid container spacing={3}>
        <Grid sx={{ xs: 12, md: 6 }}>
          <Card>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/edit-project/" + project.id)}
        >
          Edit Project
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default ProjectPage;