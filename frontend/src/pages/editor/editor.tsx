import { Add as AddIcon } from "@mui/icons-material";
import { Box, Button, Container, IconButton, Slider, Typography } from "@mui/material";
import { useRef, useState } from "react";

const EditorPage = () => {
    const [videoFile, setVideoFile] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("video/")) {
            setVideoFile(URL.createObjectURL(file)); // Передається URL як string
        } else {
            alert("Please upload a valid video file.");
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef && videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleVideoLoaded = () => {
        if (videoRef && videoRef.current) {
        setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (_event: Event, value: number | number[]) => {
        if (videoRef.current && typeof value === "number") {
          videoRef.current.currentTime = value;
          setCurrentTime(value);
        }
      };

    return (
        <Container style={{ width: '100%', marginTop: '2rem' }}>
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
                    {/* Video Player */}
                    <video
                        ref={videoRef}
                        src={videoFile}
                        controls
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleVideoLoaded}
                        style={{ width: "100%", borderRadius: "8px" }}
                    />

                    {/* Timeline Slider */}
                    <Box sx={{ mt: 2 }}>
                        <Slider
                            value={currentTime}
                            max={duration}
                            step={0.1}
                            onChange={handleSeek}
                            aria-labelledby="video-timeline"
                        />
                        <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                            {new Date(currentTime * 1000).toISOString().substring(11, 19)} / {" "}
                            {new Date(duration * 1000).toISOString().substring(11, 19)}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Container >
    )
}

export default EditorPage;