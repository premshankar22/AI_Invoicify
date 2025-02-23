import React, {useContext, useState,  useEffect} from "react";
import { Box, Typography, Grid, Paper, List, ListItemText, ListItem } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ThemeContext } from "./ThemeContext";
import { useTheme } from "@mui/material/styles";

// Sample sales data for visualization
const salesTrends = [
    { period: "Last 7 Days", revenue: "₹12,500", trend: "📈 +15%" },
    { period: "Last 30 Days", revenue: "₹48,000", trend: "📈 +10%" },
  ];
  
  // Sample top-selling products
  const topSellingProducts = [
    { name: "Smartphone", sales: 120 },
    { name: "Laptop", sales: 80 },
    { name: "Headphones", sales: 60 },
  ];
// 🚀 New KPI Data with Icons color: "#1976d2","#2e7d32",  "#ff8f00" , color: "#d32f2f" 
const KPISection = () => {
  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const [kpiData, setKpiData] = useState(null);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/kpis");
        if (!response.ok) {
          console.error("Error fetching KPI data");
          return;
        }
        const data = await response.json();
        setKpiData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchKpiData();
  }, []);

  if (!kpiData) {
    return <Typography>Loading KPI Data...</Typography>;
  }

 // Ensure numeric values by coercing to Number
 const totalRetail = Number(kpiData.total_retail);
 const totalCost = Number(kpiData.total_cost);
 const potentialProfit = Number(kpiData.potential_profit);

 const kpis = [
   { label: "Total Stock Count", value: kpiData.total_stock, icon: <InventoryIcon sx={{ fontSize: 40, color: "#1976d2" }} /> },
   { label: "Total Retail Value", value: `₹${totalRetail.toFixed(2)}`, icon: <MonetizationOnIcon sx={{ fontSize: 40, color: "#2e7d32" }} /> },
   { label: "Total Cost Value", value: `₹${totalCost.toFixed(2)}`, icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#ff8f00" }} /> },
   { label: "Potential Profit", value: `₹${potentialProfit.toFixed(2)}`, icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#d32f2f" }} /> },
 ];

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", color: "text.primary" }}>

      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        🚀 Key Performance Indicators (KPIs)
      </Typography>

      <Grid container spacing={2}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 3,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {kpi.icon}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                {kpi.value}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "500" }}>
                {kpi.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Additional Metrics */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {/* Top Selling Products */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#d32f2f", mb: 1 }}>
              🔥 Top-Selling Products
            </Typography>
            <List>
              {topSellingProducts.map((product, index) => (
                <ListItem key={index}>
                  <ShoppingCartIcon sx={{ color: "#1976d2", mr: 2 }} />
                  <ListItemText primary={`${product.name} - ${product.sales} Sold`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sales Trends */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2e7d32", mb: 1 }}>
              📊 Sales Trends
            </Typography>
            <List>
              {salesTrends.map((trend, index) => (
                <ListItem key={index}>
                  <BarChartIcon sx={{ color: "#ff8f00", mr: 2 }} />
                  <ListItemText primary={`${trend.period}: ${trend.revenue} (${trend.trend})`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KPISection;
