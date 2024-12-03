import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { videoAPI } from "../../services/video.service";
import VideoTimeline from "../../components/timeline/video-timeline.component";

interface Frame {
  time: number;
  image: string;
}

interface EditorProps {
  id?: string;
  title?: string;
  duration?: number;
}

const EditorPage: FC<EditorProps> = ({ id, title, duration }) => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [interval, setInterval] = useState<[number, number]>([0, 300]);

  const { data: videoBlob, isLoading: isFetching, error: fetchError } = videoAPI.useFetchVideoByIdQuery(videoId || "");

  const [uploadVideo, { isLoading: isUploading, error: uploadError }] = videoAPI.useUploadVideoMutation();

  const [processVideo, { isLoading: isProcessing, error: processError }] =
    videoAPI.useProcessVideoMutation();

  useEffect(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setFilePreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoBlob]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await uploadVideo({ formData, projectId: videoId || "" }).unwrap();
        setFilePreview(response.filePath);
        setUploadedFile(file);
      } catch (err) {
        console.error("Error uploading video:", err);
      }
    }
  };

  if (!videoId && !filePreview) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Upload Video
        </Typography>
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button variant="contained" component="label">
            Choose Video
            <input type="file" accept="video/*" hidden onChange={handleFileChange} />
          </Button>
          {isUploading && <CircularProgress sx={{ mt: 2 }} />}
          {uploadError && (
            <Typography color="error" variant="body1" sx={{ mt: 2 }}>
              Failed to upload video
            </Typography>
          )}
        </Box>
      </Container>
    );
  }

  if (isFetching) {
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

  if (fetchError) {
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
          Failed to load video
        </Typography>
        <Button onClick={() => navigate("/")} variant="contained" sx={{ mt: 2 }}>
          Go Back to Dashboard
        </Button>
      </Box>
    );
  }

  const handleChange = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    setInterval(newValue as [number, number]);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        {videoId ? "Edit Video" : "Upload Video"}
      </Typography>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {filePreview && (
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="video"
              src={filePreview}
              controls
              sx={{ height: 400 }}
            />
            <CardContent>
              <Typography variant="h6">{uploadedFile ? uploadedFile.name : "Existing Video"}</Typography>
            </CardContent>
          </Card>
        )}

        <Button variant="contained" component="label">
          {videoId ? "Replace Video" : "Upload Video"}
          <input type="file" accept="video/*" hidden onChange={handleFileChange} />
        </Button>
        {isUploading && <CircularProgress sx={{ mt: 2 }} />}
        {uploadError && (
          <Typography color="error" variant="body1" sx={{ mt: 2 }}>
            Failed to upload video
          </Typography>
        )}
      </Box>
      <Button>Invert</Button>
      <VideoTimeline
        duration={videoDuration}
        steps={10} value={interval}
        onChange={handleChange}
        formatTime={formatTime} />
    </Container>
  );
};

export default EditorPage;