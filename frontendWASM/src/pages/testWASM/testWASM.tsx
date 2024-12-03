import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { FC, useEffect, useRef, useState } from "react";

export const TestWASM: FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const messageRef = useRef<HTMLParagraphElement | null>(null)
  const [videoURL, setVideoURL] = useState<string>("");

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) {
        messageRef.current.innerHTML = message;
        console.log(message);
      }
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  }

  const applyGrayscaleFilter = async () => {
    if (!videoURL || !videoRef.current) return;

    const ffmpeg = ffmpegRef.current;
    const response = await fetch(videoURL);
    const data = await response.arrayBuffer();

    await ffmpeg.writeFile('input.mp4', new Uint8Array(data));

    await ffmpeg.exec(['-i', 'input.mp4', '-vf', 'format=gray', '-preset', 'ultrafast', 'output.mp4']);

    const output = await ffmpeg.readFile('output.mp4');
    const outputData = output as Uint8Array;
    const blob = new Blob([outputData.buffer], { type: 'video/mp4' });
    const filteredVideoURL = URL.createObjectURL(blob);

    if (videoRef.current) {
      videoRef.current.src = filteredVideoURL || ''; // Переконуємося, що це завжди string
      videoRef.current.load();
    }
  };

  const applyInvertFilter = async () => {
    if (!videoURL || !videoRef.current) return;

    const ffmpeg = ffmpegRef.current;
    const response = await fetch(videoURL);
    const data = await response.arrayBuffer();

    await ffmpeg.writeFile('input.mp4', new Uint8Array(data));

    await ffmpeg.exec(['-i', 'input.mp4', '-vf', 'lutrgb=r=negval:g=negval:b=negval', '-preset', 'ultrafast', 'output.mp4']);

    const output = await ffmpeg.readFile('output.mp4');
    const outputData = output as Uint8Array;
    const blob = new Blob([outputData.buffer], { type: 'video/mp4' });
    const filteredVideoURL = URL.createObjectURL(blob);

    if (videoRef.current) {
      videoRef.current.src = filteredVideoURL || ''; // Переконуємося, що це завжди string
      videoRef.current.load();
    }
  };

  const applyBlurFilter = async () => {
    if (!videoURL || !videoRef.current) return;

    const ffmpeg = ffmpegRef.current;
    const response = await fetch(videoURL);
    const data = await response.arrayBuffer();

    await ffmpeg.writeFile('input.mp4', new Uint8Array(data));

    await ffmpeg.exec(['-i', 'input.mp4', '-vf', 'boxblur=2:2', '-preset', 'ultrafast', 'output.mp4']);

    const output = await ffmpeg.readFile('output.mp4');
    const outputData = output as Uint8Array;
    const blob = new Blob([outputData.buffer], { type: 'video/mp4' });
    const filteredVideoURL = URL.createObjectURL(blob);

    if (videoRef.current) {
      videoRef.current.src = filteredVideoURL || ''; // Переконуємося, що це завжди string
      videoRef.current.load();
    }
  };

  useEffect(() => {
    if (loaded) {
      alert("Loaded");
    }
  }, [loaded])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoURL(url);
      setVideoLoaded(true);
    }
  };

  return loaded ? (
    <div>
      <input type="file" accept="video/*" onChange={handleFileUpload} />
      {videoLoaded && (
        <div>
          <video ref={videoRef} controls src={videoURL}></video>
          <br />
          <button onClick={applyGrayscaleFilter}>Apply Grayscale Filter</button>
          <button onClick={applyInvertFilter}>Apply Invert Filter</button>
          <button onClick={applyBlurFilter}>Apply Blur Filter</button>
        </div>
      )}
      <p ref={messageRef}></p>
    </div>
  ) : (
    <button onClick={load}>Load FFmpeg Core</button>
  );
};