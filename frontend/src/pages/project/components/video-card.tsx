import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";

interface VideoCardProps {
  video: {
    id?: string;
    title?: string;
    file: File | null;
    fileSize: number;
    thumbnailPath: string;
    duration: number;
  };
  onEdit: (id?: string) => void;
  onDelete: (id?: string) => void;
  getFileNameWithoutExtension: (fileName: string) => string;
  formatVideoDuration: (seconds: number) => string;
}


const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onEdit,
  onDelete,
  getFileNameWithoutExtension,
  formatVideoDuration,
}) => {
  useEffect(() => {
    console.log(`${'http://localhost:8080/videos'}/${video.thumbnailPath}`);
  }, [])

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) return `${sizeInKB.toFixed(2)} KB`;
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  };

  return (
    <Card sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: 400,
      boxShadow: 3,
    }}>
      <CardMedia
        component="img"
        src={`${'http://localhost:8080/videos'}/${video.thumbnailPath}`}
        alt={`Thumbnail for ${video.title || video.file?.name}`}
        sx={{
          height: "60%",
          objectFit: "cover",
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "center",
          flexGrow: 1,
        }}
      >
<Typography
          variant="h6"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {video.title ||
            (video.file ? getFileNameWithoutExtension(video.file.name) : "Untitled")}
        </Typography>
        <Typography variant="body2">{formatVideoDuration(video.duration)}</Typography>
        {video.fileSize && (
          <Typography variant="body2" color="text.secondary">
            {formatFileSize(video.fileSize)}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{
          justifyContent: "center",
        }}>
        <IconButton color="primary" onClick={() => onEdit(video.id)} disabled={!video.id}>
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => onDelete(video.id)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card >
  );
};

export default VideoCard;