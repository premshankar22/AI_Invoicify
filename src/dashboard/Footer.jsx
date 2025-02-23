import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        height: "6vh",
        backgroundColor: "#1976d2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        position: "fixed",
        bottom: 0,
      }}
    >
      <Typography variant="body2">© 2024 BillingApp. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;
