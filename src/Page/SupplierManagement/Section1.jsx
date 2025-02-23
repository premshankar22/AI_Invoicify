// Section1.js
import React from "react";
import { Box, Card, CardContent, Avatar, Typography, Divider } from "@mui/material";
import { Group as GroupIcon, Category as CategoryIcon, CheckCircle as ActiveIcon, Cancel as InactiveIcon, Payment as PaymentIcon } from "@mui/icons-material";

const Section1 = ({ suppliers, pendingPayments }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        marginBottom: 2,
        bgcolor: "#ffffff",
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Avatar
        sx={{ bgcolor: "primary.main", marginRight: 2, width: 60, height: 60 }}
      >
        <GroupIcon fontSize="medium" />
      </Avatar>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" color="textPrimary">
          Total Suppliers & Wholesalers
        </Typography>
        <Typography variant="h4" color="primary" fontWeight="bold">
          {suppliers.length}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CategoryIcon sx={{ color: "gray", marginRight: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Categories: {new Set(suppliers.map((s) => s.category)).size}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ActiveIcon sx={{ color: "green", marginRight: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Active: {suppliers.filter((s) => s.status === "Active").length}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InactiveIcon sx={{ color: "red", marginRight: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Inactive: {suppliers.filter((s) => s.status !== "Active").length}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PaymentIcon sx={{ color: "orange", marginRight: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Pending Payments: {pendingPayments.length}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Section1;
