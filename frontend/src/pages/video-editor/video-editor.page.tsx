import { Add as AddIcon } from "@mui/icons-material";
import { Box, Button, Container, IconButton, Slider, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import VideoTimeline from "../../components/timeline/video-timeline.component";
import Timeline from "./components/timeline.component";

interface Frame {
    time: number; // Час кадру у секундах
    image: string; // Зображення кадру (base64 або URL)
}

const VideoEditorPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<string | null>(null); // Завантажене відео
    const [frames, setFrames] = useState<Frame[]>([]); // Масив кадрів
    const [duration, setDuration] = useState<number>(0); // Загальна тривалість відео
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleFrameSelect = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time; // Оновлюємо час відео
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
            console.log("Extract frames start");
            processFrames(); // Витягуємо кадри (20 кадрів як приклад)
        }
    };

    const processFrames = async () => {
        const video = videoRef.current;
        if (!video) return;

        // Wait for video metadata to be ready
        await new Promise<void>((resolve) => {
          if (video.readyState >= 1) {
            resolve();
          } else {
            video.addEventListener("loadedmetadata", () => resolve(), { once: true });
          }
        });
    
        const frameRate = 5; // Frames per second (adjustable)
        const duration = video.duration;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
    
        if (!ctx) {
          console.error("Canvas rendering context not available.");
          return;
        }
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        const framePromises: Promise<Frame>[] = [];
    
        for (let time = 0; time < duration; time += 1 / frameRate) {
          framePromises.push(
            new Promise<Frame>((resolve) => {
              video.currentTime = time;
    
              // Wait for video to seek and render
              video.addEventListener(
                "seeked",
                () => {
                  // Small delay to ensure the frame is rendered
                  setTimeout(() => {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const image = canvas.toDataURL("image/png"); // Convert to base64 image
                    resolve({ time, image }); // Return time and image as Frame
                  }, 50); // Adjust delay if frames are still black
                },
                { once: true }
              );
            })
          );
        }
    
        const allFrames = await Promise.all(framePromises);
        setFrames(allFrames); // Update state with extracted frames
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

            <Timeline frames={frames} isPlaying={isPlaying} currentTime={currentTime} onFrameSelect={handleFrameSelect} onPlayFromFrame={handlePlayFromFrame} onTogglePlayPause={handleTogglePlayPause} />
        </Container>
    );
};

export default VideoEditorPage;