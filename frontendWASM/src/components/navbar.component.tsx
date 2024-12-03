import { InfoOutlined, Menu } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { UserMenu } from "./user.menu.component";
import { useAppSelector } from "../hooks/redux";

export const NavBar = () => {
    const { email } = useAppSelector(state => state.userReducer.user)
    return (
        <Box display="flex" justifyContent="space-between" p={2} width="97%">
          <AppBar position="static" elevation={4}>
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <IconButton
                sx={{
                  display: {
                    xs: "block",
                    sm: "block",
                    md: "block",
                    lg: "none",
                    xl: "none",
                  },
                }}
                size="large"
                edge="start"
                aria-label="menu"
              >
                <Menu />
              </IconButton>
              <IconButton
                aria-label="Information"
                sx={{
                  display: {
                    xs: "none",
                    sm: "none",
                    md: "none",
                    lg: "flex",
                    xl: "flex",
                  },
                }}
              >
                <InfoOutlined sx={{ width: "1.5rem", height: "1.5rem" }} />
              </IconButton>
              <UserMenu email={email}/>
            </Toolbar>
          </AppBar>
        </Box>
      );
}