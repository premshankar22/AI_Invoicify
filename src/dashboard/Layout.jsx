import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import SideBar from "./SideBar";
import MainScreen from "./MainScreen";

const Layout = ({ children, user}) => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(""); // Track current page

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
      <SideBar open={open} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} user={user} />
        <MainScreen currentPage={currentPage} />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
