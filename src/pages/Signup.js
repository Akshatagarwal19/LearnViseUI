import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Handle signup API call here
      console.log("Signing up with:", form);
    } catch (err) {
      setError("Signup failed. Try again.");
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
