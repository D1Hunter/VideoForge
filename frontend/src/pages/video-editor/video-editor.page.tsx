import { Box, Button, Card, CircularProgress, Container, Typography } from "@mui/material";
import {Save as SaveIcon, Download as DownloadIcon} from '@mui/icons-material';
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { videoAPI } from "../../services/video.service";
import { Control } from "../../components/";
import { VideoFilterType } from "../../interfaces/video.interface";
import { formatTime } from "../../utils";
import FiltersPanel from "./components/filters-panel.component";
import InstrumentPanel from "./components/instrument-panel.component";

interface EditorProps {
  id?: string;
  title?: string;
  duration?: number;
}

const EditorPage: FC<EditorProps> = ({ duration }) => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [volume, setVolume] = useState(0);

  const { data: videoBlob, isLoading: isFetching, error: fetchError } = videoAPI.useFetchVideoByIdQuery(videoId || "");

  const [processVideo, { data: processVideoBlob }] = videoAPI.useProcessVideoMutation();

  useEffect(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setFilePreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoBlob]);

  useEffect(() => {
    if (processVideoBlob) {
      console.log(processVideoBlob);
      const url = URL.createObjectURL(processVideoBlob);
      setFilePreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [processVideoBlob])

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
      const handleMetadataLoaded = () => setVideoDuration(videoElement.duration);
      setVolume(videoElement.volume);

      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("loadedmetadata", handleMetadataLoaded);

      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener("loadedmetadata", handleMetadataLoaded);
      };
    }
  }, []);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleVolume = () => {
    if (videoRef.current) {
      videoRef.current.volume = videoRef.current.volume > 0 ? 0 : 1;
      setVolume(videoRef.current.volume);
    }
  }

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const splitVideo = async (timestamp: number) => {
    try {
      if (videoId) {
        await processVideo({ id: videoId, type: VideoFilterType.INVERT, startTime: "00:00:00", duration: formatTime(timestamp) });
      }
    } catch (err) {
    }
    console.log(formatTime(timestamp));
  };

  const processFilterVideo = async (filterType: VideoFilterType) => {
    try {
      if (videoId) {
        console.log("start");
        await processVideo({ id: videoId, type: filterType });
      }
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  }

  if (!videoId && !filePreview) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Upload Video
        </Typography>
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        </Box>
      </Container>
    );
  }

  if (isFetching) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" color="error">
          Failed to load video
        </Typography>
        <Button onClick={() => navigate("/")} variant="contained" sx={{ mt: 2 }}>
          Go Back to Dashboard
        </Button>
      </Box>
    );
  }

  const menuItems = [
    { text: "Grayscale", onclick: () => processFilterVideo(VideoFilterType.GRAYSCALE) },
    { text: "Invert Colors", onclick: () => processFilterVideo(VideoFilterType.INVERT) },
    { text: "Blur", onclick: () => processFilterVideo(VideoFilterType.BLUR) }
  ];

  const intrumentItems = [
    { icon: <SaveIcon/>, onclick: ()=>{} },
    { icon: <DownloadIcon/>, onclick: ()=>{} }
  ]

  return (
    <Box sx={{margin:"0", padding:"10px", width:"100%", maxWidth:"100%"}}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent:"space-between" }}>
        <Box sx={{ maxWidth:"300px"}}>
          <FiltersPanel menuItems={menuItems} />
        </Box>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {filePreview && (
            <Card sx={{ mb: 4 }}>
              <video
                ref={videoRef}
                src={filePreview}
                controls={false}
                style={{ width: "100%", height: "400px" }}
              />
            </Card>
          )}
        </Box>

        <InstrumentPanel menuItems={intrumentItems}/>
      </Box>
      <Control
        playVideo={playVideo}
        pauseVideo={pauseVideo}
        toggleVolume={toggleVolume}
        volume={volume}
        setVolume={setVolume}
        isPlaying={isPlaying}
        currentTime={currentTime}
        projectDuration={videoDuration}
        setCurrentTime={(timestamp) => {
          if (videoRef.current) {
            videoRef.current.currentTime = timestamp;
            setCurrentTime(timestamp);
          }
        }}
        splitVideo={splitVideo}
        setScaleFactor={setScaleFactor}
        scaleFactor={scaleFactor}
        skipInterval={5}
      />
    </Box>
  );
};

export default EditorPage;