import React, { useState } from "react";
import { Box, Button, Typography, List, ListItem } from "@mui/material";

interface ResourcePanelProps {
  resources: string[];
  onAddResource: (resource: string) => void;
}

const ResourcePanel: React.FC<ResourcePanelProps> = ({
  resources,
  onAddResource,
}) => {
  const [newResource, setNewResource] = useState("");

  const handleAddResource = () => {
    if (newResource.trim()) {
      onAddResource(newResource);
      setNewResource("");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        p: 2,
        borderRadius: "8px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Resources
      </Typography>
      <List>
        {resources.map((resource, index) => (
          <ListItem key={index}>{resource}</ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddResource}
        sx={{ mt: 2 }}
      >
        Add Resource
      </Button>
    </Box>
  );
};

export default ResourcePanel;