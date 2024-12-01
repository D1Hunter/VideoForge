import { Box, Button, CircularProgress, Container, Grid2 as Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectAPI } from "../../services/project.service";
import { videoAPI } from "../../services/video.service";
import { IVideo } from "../../interfaces/video.interface";
import { formatVideoDuration, getFileNameWithoutExtension } from "./helpers/helpers";
import VideoCard from "./components/video-card";

interface VideoData {
  file: File | null;
  thumbnail: string;
  id?: string;
  title?: string;
  duration: number;
}

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = projectAPI.useFetchProjectQuery(projectId ? projectId : "");
  const { data: videos } = videoAPI.useFetchVideosByProjectQuery(projectId ? projectId : "");
  const [uploadedVideos, setUploadedVideos] = useState<VideoData[]>([]);
  const [uploadVideo] = videoAPI.useUploadVideoMutation();
  const [deleteVideo] = videoAPI.useDeleteVideoMutation();

  useEffect(() => {
    if (!projectId) {
      navigate("/");
    }
  }, [projectId, navigate]);

  useEffect(() => {
    if (videos) {
      const mappedVideos = videos.map((video: IVideo) => (
        {
          file: null,
          thumbnail: video.thumbnailPath,
          id: video.id,
          title: video.title,
          duration: video.duration
        }));
      setUploadedVideos(mappedVideos as VideoData[]);
    }
  }, [videos]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      try {
        const id = projectId || "";
        await uploadVideo({ formData, projectId: id }).unwrap();
        setUploadedVideos((prev) => [
          ...prev,
          {
            file,
            thumbnail: "",
            duration: 100
          },
        ]);
      } catch (err) {
        console.error("Error uploading video:", err);
      }
    }
  };

  const handleDelete = async (videoId?: string) => {
    if (!videoId) return;
    try {
      await deleteVideo(videoId).unwrap();
      setUploadedVideos((prev) => prev.filter((video) => video.id !== videoId));
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  const handleEdit = (videoId?: string) => {
    if (videoId) {
      navigate(`/editor/${videoId}`);
    }
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
          <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={video.id || index}>
            <VideoCard
              video={video}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getFileNameWithoutExtension={getFileNameWithoutExtension}
              formatVideoDuration={formatVideoDuration}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectPage;