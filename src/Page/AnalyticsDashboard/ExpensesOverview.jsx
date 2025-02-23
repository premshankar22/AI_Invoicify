import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Paper, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, Legend } from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const MotionPaper = motion(Paper);

const ExpensesOverview = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expense data from the API
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch("http://localhost:5000/api/expenses");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching expenses: ${res.status} ${res.statusText} - ${text}`);
        }
        const data = await res.json();
        setExpenses(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6">Loading expense data...</Typography>
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

  // Compute key metrics
  const totalExpenseAmount = expenses.reduce(
    (acc, expense) => acc + (Number(expense.amount) || 0),
    0
  );
  const expenseCount = expenses.length;
  const averageExpense = expenseCount > 0 ? (totalExpenseAmount / expenseCount).toFixed(2) : 0;
  const latestExpenses = expenses.slice(0, 4);

  // Prepare data for the Pie Chart: Group expenses by category
  const expenseByCategory = {};
  expenses.forEach((expense) => {
    const category = expense.category || "General";
    expenseByCategory[category] = (expenseByCategory[category] || 0) + (Number(expense.amount) || 0);
  });
  const pieData = Object.keys(expenseByCategory).map((key) => ({
    name: key,
    value: expenseByCategory[key],
  }));
  const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6699"];

  // Prepare data for the Line Chart: Expense trend over time (group by date)
  const expenseTrendMap = {};
  expenses.forEach((expense) => {
    let dateStr = expense.created_at;
    if (!dateStr) return; // Skip if no date provided

    // Convert to ISO format if necessary
    if (!dateStr.includes("T")) {
      dateStr = dateStr.replace(" ", "T");
    }
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return; // Skip invalid dates
    const date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
    expenseTrendMap[date] = (expenseTrendMap[date] || 0) + (Number(expense.amount) || 0);
  });
  const expenseTrendData = Object.keys(expenseTrendMap)
    .sort()
    .map((date) => ({
      date,
      amount: expenseTrendMap[date],
    }));

  console.log("Expense Trend Data:", expenseTrendData);

  return (
    <Box
      sx={{
        px: 6,
        py: 4,
        background: "#424242",
        minHeight: "60vh",
        color: "#fff",
        width: "90%",
        mx: "auto",
        borderRadius: 3,
        my: 4,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          letterSpacing: 1.2,
          textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        💸 Expenses Overview
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <MotionPaper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: "#388E3C",
              borderRadius: 3,
              boxShadow: "5px 5px 10px rgba(0,0,0,0.4)",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography variant="subtitle1">Total Expense Amount</Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              ₹{Number(totalExpenseAmount).toLocaleString()}
            </Typography>
          </MotionPaper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <MotionPaper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: "#388E3C",
              borderRadius: 3,
              boxShadow: "5px 5px 10px rgba(0,0,0,0.4)",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography variant="subtitle1">Expense Records</Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {expenseCount}
            </Typography>
          </MotionPaper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <MotionPaper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: "#388E3C",
              borderRadius: 3,
              boxShadow: "5px 5px 10px rgba(0,0,0,0.4)",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography variant="subtitle1">Average Expense</Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              ₹{averageExpense}
            </Typography>
          </MotionPaper>
        </Grid>
      </Grid>

       {/* Charts Section */}
<Grid container spacing={4} sx={{ mt: 4 }}>
  {/* Pie Chart: Expense Distribution by Category */}
  <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Typography
              variant="h6"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Expense Distribution by Category
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#fff"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        {(percent * 100).toFixed(0)}%
                      </text>
                    );
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                      style={{ transition: "transform 0.3s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#fff", fontWeight: "bold" }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </Grid>
         {/* Line Chart: Expense Trend Over Time */}
         <Grid item xs={12} md={6}>
          <Typography variant="h6" textAlign="center" gutterBottom>
          <TrendingUpIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Expense Trend Over Time
          </Typography>
          {expenseTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expenseTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <RechartsTooltip contentStyle={{ backgroundColor: "#fff", border: "none" }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ color: "#fff" }} />
                <Line type="monotone" dataKey="amount" stroke="#FFBB28" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body1" textAlign="center">
              No expense trend data available.
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Latest Expense Records */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Latest Expense Records
        </Typography>
        <Grid container spacing={2}>
          {latestExpenses.map((expense, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <MotionPaper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#4CAF50",
                  boxShadow: "3px 3px 8px rgba(0,0,0,0.4)",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Typography variant="subtitle2">
                {expense.category ? expense.category : "General"}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                ₹{Number(expense.amount).toLocaleString()}
                </Typography>
                <Typography variant="caption">
                {expense.created_at ? new Date(expense.created_at).toLocaleDateString() : "N/A"}
                </Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ExpensesOverview;
