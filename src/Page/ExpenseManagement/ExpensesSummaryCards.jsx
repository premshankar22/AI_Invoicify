import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";

const ExpensesSummaryCards = () => {
  // Dummy data for demonstration purposes
  const summaryData = [
    {
      title: "Total Expenses",
      value: "₹12,345",
      icon: <AttachMoneyIcon sx={{ fontSize: 50, color: "#fff" }} />,
    },
    {
      title: "This Month",
      value: "₹3,456",
      icon: <CalendarTodayIcon sx={{ fontSize: 50, color: "#fff" }} />,
    },
    {
      title: "Categories Used",
      value: "8",
      icon: <CategoryIcon sx={{ fontSize: 50, color: "#fff" }} />,
    },
  ];

  return (
    <Grid 
      container 
      spacing={3} 
      sx={{ mb: 4, fontFamily: "'Montserrat', sans-serif" }}
    >
      {summaryData.map((data, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
              background: "linear-gradient(135deg, #1e3c72, #2a5298)",
              color: "#fff",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 0 }}>
              <Typography variant="h6" sx={{ opacity: 0.85 }}>
                {data.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                {data.value}
              </Typography>
            </CardContent>
            <Box
              sx={{
                ml: 2,
                background: "linear-gradient(135deg, #ff5722, #ff9800)",
                borderRadius: "50%",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "rotate(10deg)",
                },
              }}
            >
              {data.icon}
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ExpensesSummaryCards;
