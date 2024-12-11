import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Box, Button, Card, CircularProgress, Container, Typography } from "@mui/material";
import { Save as SaveIcon, Download as DownloadIcon } from '@mui/icons-material';
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { videoAPI } from "../../services/video.service";
import { Control } from "./components/control.component";
import FiltersPanel from "./components/filters-panel.component";
import InstrumentPanel from "./components/instrument-panel.component";
import ReactTimeRangeTrack, { TimeRange } from "./components/time-range.component";
import { VideoFilterType } from "../../interfaces/video-process";
import { useAppSelector } from "../../hooks/redux";
import { projectAPI } from "../../services/project.service";
import { encryptFile } from "../../utils/aes";
import TimeRangeTrack from "./components/time-range.component";
import SaveVideoPopup from "./components/save-video.popup";

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
  const ffmpegRef = useRef(new FFmpeg());
  const [loaded, setLoaded] = useState(false);
  const useMutlithread = useAppSelector(state => state.settingsReducer.useMutlithread);
  const [range, setRange] = useState<TimeRange>({ start: 0, end: videoDuration });
  const [savePopupOpen, setSavePopupOpen] = useState(false);

  const { data: videoBlob, isLoading: isFetching, error: fetchError } = videoAPI.useFetchVideoByIdQuery(videoId || "");
  const { data: projects = [] } = projectAPI.useFetchProjectsQuery(null);
  const [uploadVideo] = videoAPI.useUploadVideoMutation();

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    if (useMutlithread) {
      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });
      console.log("Ffmpeg MT loaded");
    }
    else {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      console.log("Ffmpeg loaded");
    }
    setLoaded(true);
  }

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
    load();
  }, [])

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
  }, [filePreview]);

  const handleRangeChange = (range: { start: number; end: number }) => {
    setRange(range);
  };

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

  useEffect(()=>{
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  },[volume])

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  const applyVideoFilter = async (filterType: VideoFilterType) => {
    if (!videoRef.current || !filePreview) {
      console.error("Video element or file preview is not available.");
      return;
    }

    try {
      const startJS = performance.now();

      const ffmpeg = ffmpegRef.current;
      const response = await fetch(filePreview);
      const data = await response.arrayBuffer();

      await ffmpeg.writeFile('input.mp4', new Uint8Array(data));

      const filterMap: Record<VideoFilterType, string> = {
        [VideoFilterType.GRAYSCALE]: 'format=gray',
        [VideoFilterType.INVERT]: 'negate',
        [VideoFilterType.BLUR]: 'boxblur=luma_radius=2:luma_power=1',
        [VideoFilterType.GLITCH_EFFECT]: "format=yuv420p,geq='if(gt(random(1),0.9),255,lum(X,Y))':128:128"
      };

      const filter = filterMap[filterType];
      if (!filter) {
        console.error("Unsupported filter type:", filterType);
        return;
      }

      await ffmpeg.exec(['-i', 'input.mp4', '-vf', filter, '-preset', 'ultrafast', '-threads', '4', 'output.mp4']);

      const output = await ffmpeg.readFile('output.mp4');
      const outputData = output as Uint8Array;

      const blob = new Blob([outputData.buffer], { type: 'video/mp4' });
      const filteredVideoURL = URL.createObjectURL(blob);

      const endJS = performance.now();
      console.log(`JavaScript Execution Time: ${endJS - startJS} ms`);

      videoRef.current.src = filteredVideoURL;
      videoRef.current.load();
      setFilePreview(filteredVideoURL);
    } catch (error) {
      console.error("Error applying video filter:", error);
    }
  };

  const trimVideo = async () => {
    console.log("Video trim started");
    console.log(range);
    console.log(ffmpegRef.current);
    if (!filePreview) {
      console.error("File preview is not available.");
      return;
    }
  
    try {
      const ffmpeg = ffmpegRef.current;
  
      const response = await fetch(filePreview);
      const data = await response.arrayBuffer();
      await ffmpeg.writeFile('input.mp4', new Uint8Array(data));
  
      await ffmpeg.exec([
        '-ss', range.start.toString(),
        '-i', 'input.mp4',
        '-to', range.end.toString(),
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-c:a', 'aac',
        'trimmed.mp4'
      ]);
  
      const output = await ffmpeg.readFile('trimmed.mp4');
      const outputData = output as Uint8Array;
      const trimmedVideoBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
      const trimmedVideoURL = URL.createObjectURL(trimmedVideoBlob);
  
      setFilePreview(trimmedVideoURL);
  
      console.log('Video trimmed successfully.');
    } catch (error) {
      console.error("Error trimming video:", error);
    }
  };

  const handleDownloadVideo = () => {
    if (filePreview) {
      const link = document.createElement("a");
      link.href = filePreview;
      link.download = `video-${videoId || "edited"}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSaveVideoToProject = async(fileName: string, projectId: string) => {
    if (filePreview) {
      try {
        const response = await fetch(filePreview);
        const blob = await response.blob();
  
        const file = new File([blob], `${fileName}.mp4`, { type: blob.type });
  
        const encryptedResult = await encryptFile(file);
  
        if (!encryptedResult) {
          console.error("Encryption failed.");
          return;
        }
  
        const { encryptedData, iv } = encryptedResult;
  
        const encryptedBlob = new Blob([iv, encryptedData], { type: file.type });
  
        const formData = new FormData();
        formData.append("file", encryptedBlob, file.name);
  
        console.log("Encrypted file ready for upload:", formData);
        await uploadVideo({ formData, projectId: projectId }).unwrap();
      } catch (err) {
        console.error("Error during video encryption and saving:", err);
      }
    }
  };

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
    { text: "Grayscale", onclick: () => applyVideoFilter(VideoFilterType.GRAYSCALE) },
    { text: "Invert Colors", onclick: () => applyVideoFilter(VideoFilterType.INVERT) },
    { text: "Blur", onclick: () => applyVideoFilter(VideoFilterType.BLUR) },
    { text: "Glitch effect", onclick: () => applyVideoFilter(VideoFilterType.GLITCH_EFFECT) }
  ];

  const intrumentItems = [
    { icon: <SaveIcon />, onclick: () => setSavePopupOpen(true) },
    { icon: <DownloadIcon />, onclick: () => handleDownloadVideo() }
  ]

  return (
    <Box sx={{ margin: "0", padding: "10px", width: "100%", maxWidth: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "space-between", alignItems: "center", px: "10px" }}>
        <Box sx={{ maxWidth: "300px" }}>
          <FiltersPanel menuItems={menuItems} />
        </Box>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {filePreview && (
            <Card sx={{ mb: 4 }}>
              <video
                ref={videoRef}
                src={filePreview}
                controls={false}
                style={{
                  width: "100%", height: "400px", objectFit: "cover",
                  transform: `scale(${scaleFactor})`,
                  transformOrigin: "center",
                }}
              />
            </Card>
          )}
        </Box>

        <InstrumentPanel menuItems={intrumentItems} />
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
        splitVideo={trimVideo}
        setScaleFactor={setScaleFactor}
        scaleFactor={scaleFactor}
        skipInterval={5}
      />
      <div style={{ padding: 20 }}>
        <TimeRangeTrack duration={videoDuration} step={5} onChange={handleRangeChange}></TimeRangeTrack>
      </div>
      <SaveVideoPopup
        open={savePopupOpen}
        onClose={() => setSavePopupOpen(false)}
        onSave={handleSaveVideoToProject}
        projects={projects}
      />
    </Box>
  );
};

export default EditorPage;