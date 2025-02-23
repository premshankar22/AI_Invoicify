import React, { useEffect,  useState } from "react";
import { Box, Grid, Typography, Paper, Tooltip, LinearProgress  } from "@mui/material";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";


const OverviewSection = () => {

    // State for API data
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
  
   // Helper function to check and parse JSON response
  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error fetching ${url}: ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
  };

  // Fetch all data concurrently
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, suppliersData, expensesData, invoicesData] = await Promise.all([
          fetchJson("http://localhost:5000/api/products"),
          fetchJson("http://localhost:5000/api/suppliers"),
          fetchJson("http://localhost:5000/api/expenses"),
          fetchJson("http://localhost:5000/api/invoices"),
        ]);

        setProducts(productsData);
        setSuppliers(suppliersData);
        setExpenses(expensesData);
        setInvoices(invoicesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching overview data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute metrics from API data using the correct field names
  const totalSales = invoices.reduce(
    (acc, invoice) => acc + (Number(invoice.grand_total) || 0),
    0
  );
  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + (Number(expense.amount) || 0),
    0
  );
  const profit = Math.max(totalSales - totalExpenses, 0);
  const loss = Math.max(totalExpenses - totalSales, 0);
  const inventoryValue = products.reduce((acc, product) => {
    return acc + (Number(product.unit_price) || 0) * (Number(product.quantity) || 0);
  }, 0);
  const supplierCount = suppliers.length;
  const totalInvoiceCount = invoices.length;

     // Prepare the overview data for display
  const overviewData = [
    {
      title: "Total Sales",
      value: totalSales,
      icon: <PaidIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
      progress: 75,
      tooltip: "Sales revenue generated this month",
      prefix: "₹",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: <AccountBalanceWalletIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #FFD166, #F4A261)",
      progress: 40,
      tooltip: "Total operational expenses",
      prefix: "₹",
    },
    {
      title: "Profit & Loss",
      profit,
      loss,
      icon: <TrendingUpIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #43E97B, #38F9D7)",
      progress: 60,
      tooltip: "Profit and Loss for the month",
      prefix: "₹",
    },
    {
      title: "Inventory Value",
      value: inventoryValue,
      icon: <InventoryIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #4B79A1, #283E51)",
      progress: 85,
      tooltip: "Current value of inventory in stock",
      prefix: "₹",
    },
    {
      title: "No. Supplier",
      value: supplierCount,
      icon: <PeopleIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #FFA17F, #00223E)",
      progress: 50,
      tooltip: "Number of suppliers",
      prefix: "",
    },
    {
      title: "Total Invoice",
      value: totalInvoiceCount,
      icon: <ReceiptLongIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #00c6ff, #0072ff)",
      progress: 80,
      tooltip: "Total number of invoices",
      prefix: "",
    },
  ];

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6">Loading overview data...</Typography>
      </Box>
    );
  }


  return (
    <Box sx={{ px: 12, py: 2, zIndex: 1 }}>
      <Grid container spacing={3}>
        {overviewData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
             <Tooltip title={item.tooltip} arrow>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.08 }}
            >
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: 4,
                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.3)",
                  background: item.gradient,
                  color: "#FFF",
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.3s ease-in-out",
                  backdropFilter: "blur(12px)",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.5)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{
                    width: 65,
                    height: 65,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    borderRadius: "50%",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {item.icon}
                </motion.div>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85, letterSpacing: 1 }}>
                    {item.title}
                 </Typography>
                    {item.profit !== undefined ? (
                   <Box>
                      <Typography variant="body2" sx={{ color: "green" }}>
                          Profit:{" "}
                         <CountUp end={item.profit} duration={2} separator="," prefix="₹" />
                                </Typography>
                                 <Typography variant="body2" sx={{ color: "red" }}>
                               Loss:{" "}
                           <CountUp end={item.loss} duration={2} separator="," prefix="₹" />
                       </Typography>
                    </Box>
                  ) : (
                 <Typography variant="h5" fontWeight="bold">
                 <CountUp end={item.value} duration={2} separator="," prefix="₹" />
               </Typography>
                )} 
                </Box>
                </Box>
                <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(255,255,255,0.3)",
                        "& .MuiLinearProgress-bar": { borderRadius: 3, backgroundColor: "#FFF" },
                      }}
                    />
                  </Box>
              </Paper>
            </motion.div>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OverviewSection;
