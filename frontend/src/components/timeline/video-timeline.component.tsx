import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

interface Frame {
  time: number; // Час фрейма у секундах
  image: string; // Base64 або URL зображення
}

interface VideoTimelineProps {
  frames: Frame[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}
const VideoTimeline: React.FC<VideoTimelineProps> = ({
  frames,
  duration,
  currentTime,
  onSeek,
}) => {
  const cursorPosition = () => {
    const totalWidth = 100; // Відсотки ширини таймлайну
    return (currentTime / duration) * totalWidth;
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "120px",
        bgcolor: "#333",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Фрейми */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          position: "relative",
        }}
      >
        {frames.map((frame, index) => (
          <Box
            key={index}
            onClick={() => onSeek(frame.time)}
            sx={{
              width: `${100 / frames.length}%`,
              height: "100%",
              position: "relative",
              backgroundImage: `url(${frame.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                position: "absolute",
                bottom: "4px",
                left: "4px",
                color: "#fff",
                fontSize: "10px",
                textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
              }}
            >
              {frame.time.toFixed(1)}с
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Вертикальна лінія (курсор) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${cursorPosition()}%`,
          width: "2px",
          bgcolor: "red",
          pointerEvents: "none",
        }}
      ></Box>
    </Box>
  );
};

export default VideoTimeline;