import { useEffect, useState } from "react"
import { Button, Container, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../../hooks/redux";
import { setUser } from "../../store/reducers/user-slice";
import { authAPI } from "../../services/auth.service";

const Login = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login,{data}] = authAPI.useLoginMutation();

    useEffect(()=>{
        if(data?.user){
            dispatch(setUser({...data.user}));
        }
        if(data?.token){
            localStorage.setItem('token',data.token);
        }
    },[data])

    const loginFunc = () => {
        login({ email, password });
        setPassword('');
        setEmail('');
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={10} sx={{p:10}}>
                <Stack spacing={2}>
                    <Typography component="h1" variant="h5">Sign in</Typography>
                    <TextField label="Email" placeholder="Enter email" value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }} />
                    <TextField label="Password" placeholder="Enter password" type="password" value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }} />
                    <Button variant="contained" onClick={loginFunc}>Sign in</Button>
                    <Typography>Don't have an account? 
                        <Link href="/register" underline="none"> Sign up</Link>
                    </Typography>
                </Stack>
            </Paper>
        </Container>
    )
}

export default Login;