import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";

interface VideoCardProps {
    video: {
      id?: string;
      title?: string;
      file: File|null;
      thumbnail: string;
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
    return (
      <Card>
        <CardMedia
          component="img"
          src={video.thumbnail}
          alt={`Thumbnail for ${video.title || video.file?.name}`}
          sx={{ height: 200, objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h6">
            {video.title || (video.file ? getFileNameWithoutExtension(video.file.name) : "Untitled")}
          </Typography>
          <Typography>{formatVideoDuration(video.duration)}</Typography>
        </CardContent>
        <CardActions>
          <IconButton color="primary" onClick={() => onEdit(video.id)} disabled={!video.id}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => onDelete(video.id)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  };
  
  export default VideoCard;