import React, { useEffect, useRef, useState } from "react";
import { Box, Grid2 as Grid, Button, Typography, Tooltip, Slider, styled, Paper, Stack, IconButton } from "@mui/material";
import { Add, AddAPhoto, Pause, PlayArrow } from "@mui/icons-material";

interface Frame {
  time: number;
  image: string;
}

interface TimelineProps {
  frames: Frame[];
  currentTime: number;
  isPlaying:boolean;
  onFrameSelect: (time: number) => void;
  onPlayFromFrame: (time: number) => void;
  onTogglePlayPause: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ frames, currentTime, isPlaying, onFrameSelect, onPlayFromFrame, onTogglePlayPause }) => {
  const [selectedTime, setSelectedTime] = useState<number>(0);

  useEffect(() => {
    if (frames.length > 0) {
      const nearestFrame = frames.reduce((prev, curr) =>
        Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev
      );
      setSelectedTime(nearestFrame.time);
    }
  }, [currentTime, frames]);

  useEffect(() => {
  }, [frames]);

  const handleFrameClick = (time: number) => {
    setSelectedTime(time);
    onFrameSelect(time);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {/* Кнопка запуску */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <IconButton
          color="primary"
          onClick={() => onPlayFromFrame(selectedTime)}
          disabled={!frames.length}
        >
          {isPlaying ? (
            <Pause fontSize="large" />
          ) : (
            <PlayArrow fontSize="large" />
          )}
        </IconButton>
      </Box>

      {/* Шкала кадрів */}
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          p: 1,
          border: "1px solid #ccc",
          borderRadius: 1,
          position: "relative",
          height: 80,
        }}
      >
        {frames.map((frame, index) => (
          <Box
            key={index}
            onClick={() => handleFrameClick(frame.time)} // Оновлюємо обраний кадр
            sx={{
              minWidth: 60,
              height: "100%",
              mx: 0.5,
              cursor: "pointer",
              position: "relative",
              border:
                selectedTime === frame.time
                  ? "2px solid #1976d2"
                  : "1px solid #ddd",
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.default",
            }}
          >
            <img
              src={frame.image}
              alt={`Frame at ${frame.time}s`}
              style={{
                width: "100%",
                height: "60%",
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                fontSize: "0.8rem",
                color: selectedTime === frame.time ? "primary.main" : "text.secondary",
              }}
            >
              {new Date(frame.time * 1000).toISOString().substr(14, 5)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Timeline;