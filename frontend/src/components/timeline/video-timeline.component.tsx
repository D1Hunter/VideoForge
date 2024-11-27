import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Slider, Typography } from "@mui/material";

interface TimelineProps {
  videoDuration: number;
  currentSecond: number;
  frameRate: number;
  onFrameSelect: (frame: number) => void;
};

const VideoTimeline: React.FC<TimelineProps> = ({
  videoDuration,
  currentSecond,
  frameRate,
  onFrameSelect,
}) => {
  const [sliderValue, setSliderValue] = useState(currentSecond * frameRate);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSliderValue(currentSecond * frameRate);
  }, [currentSecond]);

  const handleSliderChange = (event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setSliderValue(value);
    }
  };

  const handleSliderChangeCommitted = (event: Event | React.SyntheticEvent, value: number | number[]) => {
    if (typeof value === "number") {
      const selectedSecond = value / frameRate;
      onFrameSelect(Math.round(selectedSecond * frameRate));
    }
  };

  return (
    <Box sx={{ padding: 2, position: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
        <Typography variant="body2">{new Date(currentSecond * 1000).toISOString().substr(14, 5)}</Typography>
        <Typography variant="body2">{new Date(videoDuration * 1000).toISOString().substr(14, 5)}</Typography>
      </Box>

      <Slider
        ref={sliderRef}
        value={sliderValue}
        min={0}
        max={videoDuration * frameRate}
        step={1}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeCommitted}
        sx={{
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
          },
          '& .MuiSlider-track': {
            height: 4,
          },
          '& .MuiSlider-rail': {
            height: 4,
          },
        }}
      />
    </Box>
  );
};

export default VideoTimeline;