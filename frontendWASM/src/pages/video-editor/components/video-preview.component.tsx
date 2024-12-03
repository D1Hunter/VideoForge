import React from "react";
import { Box, Typography } from "@mui/material";

interface VideoPreviewProps {
  timelineItems: { id: number; resource: string; startTime: number; duration: number }[];
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ timelineItems }) => {
  return (
    <Box
      sx={{
        bgcolor: "#000",
        p: 2,
        borderRadius: "8px",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" color="#fff">
        Video Preview (Coming Soon)
      </Typography>
    </Box>
  );
};

export default VideoPreview;