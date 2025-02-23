import React, { useState } from "react";
import {
  Box, List, ListItem, ListItemText, IconButton, Drawer, Collapse,
  ListItemIcon, Divider, Typography, Avatar
} from "@mui/material";
import {
  Menu as MenuIcon, Close as CloseIcon, ExpandLess, ExpandMore,
  Dashboard as DashboardIcon, Insights as InsightsIcon, Receipt as ReceiptIcon,
  Inventory as InventoryIcon, AttachMoney as AttachMoneyIcon, LocalShipping as LocalShippingIcon,
  Settings as SettingsIcon, AccountCircle as AccountCircleIcon
} from "@mui/icons-material";

const SideBar = ({ open, toggleSidebar, setCurrentPage,  user }) => {
  const [openBilling, setOpenBilling] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute", top: 15, left: 15, zIndex: 1300,
          color: "white", background: "linear-gradient(135deg, #42a5f5, #1976d2)",
          borderRadius: "12px", transition: "0.3s",
          "&:hover": { background: "linear-gradient(135deg, #1976d2, #1565c0)" },
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)"
        }}
      >
        {open ? <CloseIcon fontSize="medium" /> : <MenuIcon fontSize="medium" />}
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleSidebar}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280, background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)",
            borderRight: "2px solid rgba(0,0,0,0.1)", padding: "15px", transition: "0.3s"
          }
        }}
      >
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          
          {/* Sidebar Header - Profile Section */}
          <Box
            sx={{
              textAlign: "center",
              paddingBottom: "20px",
              padding: "15px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
            }}
          >
            <Avatar
              src={user?.image || "https://via.placeholder.com/100"}
              sx={{ width: 80, height: 80, margin: "auto", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
            />
            <Typography variant="h6" sx={{ marginTop: "10px", fontWeight: "bold", color: "#1565C0" }}>
              {user?.name || "Admin Panel"}
            </Typography>
          </Box>

          {/* Main Menu */}
          <List>
            {/* Analytics Dashboard */}
            <ListItem button sx={menuItemStyle} onClick={() => setCurrentPage("analyticsDashboard")}>
              <ListItemIcon sx={iconStyle}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Analytics Dashboard" />
            </ListItem>

            {/* AI-Powered Insights */}
            <ListItem button sx={menuItemStyle} onClick={() => setCurrentPage("AIPoweredInsights")}>
              <ListItemIcon sx={iconStyle}><InsightsIcon /></ListItemIcon>
              <ListItemText primary="AI-Powered Insights" />
            </ListItem>

            {/* Billing System Section */}
            <ListItem button onClick={() => setOpenBilling(!openBilling)} sx={menuItemStyle}>
              <ListItemIcon sx={iconStyle}><ReceiptIcon /></ListItemIcon>
              <ListItemText primary="Billing System" />
              {openBilling ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openBilling} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={subMenuItemStyle} onClick={() => setCurrentPage("invoiceManagement")}>
                  <ListItemIcon sx={iconStyle}><ReceiptIcon /></ListItemIcon>
                  <ListItemText primary="Invoices" />
                </ListItem>
                <ListItem button sx={subMenuItemStyle} onClick={() => setCurrentPage("productManagement")}>
                  <ListItemIcon sx={iconStyle}><InventoryIcon /></ListItemIcon>
                  <ListItemText primary="Products" />
                </ListItem>
                <ListItem button sx={subMenuItemStyle} onClick={() => setCurrentPage("expenseManagement")}>
                  <ListItemIcon sx={iconStyle}><AttachMoneyIcon /></ListItemIcon>
                  <ListItemText primary="Expense" />
                </ListItem>
                <ListItem button sx={subMenuItemStyle} onClick={() => setCurrentPage("supplierManagement")}>
                  <ListItemIcon sx={iconStyle}><LocalShippingIcon /></ListItemIcon>
                  <ListItemText primary="Supplier" />
                </ListItem>
              </List>
            </Collapse>
          </List>

          <Divider sx={{ backgroundColor: "rgba(0, 0, 0, 0.2)", marginY: "10px" }} />

          {/* Bottom Menu */}
          <List sx={{ marginTop: "auto", borderTop: "1px solid rgba(0, 0, 0, 0.1)", paddingTop: "10px" }}>
            <ListItem button sx={menuItemStyle}>
              <ListItemIcon sx={iconStyle}><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button sx={menuItemStyle}  onClick={() => setCurrentPage("profile")}>
              <ListItemIcon sx={iconStyle}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

/* 🎨 Stylish Menu Item */
const menuItemStyle = {
  borderRadius: "8px",
  marginBottom: "5px",
  transition: "0.3s",
  "&:hover": { backgroundColor: "rgba(66, 165, 245, 0.2)" },
};

/* 📌 Sub Menu Item Style */
const subMenuItemStyle = {
  paddingLeft: "30px",
  borderRadius: "8px",
  transition: "0.3s",
  "&:hover": { backgroundColor: "rgba(66, 165, 245, 0.2)" },
};

/* 🌟 Icon Style */
const iconStyle = {
  color: "#1976d2",
};

export default SideBar;
