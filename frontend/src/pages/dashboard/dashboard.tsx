import { Box, Button, Card, CardContent, Grid2 as Grid, Typography } from "@mui/material"

const Dashboard = () => {
  const projects: any[] = [];
  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ paddingBlock: 2, width: "100%" }}>
          <Typography variant="h4" gutterBottom>
            Your Projects
          </Typography>
        </Box>
      </Box>
      <Button variant="contained" color="primary">
        Create New Project
      </Button>
        <Grid container spacing={2} marginTop={2}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Grid size={{ xs:12, sm:6, md:4}} key={project.id}>
                <Card style={{ cursor: 'pointer' }}>
                  <CardContent>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {project.description || 'No description available'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No projects found. Create your first project!</Typography>
          )}
        </Grid>
    </>
  )
}

export default Dashboard;