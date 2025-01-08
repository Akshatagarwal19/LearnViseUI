import React from "react";
import { AppBar, Toolbar, Typography, Box, Button, TextField, Menu, MenuItem, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout } from "../redux/slices/authSlice";
import courseApi from "../services/apiService"; // Assuming you have an API service for making requests

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorE1, setAnchorE1] = React.useState(null);
  const open = Boolean(anchorE1);

  const handleMenuOpen = (event) => {
    setAnchorE1(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorE1(null);
  };

  const handleLogout = async () => {
    try {
      // Send logout request to the backend
      await courseApi.logout(); // Update this to match your API service
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      handleMenuClose();
    }
  };

  return (
    <AppBar position="static" sx={{ marginBottom: 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer", fontWeight: 700, fontSize: "1.8rem" }} onClick={() => navigate("/")} >
          LearnVise
        </Typography>

        <Box sx={{ flexGrow: 1, maxWidth: 600, display: "flex", justifyContent: "centre", padding: 1 }}>
          <TextField fullWidth placeholder="Start Exploring" variant="outlined" size="small" sx={{ bgcolor: "white", borderRadius: 50, "& .MuiOutlinedInput-root": { borderRadius: 50}, }} />
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {isAuthenticated && (
            <Button color="inherit" onClick={() => navigate("/Student/MyCourses")} sx={{ fontSize: "1rem", fontWeight: 600, padding: "8px 16px","&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)",} }} >
              My Courses
            </Button>
          )}
          {isAuthenticated ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorE1}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")} sx={{ fontWeight: 600 }}>
                Login
              </Button>
              <Button variant="contained" color="secondary" onClick={() => navigate("/signup")} sx={{ fontWeight: 600, padding: "8px 16px", "&:hover": {backgroundColor: "&ff4081"},}}>
                SignUp
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
