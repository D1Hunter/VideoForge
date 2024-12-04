import { Box } from "@mui/material"
import { FC } from "react"
import { NavBar, SideBar } from "../../components"
import { Outlet, useNavigate } from "react-router-dom"
import { Home as HomeIcon, Settings as SettingsIcon, Theaters as TheatersIcon, Delete as DeleteIcon } from "@mui/icons-material";
import styles from './root.module.css'

const Root: FC = () => {
    const navigate = useNavigate();

    const menuItems = [
        { text: "Home", icon: <HomeIcon />, onclick: () => navigate("/") },
        { text: "Editor", icon: <TheatersIcon />, onclick: () => navigate("/editor") },
        { text: "Trash", icon: <DeleteIcon />, onclick: () => navigate("/editor") },
        { text: "Settings", icon: <SettingsIcon />, onclick: () => navigate("/settings") }
    ];

    return (
        <main>
            <Box className="app">
                <SideBar menuItems={menuItems} />
                <Box className={styles.root}>
                    <NavBar />
                    <Outlet />
                </Box>
            </Box>
        </main>
    )
}

export default Root;