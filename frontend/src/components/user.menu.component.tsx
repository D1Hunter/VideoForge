import { Avatar, Box, Button, Typography } from "@mui/material"
import { authAPI } from "../services/auth.service";
import { useEffect } from "react";
import { setUser } from "../store/reducers/user-slice";
import { useAppDispatch } from "../hooks/redux";

interface IUserMenuProps {
    email: string,
}

export const UserMenu = ({email}:IUserMenuProps) => {
    const dispatch = useAppDispatch();
    const [logout,{isSuccess}] = authAPI.useLogoutMutation();
    const logoutFunc = ()=>{
        logout(null)
    }
    useEffect(()=>{
        if(isSuccess){
            localStorage.removeItem('token');
            dispatch(setUser({id:"",email:""}));
        }
    },[isSuccess])
    return (
        <Box sx={{ alignItems: "center", display: "inline-flex", flexGrow: 0, gap: 2, }}>
            <Typography
                variant="h6"
                sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
            >
                {email}
            </Typography>
            <Avatar>
                {email[0].toLocaleUpperCase()}
            </Avatar>
            <Button onClick={()=>logoutFunc()}>Logout</Button>
        </Box>
    )
}