import { FC } from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface MenuItem {
  text: string;
  icon?: JSX.Element;
  onclick?: () => void;
}

interface FiltersPanelProps {
  menuItems: MenuItem[];
}

const FiltersPanel: FC<FiltersPanelProps> = ({ menuItems }) => {
  return (
    <Box
      sx={{
        bgcolor: "#cfcfcf",
        p: 2,
        borderRadius: "8px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={item.onclick}
              sx={{
                border: "2px solid #1976d2",
                borderRadius: "8px",
                mb: 1,
                backgroundColor: "#ffffff",
                "&:hover": {
                  borderColor: "#115293",
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FiltersPanel;