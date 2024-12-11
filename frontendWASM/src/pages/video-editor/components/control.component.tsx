import {
    SkipPrevious as SkipPreviousIcon,
    SkipNext as SkipNextIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    VolumeUp as VolumeUpIcon,
    VolumeMute as VolumeMuteIcon,
    Remove as RemoveIcon,
    Add as AddIcon,
    ContentCut as ContentCutIcon
} from "@mui/icons-material";
import { Box, IconButton, Popper, Slider, Typography } from "@mui/material";
import { FC, useState } from "react";
import { formatTime } from "../../../utils";

interface ControlsProps {
    playVideo: () => void;
    pauseVideo: () => void;
    toggleVolume: () => void;
    setVolume: (volume: number) => void;
    volume: number;
    isPlaying: boolean;
    currentTime: number;
    projectDuration: number;
    setCurrentTime: (timestamp: number) => void;
    splitVideo: () => void;
    setScaleFactor: (scale: number) => void;
    scaleFactor: number;
    skipInterval?: number;
}

export const Control: FC<ControlsProps> = ({
    playVideo = () => { },
    pauseVideo = () => { },
    toggleVolume,
    setVolume,
    volume,
    isPlaying = false,
    currentTime = 0,
    projectDuration = 100,
    setCurrentTime = () => { },
    splitVideo = () => { },
    setScaleFactor = () => { },
    scaleFactor = 10,
    skipInterval = 5
}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const togglePlaying = () => {
        if (isPlaying) {
            pauseVideo();
        } else {
            playVideo();
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        toggleVolume();
    };

    const handleVolumeChange = (_event: Event, value: number | number[]) => {
        if (typeof value === "number") {
            console.log(value);
          setVolume(value);
        }
      };

    const increaseScale = () => {
        setScaleFactor(Math.min(1, scaleFactor * 1.2));
    };

    const decreaseScale = () => {
        setScaleFactor(Math.max(0.0001, scaleFactor * 0.8));
    };

    const onSeek = (_event: Event, value: number | number[]) => {
        if (typeof value === 'number') {
            const newTime = value * projectDuration;
            setCurrentTime(newTime);
        }
    };

    const skipPrevious = () => {
        const newTime = Math.max(0, currentTime - skipInterval);
        setCurrentTime(newTime);
    };

    const skipNext = () => {
        const newTime = Math.min(projectDuration, currentTime + skipInterval);
        setCurrentTime(newTime);
    };

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setShowVolumeSlider(true);
    };

    const handleMouseLeave = () => {
        setAnchorEl(null);
        setShowVolumeSlider(false);
    };

    const circleButtonStyle = {
        backgroundColor: "lightgray",
        color: "black",
        borderRadius: "50%",
        padding: 1,
        width: 40,
        height: 40,
        "&:hover": {
          backgroundColor: "gray",
        },
      };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={skipPrevious}  sx={circleButtonStyle}>
                <SkipPreviousIcon />
            </IconButton>

            <IconButton onClick={togglePlaying} title={isPlaying ? "Pause" : "Play"} sx={circleButtonStyle}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            <IconButton onClick={skipNext} sx={circleButtonStyle}>
                <SkipNextIcon />
            </IconButton>

            <Box display="flex" gap={1} alignItems="center">
                <Typography>
                    {`${formatTime(currentTime)}`}
                </Typography>
                <Box
                    sx={{
                        borderLeft: "1px solid",
                        height: "1em",
                    }}
                />
                <Typography>
                    {`${formatTime(projectDuration)}`}
                </Typography>
            </Box>


            <Slider
                min={0}
                max={1}
                step={0.001}
                value={projectDuration === 0 ? 0 : currentTime / projectDuration}
                onChange={onSeek}
                aria-label="Seek"
                sx={{
                    height: 10,
                    color: "gray",
                    '& .MuiSlider-thumb': {
                        color:"#d9d7d7",
                        width: 20,
                        height: 20,
                    },
                    "& .MuiSlider-track": {
                        height: 4,
                      },
                      "& .MuiSlider-rail": {
                        height: 4,
                      },
                }}
            />
            <Box position="relative" onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <IconButton onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"} sx={circleButtonStyle}>
                    {isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
                </IconButton>
                {showVolumeSlider && (
                    <Popper open={showVolumeSlider} placement="top" anchorEl={anchorEl}>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={handleVolumeChange}
                            aria-label="Volume"
                            orientation="vertical"
                            sx={{
                                height: 60, color: "gray", '& .MuiSlider-thumb': {
                                    width: 10,
                                    height: 10,
                                },
                            }}
                        />
                    </Popper>
                )}
            </Box>

            <IconButton onClick={decreaseScale} title="Zoom out" sx={circleButtonStyle}>
                <RemoveIcon />
            </IconButton>

            <IconButton onClick={increaseScale} title="Zoom In" sx={circleButtonStyle}>
                <AddIcon />
            </IconButton>

            <IconButton onClick={splitVideo} title="Split" sx={circleButtonStyle}>
                <ContentCutIcon />
            </IconButton>
        </Box>
    );
};