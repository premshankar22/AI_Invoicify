import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, Receipt, AttachMoney, Business } from "@mui/icons-material";
import ProfilePage from "../Page/ProfilePage/ProfilePage";
import ProductManagement from "../Page/ProductManagement/ProductManagement";
import SupplierManagement from "../Page/SupplierManagement/SupplierManagement";
import ExpenseManagement from "../Page/ExpenseManagement/ExpenseManagement"; 
import InvoiceManagement from "../Page/InvoiceManagement/InvoiceManagement"; 
import AIPoweredInsights from "../Page/AIPoweredInsights/AIPoweredInsights";
import AnalyticsDashboard from "../Page/AnalyticsDashboard/AnalyticsDashboard";

const MainScreen = ({ currentPage, user}) => {
  const renderPage = () => {
    switch (currentPage) {
      case "productManagement":
        return <ProductManagement />;
      case "supplierManagement":
        return <SupplierManagement />;
      case "expenseManagement":
        return <ExpenseManagement />;
      case "invoiceManagement":
        return <InvoiceManagement />;
      case "AIPoweredInsights":
        return <AIPoweredInsights />;
      case "analyticsDashboard":
        return <AnalyticsDashboard />;
      case "profile":
          return <ProfilePage user={user} />;
      default:
        return <Box  sx={{
          flexGrow: 1,
          padding: "20px",
          overflowY: "auto",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(135deg, #1e1e2f, #252542)",
          color: "#ffffff",
        }}>  
         <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, ease: "easeOut" }}
>
  <Typography
    variant="h2"
    fontWeight="bold"
    textAlign="center"
    sx={{
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "3rem",
      letterSpacing: "2px",
      background: "linear-gradient(90deg, #ff6f61, #ffb74d, #6fcf97, #42a5f5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0px 0px 10px rgba(255, 111, 97, 0.8), 0px 0px 20px rgba(255, 183, 77, 0.8)",
      padding: "10px 20px",
      borderRadius: "10px",
      boxShadow: "0px 0px 15px rgba(255, 111, 97, 0.3)",
      animation: "pulse 2s infinite",
      "@keyframes pulse": {
        "0%": { textShadow: "0px 0px 10px rgba(255, 111, 97, 0.8)" },
        "50%": { textShadow: "0px 0px 25px rgba(255, 183, 77, 1)" },
        "100%": { textShadow: "0px 0px 10px rgba(255, 111, 97, 0.8)" },
      },
    }}
  >
    ⚡ Welcome to AI-Invoicify ⚡
  </Typography>
</motion.div>


      {/* Background Floating Icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ position: "absolute", top: "10%", left: "5%", fontSize: 120, color: "#ff6f61" }}
      >
        <ShoppingCart fontSize="inherit" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ position: "absolute", top: "20%", right: "10%", fontSize: 120, color: "#ffb74d" }}
      >
        <Receipt fontSize="inherit" />
      </motion.div>

      <motion.div
        animate={{ x: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "15%", left: "15%", fontSize: 120, color: "#6fcf97" }}
      >
        <AttachMoney fontSize="inherit" />
      </motion.div>

      <motion.div
        animate={{ x: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "20%", right: "10%", fontSize: 120, color: "#42a5f5" }}
      >
        <Business fontSize="inherit" />
      </motion.div>

      {/* Title Quote with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{
            fontFamily: "'Merriweather', serif",
            background: "linear-gradient(45deg, #ff6f61, #ffb74d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 5px rgba(255, 111, 97, 0.4)",
            lineHeight: 1.4,
            maxWidth: "800px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TrendingUp sx={{ color: "#ff6f61", fontSize: 50, mb: 1 }} />
          Automate invoices, streamline product management,  
          track expenses, and manage suppliers –  
          <br />
          all in one powerful platform to boost efficiency!
        </Typography>
      </motion.div> </Box>;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        padding: "20px",
        overflowY: "auto",
        hight:'auto'
      }}
    >

      {renderPage()}
    </Box>
  );
};

export default MainScreen;
