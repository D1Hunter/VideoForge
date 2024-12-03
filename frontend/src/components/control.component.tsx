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
import { Box, IconButton, Popper, Slider } from "@mui/material";
import { FC, useState } from "react";

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
    splitVideo: (timestamp: number) => void;
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

    const createSplit = () => {
        splitVideo(currentTime);
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

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={skipPrevious}>
                <SkipPreviousIcon />
            </IconButton>

            <IconButton onClick={togglePlaying} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            <IconButton onClick={skipNext}>
                <SkipNextIcon />
            </IconButton>

            <Slider
                min={0}
                max={1}
                step={0.001}
                value={projectDuration === 0 ? 0 : currentTime / projectDuration}
                onChange={onSeek}
                aria-label="Seek"
                sx={{
                    height: 10,
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20,
                    },
                  }}
            />
            <Box position="relative" onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <IconButton onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
                </IconButton>
                {showVolumeSlider && (
                    <Popper open={showVolumeSlider} placement="top" anchorEl={anchorEl}>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(_e, value) => {
                                if (typeof value === 'number') {
                                    setVolume(value);
                                }
                            }}
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

            <IconButton onClick={decreaseScale} title="Zoom out">
                <RemoveIcon />
            </IconButton>

            <IconButton onClick={increaseScale} title="Zoom In">
                <AddIcon />
            </IconButton>

            <IconButton onClick={createSplit} title="Split">
                <ContentCutIcon />
            </IconButton>
        </Box>
    );
};