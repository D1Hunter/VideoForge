import { Add as AddIcon } from "@mui/icons-material";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { useRef, useState } from "react";
import VideoTimeline from "../../components/timeline/video-timeline.component";

interface Frame {
  time: number;
  image: string;
}

const EditorPage = () => {
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<Frame[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      extractFrames(videoRef.current, 10); // Витягуємо 10 фреймів
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const extractFrames = (video: HTMLVideoElement, frameCount: number) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const extractedFrames: Frame[] = [];
    const interval = video.duration / frameCount;

    for (let i = 0; i < frameCount; i++) {
      video.currentTime = i * interval; // Перемотка на потрібний момент
      video.onseeked = () => {
        if (context) {
          canvas.width = video.videoWidth / 4; // Зменшення розміру
          canvas.height = video.videoHeight / 4;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          extractedFrames.push({
            time: video.currentTime,
            image: canvas.toDataURL("image/jpeg"),
          });
          if (extractedFrames.length === frameCount) {
            setFrames(extractedFrames);
          }
        }
      };
    }
  };

  return (
    <Container style={{ width: "100%", marginTop: "2rem" }}>
      {!videoFile && (
        <>
          <IconButton
            color="default"
            size="large"
            component="label"
            sx={{ backgroundColor: "blue" }}
          >
            <AddIcon fontSize="large" />
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleFileUpload}
            />
          </IconButton>
          <Typography>Click to upload video</Typography>
        </>
      )}
      {videoFile && (
        <Box sx={{ mt: 4 }}>
          {/* Відеоплеєр */}
          <video
            ref={videoRef}
            src={videoFile}
            controls
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleVideoLoaded}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          {/* Таймлайн */}
          <VideoTimeline
            frames={frames}
            duration={duration}
            currentTime={currentTime}
            onSeek={handleSeek}
          />
        </Box>
      )}
    </Container>
  );
};

export default EditorPage;