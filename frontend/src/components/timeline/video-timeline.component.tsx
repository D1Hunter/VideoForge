import { Box, Slider, Typography } from "@mui/material";
import { useState } from "react";

interface VideoTimelineProps {
  duration: number;
  steps: number;
  value: [number, number];
  onChange: (event: Event | React.SyntheticEvent, newValue: number | number[]) => void;
  formatTime: (seconds: number) => string;
}

const VideoTimeline: React.FC<VideoTimelineProps> = ({ duration, steps, value, onChange, formatTime }) => {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography gutterBottom>Select Time Interval</Typography>
      <Slider
        value={value}
        onChange={onChange}
        min={0}
        max={duration}
        step={duration / steps}
        valueLabelDisplay="auto"
        valueLabelFormat={formatTime}
        sx={{ mt: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography>{formatTime(value[0])}</Typography>
        <Typography>{formatTime(value[1])}</Typography>
      </Box>
    </Box>
  );
};

export default VideoTimeline;