import { Box, Button, Card, CardActions, CardContent, Grid2 as Grid, Typography } from "@mui/material";

const ProjectPage = () => {
    const project = {name:"Test",description:"This is a test project", videos:[{id:"12312", name:"TestVideo",description:"This is a video"}]}

    const handleDeleteVideo = async (videoId:string) => {
    };
  
    const handleAddVideo = () => {
    };

    return(
        <Box padding={3}>
        <Typography variant="h4" gutterBottom>
          {project?.name || 'Project Name'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {project?.description || 'No description provided.'}
        </Typography>
  
        <Button variant="contained" color="primary" onClick={handleAddVideo}>
          Add New Video
        </Button>
  
        <Typography variant="h5" gutterBottom marginTop={3}>
          Videos
        </Typography>
        <Grid container spacing={2}>
          {project?.videos?.length > 0 ? (
            project.videos.map((video) => (
              <Grid size={{xs:12,sm:6,md:4}} key={video.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{video.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {video.description || 'No description available'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No videos in this project. Add some!</Typography>
          )}
        </Grid>
      </Box>
    );
}

export default ProjectPage;