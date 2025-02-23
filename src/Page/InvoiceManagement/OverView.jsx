import React, { useEffect, useState} from "react";
import { Box, Typography, Card, CardContent, Grid, Tooltip, CircularProgress } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const OverView = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [error, setError] = useState(null); // To handle fetch errors


  useEffect(() => {
    fetch('http://localhost:5000/overview')
      .then(response => {
        console.log('Response:', response); // Log the response
        return response.json();
      })
      .then(data => setOverviewData(data))
      .catch(error => {
        console.error('Error fetching overview data:', error);
        setError('Failed to load overview data');
      });
  }, []);

  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!overviewData) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  const { total_invoices, total_revenue, total_expenses, profit_loss } = overviewData;

  const profitLossColor = profit_loss >= 0 ? "#c8e6c9" : "#ffcdd2"; // Green for profit, Red for loss

  const cardStyle = {
    backdropFilter: "blur(10px)",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": { transform: "scale(1.05)" },
    borderRadius: 3,
    padding: "20px",
  };

  const dataCards = [
    {
      title: "Total Invoices",
      value: total_invoices || 0,
      icon: <ReceiptIcon sx={{ fontSize: 50, color: "#1976d2" }} />,
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
      subtitle: "Total number of invoices generated"
    },
    {
      title: "Total Revenue",
      value: total_revenue || 0,
      icon: <AttachMoneyIcon sx={{ fontSize: 50, color: "#388e3c" }} />,
      backgroundColor: "#c8e6c9",
      color: "#388e3c",
      subtitle: "Total revenue generated from all invoices"
    },
    {
      title: "Total Expenses",
      value: total_expenses || 0,
      icon: <MoneyOffIcon sx={{ fontSize: 50, color: "#d32f2f" }} />,
      backgroundColor: "#ffccbc",
      color: "#d32f2f",
      subtitle: "Total expenses incurred"
    },
    {
      title: "Profit / Loss",
      value: profit_loss || 0,
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: profit_loss >= 0 ? "#388e3c" : "#d32f2f" }} />,
      backgroundColor: profitLossColor,
      color: profit_loss >= 0 ? "#388e3c" : "#d32f2f",
      subtitle: "Total profit or loss"
    },
  ];

  return (
    <Box sx={{ marginTop: 4, px: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333", fontSize: '2rem' }}>
        📊 Overview
      </Typography>
      <Grid container spacing={4}>
        {dataCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Tooltip title={card.subtitle}>
              <Card sx={{ ...cardStyle, backgroundColor: card.backgroundColor }}>
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  {card.icon}
                  <Typography variant="subtitle1" sx={{ mt: 1, color: "#333", fontSize: '1rem', fontWeight: '600' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: card.color, fontSize: '2rem' }}>
                    {card.title === "Profit / Loss" 
                      ? (profit_loss >= 0 ? `₹${profit_loss.toLocaleString()}` : `-₹${Math.abs(profit_loss).toLocaleString()}`) 
                      : `₹${card.value.toLocaleString()}`}
                  </Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OverView;