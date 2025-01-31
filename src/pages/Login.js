import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { login } from "../redux/slices/authSlice"; // Import the login action

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
    const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        form,
        { withCredentials: true }
      );
      console.log("Login response:", response);
      // Extract token from cookies
      console.log("Document cookies:", document.cookie);
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken=')) // Updated to 'authToken'
        ?.split('=')[1];
  
      if (!token) {
        console.error("Token not found in document.cookie:", document.cookie);
        throw new Error("No token found in cookies.");
      }
  
      // Decode token and proceed
      const decoded = jwtDecode(token);
      const { username, role } = decoded;
  
      // Dispatch to Redux
      dispatch(login({ username, role }));
  
      // Redirect based on role
      if (role === "Instructor") {
        navigate("/instructor/dashboard");
      } else if (role === "Admin") {
        navigate("/Admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err.message || err.response?.data);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />
      <Container
        maxWidth="sm"
        sx={{ minHeight: "70vh", display: "flex", alignItems: "center" }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
            padding: 4,
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
            />
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ padding: "1rem" }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Login;
