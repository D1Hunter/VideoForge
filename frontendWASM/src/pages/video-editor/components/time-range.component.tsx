import { useState, useRef, useEffect, FC } from "react";
import { Box, Slider, Typography } from "@mui/material";

export interface TimeRange {
    start: number;
    end: number;
}

interface ReactTimeRangeTrackProps {
    duration: number;
    onChange?: (range: TimeRange) => void;
    step?: number;
}

interface ReactTimeRangeTrackProps {
    duration: number;
    onChange?: (range: TimeRange) => void;
    step?: number;
}

const TimeRangeTrack: FC<ReactTimeRangeTrackProps> = ({
    duration,
    onChange,
    step = 1,
}) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const [range, setRange] = useState<TimeRange>({ start: 0, end: duration });
    const [dragging, setDragging] = useState<"start" | "end" | null>(null);

    const handleMouseDown = (type: "start" | "end") => {
        setDragging(type);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragging || !trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const newValue = Math.max(
            0,
            Math.min((clickPosition / rect.width) * duration, duration)
        );

        setRange((prev) => {
            const updatedRange = {
                ...prev,
                [dragging]: newValue,
            };

            if (updatedRange.start > updatedRange.end) {
                updatedRange.start = updatedRange.end;
            }

            onChange?.(updatedRange);
            return updatedRange;
        });
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    useEffect(() => {
        if (trackRef.current) {
            setRange({ start: 0, end: duration });
        }
    }, [trackRef, duration]);
    
    const getPercentage = (value: number) => {
        if (duration === 0) return 0;
        return Math.min((value / duration) * 100, 100);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                ref={trackRef}
                sx={{
                    position: "relative",
                    width: "100%",
                    height: 30,
                    backgroundColor: "lightgreen",
                    borderRadius: 1,
                    userSelect: "none",
                }}
            >
                {Array.from({ length: Math.ceil(duration / step) + 1 }, (_, i) => {
                    const leftPercentage = (i * step) / duration * 100;
                    return (
                        i !== 0 && i !== Math.ceil(duration / step) && (
                            <Box
                                key={i}
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: `${leftPercentage}%`,
                                    transform: "translateX(-50%)",
                                    width: "1px",
                                    height: "50%",
                                    backgroundColor: "#333",
                                }}
                            />
                        )
                    );
                })}
                <Box
                    sx={{
                        position: "absolute",
                        height: "100%",
                        backgroundColor: "rgba(0, 128, 0, 0.5)",
                        borderRadius: 1,
                        left: `${getPercentage(range.start)}%`,
                        width: `${getPercentage(range.end - range.start)}%`,
                        zIndex: 1,
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        left: `${getPercentage(range.start)}%`,
                        width: 20,
                        height: 40,
                        backgroundColor: "white",
                        border: "2px solid #575859",
                        borderRadius: 2,
                        cursor: "pointer",
                        zIndex: 3,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                            backgroundColor: "#e3f2fd",
                        },
                        "&:active": {
                            transform: "translate(-50%, -50%) scale(1.1)",
                        },
                    }}
                    onMouseDown={() => handleMouseDown("start")}
                >
                    <Box
                        sx={{
                            width: "2px",
                            height: "60%",
                            backgroundColor: "green",
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        left: `${getPercentage(range.end)}%`,
                        width: 20,
                        height: 40,
                        backgroundColor: "white",
                        border: "2px solid #575859",
                        borderRadius: 2,
                        cursor: "pointer",
                        zIndex: 3,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                            backgroundColor: "#e3f2fd",
                        },
                        "&:active": {
                            transform: "translate(-50%, -50%) scale(1.1)",
                        },
                    }}
                    onMouseDown={() => handleMouseDown("end")}
                >
                    <Box
                        sx={{
                            width: "2px",
                            height: "60%",
                            backgroundColor: "green",
                        }}
                    />
                </Box>

            </Box>
            <Box
                sx={{
                    position: "relative",
                    marginTop: 2,
                    fontSize: "12px",
                    color: "#333",
                }}
            >
                {Array.from({ length: Math.ceil(duration / step) + 1 }, (_, i) => {
                    const leftPercentage = (i * step) / duration * 100;

                    return (
                        <Box
                            key={i}
                            sx={{
                                position: "absolute",
                                left: `${leftPercentage}%`,
                                transform: i === Math.ceil(duration / step) ? "translateX(-100%)" : "translateX(-50%)",
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: "11px",
                                    color: "#333",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {formatTime(i * step)}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default TimeRangeTrack;