import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        textAlign: "center",
        padding: "1rem 0",
        marginTop: "1rem",
        width: "100%",
        position: "static",
        bottom: 0,// Ensures footer sticks to the bottom
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
