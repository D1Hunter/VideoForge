import { Box, Grid2 as Grid, Slider, Typography } from "@mui/material";
import "react-timeline-editor/dist/index.css";

interface TimelineProps {
    currentTime: number
    duration: number;
    onSeek: (value: number) => void;
}

const FrameTimeline = ({
    currentTime,
    duration,
    frames,
    onSeek,
}: {
    currentTime: number;
    duration: number;
    frames: string[];
    onSeek: (value: number) => void;
}) => {
    return (
        <Box sx={{ mt: 2, overflowX: "auto", whiteSpace: "nowrap" }}>
            <Slider
                value={currentTime}
                max={duration}
                step={0.1}
                onChange={(_, value) => onSeek(value as number)}
                aria-labelledby="video-timeline"
                sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {frames.map((frame, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={frame}
                        alt={`frame-${index}`}
                        sx={{
                            width: 100,
                            height: 60,
                            objectFit: "cover",
                            cursor: "pointer",
                            border: currentTime >= (index * duration) / frames.length &&
                                currentTime < ((index + 1) * duration) / frames.length
                                ? "2px solid blue"
                                : "1px solid gray",
                        }}
                        onClick={() => onSeek((index * duration) / frames.length)}
                    />
                ))}
            </Box>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                {new Date(currentTime * 1000).toISOString().substring(11, 19)} / {" "}
                {new Date(duration * 1000).toISOString().substring(11, 19)}
            </Typography>
        </Box>
    );
};

export default FrameTimeline;