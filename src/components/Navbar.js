import React from "react";
import { AppBar, Toolbar, Typography, Box, Button, TextField, Menu, MenuItem, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout } from "../redux/slices/authSlice";


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const [anchorE1, setAnchorE1] = React.useState(null);
  const open = Boolean(anchorE1);

  const handleMenuOpen = (event) => {
    setAnchorE1(event.currentTarget);
  };

  const handleMenuClose = () =>{
    dispatch(logout());
    navigate("/");
    handleMenuClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    handleMenuClose();
  };
  return (
    <AppBar position="static" margin="0">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")} // Corrected onClick
        >
          LearnVise
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            placeholder="Start Exploring"
            variant="outlined"
            size="small"
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          { isAuthenticated ? (
            <>
             <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircleIcon/>
             </IconButton>
             <Menu anchorEl={anchorE1} open={open} onClose={handleMenuClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
             </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}> {/* Corrected onClick */}
                Login
              </Button>
              <Button variant="contained" color="secondary" onClick={() => navigate("/signup")}> {/* Corrected onClick */}
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
