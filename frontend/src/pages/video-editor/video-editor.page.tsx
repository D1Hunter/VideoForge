import { Add as AddIcon } from "@mui/icons-material";
import { Box, Button, Container, IconButton, Slider, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Timeline from "../../components/timeline/video-timeline.component";

interface Frame {
    time: number; // Час кадру у секундах
    image: string; // Зображення кадру (base64 або URL)
}

const VideoEditorPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<string | null>(null);
    const [frames, setFrames] = useState<Frame[]>([]);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleFrameSelect = (frame: number) => {
        const time = frame / 24;
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    // Завантаження відео
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("video/")) {
            setVideoFile(URL.createObjectURL(file));
        } else {
            alert("Please upload a valid video file.");
        }
    };

    // Завантаження метаданих відео
    const handleVideoLoaded = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            setDuration(video.duration); // Встановлюємо тривалість відео
        }
    };

    useEffect(() => {

    }, [frames, isPlaying])

    const handlePlayFromFrame = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    if (!videoFile) {
        return (
            <Container sx={{ mt: 4, textAlign: "center" }}>
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
            </Container>
        );
    }

    const handleTogglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying); // Перемикаємо стан
        }
    };

    return (
        <Container sx={{ mt: 4 }}>

            <Box sx={{ mb: 4 }}>
                <video
                    ref={videoRef}
                    src={videoFile}
                    controls
                    style={{ width: "100%", borderRadius: "8px" }}
                    onLoadedMetadata={handleVideoLoaded}
                    onTimeUpdate={handleTimeUpdate}
                />
            </Box>

            <Timeline
                videoDuration={duration}
                currentSecond={currentTime}
                onFrameSelect={handleFrameSelect}
                frameRate={24}
            />
        </Container>
    );
};

export default VideoEditorPage;