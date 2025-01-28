import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:3001/api/auth/signup", form, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setSuccess("Signup successful! Please log in.");
        setForm({ username: "", email: "", password: "" });
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
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
            Signup
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
            />
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
            {success && (
              <Typography color="success.main" align="center">
                {success}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Signup"}
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Signup;
