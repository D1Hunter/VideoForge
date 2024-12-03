import { Button, Container, Link, Paper, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/auth.service";
import styles from "./register.module.css";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [register, { isSuccess }] = authAPI.useRegisterMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate('/');
        }
    }, [isSuccess, navigate]);

    const registerFunc = () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        console.log({ email, password, nickname });
        register({ email, password, nickname });
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNickname('');
        setErrorMessage('');
    };

    return (
        <Container maxWidth="lg" className={styles.register}>
            <Paper elevation={10} sx={{ p: 10 }}>
                <Stack spacing={2}>
                    <Typography component="h1" variant="h5">Sign up</Typography>
                    <TextField
                        label="Nickname"
                        placeholder="Enter nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        placeholder="Enter password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errorMessage && (
                        <Typography color="error" variant="body2">
                            {errorMessage}
                        </Typography>
                    )}
                    <Button variant="contained" onClick={registerFunc}>
                        Sign up
                    </Button>
                    <Typography>
                        Already have an account?
                        <Link href="/" underline="none"> Sign in</Link>
                    </Typography>
                </Stack>
            </Paper>
        </Container>
    );
};

export default Register;