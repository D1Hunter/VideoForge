import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { MenuOutlined } from "@mui/icons-material"
import { useState } from "react";
const drawerWidth = 240;

interface MenuItem {
    text: string;
    icon: JSX.Element;
    onclick?: () => void;
}

interface SideBarProps {
    menuItems: MenuItem[];
}

export const SideBar = ({ menuItems }: SideBarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <Box>
            <Drawer
                variant="permanent"
                open={!isCollapsed}
                sx={{
                    width: isCollapsed ? 60 : drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: isCollapsed ? 60 : drawerWidth,
                        boxSizing: "border-box",
                        overflowX: "hidden",
                    },
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="center" padding={2}>
                    {!isCollapsed && (
                        <Box display="flex" alignItems="center">
                            <Typography variant="h6">
                                VideForge
                            </Typography>
                        </Box>
                    )}
                    <IconButton sx={{
                        outline: "none",
                        "&:focus": {
                            outline: "none",
                        },
                        "&:focus-visible": {
                            outline: "none",
                        },
                    }} onClick={() => setIsCollapsed(!isCollapsed)}>
                        <MenuOutlined />
                    </IconButton>
                </Box>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={item.onclick}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    )
}