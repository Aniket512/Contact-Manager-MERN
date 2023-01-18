import React, { useEffect, useState } from "react";
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useCookies } from "react-cookie";

const Register = () => {
    const theme = createTheme();
    const navigate = useNavigate();
  
    const [values, setValues] = useState({fname: "", lname: "", email: "", password: "" });

    const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
              "https://contact-manager-mern-52h5.onrender.com/api/register",
              {
                ...values,
              },
              { withCredentials: true }
            );
            
            if (data) {
              if (data.errors) {
                const { fname, lname, email, password } = data.errors;
                if(fname) generateError(fname);
                else if(lname) generateError(lname);
                else if (email) generateError(email);
                else if (password) generateError(password);
              } else {
                localStorage.setItem('userId', data.user);
                navigate("/");
              }
            }
          } catch (ex) {
            console.log(ex);
          }

    }

    return <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="fname"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }                      
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lname"
                                autoComplete="family-name"
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                  }
                      
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                  }
                      
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                  }
                      
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
        <ToastContainer/>
    </ThemeProvider>

}

export default Register;