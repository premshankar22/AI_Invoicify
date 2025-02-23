import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper, Alert } from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Trophy Icon
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";


const MotionPaper = motion(Paper);

const ProductOverview = () => {
  // State to hold fetched products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real-time product data from the API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching products: ${res.status} ${res.statusText} - ${text}`);
        }
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6">Loading product data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Alert severity="error">Error: {error.message}</Alert>
      </Box>
    );
  }

  // Compute metrics from fetched product data
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.product_status === "Available").length;
  const outOfStockCount = products.filter((p) => p.product_status === "Out of Stock").length;
  // For demonstration, assume that products with a discount_value > 0 are discounted
  const discountCount = products.filter((p) => Number(p.discount_value) > 0).length;

  // Build summary cards data
  const productSummary = [
    { title: "Total Products", value: totalProducts, icon: <StorefrontIcon fontSize="large" />, color: "#4A90E2" },
    { title: "In Stock", value: inStockCount, icon: <ShoppingCartIcon fontSize="large" />, color: "#FF5733" },
    { title: "Out of Stock", value: outOfStockCount, icon: <ErrorOutlineIcon fontSize="large" />, color: "#FF4444" },
    { title: "Discounted", value: discountCount, icon: <LocalOfferIcon fontSize="large" />, color: "#27AE60" },
  ];

  // Compute inventory status for a pie chart
  const inventoryStatusData = [
    { name: "In Stock", value: inStockCount },
    { name: "Out of Stock", value: outOfStockCount },
  ];
  const inventoryStatusColors = ["#00C49F", "#FF4444"];

  // For Top Products section, simply show the 4 most-recently created products
  const topProducts = products.slice(0, 4);

  return (
    <Box sx={{ px: 6, py: 4, background: "#424242", minHeight: "70vh", color: "#EAECEF", width:'90%' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", letterSpacing: 1.2 }}>
        🛒 Product Management Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {productSummary.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <MotionPaper
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: 3,
                  backgroundColor: "#424242",
                  boxShadow: "5px 5px 10px #0A0D11, -5px -5px 10px #12171D",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.2)" },
                }}
              >
                <Box sx={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)" }}>
                  {item.icon}
                </Box>
                <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: item.color }}>
                    {item.value}
                  </Typography>
                </Box>
              </MotionPaper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Low Stock Alert */}
      {inStockCount < 10 && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="warning" sx={{ background: "#20272E", borderRadius: 3, color: "#FFBB28", fontWeight: "bold" }}>
            <ErrorOutlineIcon sx={{ mr: 1 }} />Low Stock Alert: Only {inStockCount} products in stock!
          </Alert>
        </Box>
      )}

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Inventory Status Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" textAlign="center" gutterBottom>
            📊 Inventory Status
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={inventoryStatusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>
                {inventoryStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={inventoryStatusColors[index]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" textAlign="center" gutterBottom>
            🏆 Top Selling Products
          </Typography> 
          <Grid container spacing={2} justifyContent="center">
            {topProducts.map((product, index) => (
              <Grid item xs={12} sm={6} key={product.product_id}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderRadius: 3,
                      background: "linear-gradient(145deg, #161B22, #20272E)",
                      boxShadow: "5px 5px 10px #0A0D11, -5px -5px 10px #12171D",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.05)", boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    {index === 0 && <EmojiEventsIcon sx={{ color: "#FFD700", fontSize: 40, }} />}
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
                    {product.product_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                    Category: {product.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                    Price: ₹{Number(product.unit_price).toLocaleString()}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductOverview;
