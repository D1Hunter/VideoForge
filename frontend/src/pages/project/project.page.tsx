import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, Grid2 as Grid, IconButton, Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectAPI } from "../../services/project.service";
import { videoAPI } from "../../services/video.service";

/*
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
      </Box>
    </Container>
  );
};*/
interface VideoData {
  file: File;
  thumbnail: string;
}

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = projectAPI.useFetchProjectQuery(projectId ? projectId : "");
  const [uploadedVideos, setUploadedVideos] = useState<VideoData[]>([]);
  const [uploadVideo] = videoAPI.useUploadVideoMutation();

  useEffect(() => {
    if (!projectId) {
      navigate("/");
    }
  }, [projectId, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);

      try {
        const id = projectId || "";
        await uploadVideo({formData,projectId:id}).unwrap();
      } catch (err) {
        console.error("Error uploading video:", err);
      }

      // Генерація прев'ю (перший кадр з відео)
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.currentTime = 1; // Встановлюємо час для отримання кадру

      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");

        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL("image/png");
          setUploadedVideos((prev) => [
            ...prev,
            { file, thumbnail },
          ]);
          URL.revokeObjectURL(video.src); // Звільняємо ресурси
        }
      };
    }
  };

  const handleDelete = (index: number) => {
    setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    // Логіка для редагування відео
    console.log("Editing video:", uploadedVideos[index]);
    // Ви можете реалізувати це як відкриття модального вікна чи перенаправлення на іншу сторінку.
  };

  const getFileNameWithoutExtension = (fileName: string) => {
    return fileName.replace(/\.[^/.]+$/, ""); // Видаляє розширення файлу
  };

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
          <Card></Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Button variant="contained" component="label">
          Upload Video
          <input
            type="file"
            accept="video/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {uploadedVideos.map((video, index) => (
          <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card>
              <CardMedia
                component="img"
                src={video.thumbnail}
                alt={`Thumbnail for ${video.file.name}`}
                sx={{ height: 200, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6">
                  {getFileNameWithoutExtension(video.file.name)}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(index)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectPage;