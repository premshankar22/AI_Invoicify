import React, {useState, useEffect} from "react";
import { Paper, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Brush,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Define missing color arrays
const paymentStatusColors = ["#4caf50", "#ff9800", "#f44336"];
const paymentMethodColors = ["#FFD700", "#1E90FF", "#4CAF50", "#FF5722"];

// -------------------- Custom Tooltip for Recharts -------------------- //
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          color: "#000",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          zIndex: 9999,
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: "#000", margin: 0 }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// -------------------- Custom Label for Donut Charts -------------------- //
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const MotionPaper = motion(Paper);

const SalesGraph = () => {
  // ---------- State for Interval & Custom Days for Chart Filtering ---------- //
  const [intervalOption, setIntervalOption] = useState("1 Year");
  const [customDays, setCustomDays] = useState(30);

  // ---------- State for Overview & Invoices Data ---------- //
  const [overview, setOverview] = useState(null);
  const [invoicesData, setInvoicesData] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // ---------- Fetch Overview Data from /overview endpoint ---------- //
  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch("http://localhost:5000/overview");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching /overview: ${res.status} ${res.statusText} - ${text}`);
        }
        const data = await res.json();
        setOverview(data);
        setLoadingOverview(false);
      } catch (error) {
        console.error("Error fetching overview:", error);
        setLoadingOverview(false);
      }
    }
    fetchOverview();
  }, []);

  // ---------- Fetch Invoices Data from /api/invoices ---------- //
  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("http://localhost:5000/api/invoices");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching /api/invoices: ${res.status} ${res.statusText} - ${text}`);
        }
        const data = await res.json();
        setInvoicesData(data);
        setLoadingInvoices(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setLoadingInvoices(false);
      }
    }
    fetchInvoices();
  }, []);

  // ---------- Group Invoices by Month for the Line Chart ---------- //
  // If invoicesData is not loaded, use an empty array.
  const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyDataMap = {}; // e.g. { Jan: { sales: 0, amount: 0, profit: 0 } }
  invoicesData.forEach((invoice) => {
    const date = new Date(invoice.invoice_date);
    const month = date.toLocaleString("default", { month: "short" });
    if (!monthlyDataMap[month]) {
      monthlyDataMap[month] = { sales: 0, amount: 0, profit: 0 };
    }
    // Use grand_total as sales and amount (you can adjust if needed)
    const value = Number(invoice.grand_total) || 0;
    monthlyDataMap[month].sales += value;
    monthlyDataMap[month].amount += value;
    // Assume profit is 20% of sales (for simulation)
    monthlyDataMap[month].profit += value * 0.2;
  });
  // Create ordered chart data based on monthsOrder
  const chartData = monthsOrder.map((m) => ({
    date: m,
    sales: monthlyDataMap[m] ? monthlyDataMap[m].sales : 0,
    amount: monthlyDataMap[m] ? monthlyDataMap[m].amount : 0,
    profit: monthlyDataMap[m] ? monthlyDataMap[m].profit : 0,
  }));

  // ---------- Compute Payment Insights from Invoices ---------- //
  const paymentStatusCount = {};
  const paymentMethodCount = {};
  invoicesData.forEach((invoice) => {
    const status = invoice.payment_status || "Unknown";
    const method = invoice.payment_method || "Unknown";
    paymentStatusCount[status] = (paymentStatusCount[status] || 0) + 1;
    paymentMethodCount[method] = (paymentMethodCount[method] || 0) + 1;
  });
  const paymentStatusChartData = Object.keys(paymentStatusCount).map((key) => ({
    name: key,
    value: paymentStatusCount[key],
  }));
  const paymentMethodChartData = Object.keys(paymentMethodCount).map((key) => ({
    name: key,
    value: paymentMethodCount[key],
  }));

  // ---------- Determine the Month Count to Display based on Interval Option ---------- //
  const getMonthCount = () => {
    switch (intervalOption) {
      case "1 Week":
        return 1;
      case "1 Month":
        return 1;
      case "3 Months":
        return 3;
      case "6 Months":
        return 6;
      case "1 Year":
        return 12;
      case "Custom":
        return Math.min(12, Math.ceil(customDays / 30));
      default:
        return 12;
    }
  };
  const monthCount = getMonthCount();
  // For simplicity, here we use the full chartData; you can slice it if needed.
  
  // ---------- Loading States ----------
  if (loadingOverview || loadingInvoices) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6">Loading data...</Typography>
      </Box>
    );
  }

  return (
   <Box  sx={{
    display: "flex",
    flexDirection: "row", // Change from column to row
    gap: 2,
    alignItems: "stretch", // Ensure equal height
    justifyContent: "center", // Center horizontally
    width: "100%",
    p: 2,
    flexWrap: "wrap", // Allow wrapping on small screens
  }}>   
      
      { /* Section 1 */}
     <Box sx={{  flex: 1, minWidth: 500}}>
     <MotionPaper
          sx={{
            p: 3,
            m: 2,
            width: "100%",
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://source.unsplash.com/random/?tech,dashboard')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            backdropFilter: "blur(10px)",
          }}
          elevation={4}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Typography variant="h6" textAlign='center' gutterBottom>
          Sales, Amount & Profit Overview (Last {monthCount} Month
            {monthCount > 1 ? "s" : ""})
          </Typography>

           {/* Display Overview Metrics from /overview endpoint */}
           <Box
            sx={{
              mb: 2,
              p: 2,
              background: "rgba(0,0,0,0.4)",
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" textAlign="center">
              Total Revenue: ₹{overview.total_revenue}
            </Typography>
            <Typography variant="subtitle1" textAlign="center">
              Total Expenses: ₹{overview.total_expenses}
            </Typography>
            <Typography variant="subtitle1" textAlign="center" sx={{ color: overview.profit_loss_color }}>
              Profit/Loss: ₹{overview.profit_loss}
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={350}>
          <LineChart
                 data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis
                stroke="#fff"
                label={{
                  value: "Value",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#fff",
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                formatter={(value, name) => [value, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ color: "#fff" }} />
              <Line
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
                dot={{ r: 4, strokeWidth: 1, fill: "#8884d8" }}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Line
                type="monotone"
                dataKey="amount"
                name="Amount"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 1, fill: "#82ca9d" }}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 1, fill: "#ff7300" }}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <ReferenceLine
                y={7000}
                label="Target"
                stroke="red"
                strokeDasharray="3 3"
              />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
           {/* Controls for interval selection */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <select
          value={intervalOption}
          onChange={(e) => setIntervalOption(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        >
          <option value="1 Week">1 Week</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Months">3 Months</option>
          <option value="6 Months">6 Months</option>
          <option value="1 Year">1 Year</option>
          <option value="Custom">Custom</option>
        </select>
        {intervalOption === "Custom" && (
          <input
            type="number"
            value={customDays}
            onChange={(e) => setCustomDays(Number(e.target.value))}
            placeholder="Enter days"
            style={{
              marginLeft: "10px",
              padding: "8px",
              fontSize: "16px",
              width: "100px",
            }}
          />
        )}
      </Box>
        </MotionPaper>
      </Box>

     {/* Section 2:  Payment Insights */}
     <Box sx={{  flex: 1, minWidth: 400, justifyItems:'end'}}>
     <MotionPaper
            sx={{
                p: 3,
                m: 2,
                width: "80%",
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://source.unsplash.com/random/?finance,bank')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                backdropFilter: "blur(10px)",
              }}
              elevation={4}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <Typography variant="h6" textAlign="center" gutterBottom>
              Payment Insights (Last {monthCount} Month{monthCount > 1 ? "s" : ""})
            </Typography>
            <Typography variant="subtitle2" align="center" gutterBottom>
              Overview of Payment Status & Methods
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {/* Payment Status Donut Chart */}
              <Box sx={{ width: "45%" }}>
                <Typography variant="subtitle1" align="center" gutterBottom>
                  Payment Status
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={paymentStatusChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      label={renderCustomizedLabel}
                    >
                      {paymentStatusChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={paymentStatusColors[index % paymentStatusColors.length]}
                          style={{ transition: "transform 0.3s", cursor: "pointer" }}
                          onMouseEnter={(e) =>
                            e.currentTarget.style.transform = "scale(1.1)"
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.style.transform = "scale(1)"
                          }
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              {/* Payment Method Donut Chart */}
              <Box sx={{ width: "45%" }}>
                <Typography variant="subtitle1" align="center" gutterBottom>
                  Payment Method
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                       data={paymentMethodChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      label={renderCustomizedLabel}
                    >
                      {paymentMethodChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={paymentMethodColors[index % paymentMethodColors.length]}
                          style={{ transition: "transform 0.3s", cursor: "pointer" }}
                          onMouseEnter={(e) =>
                            e.currentTarget.style.transform = "scale(1.1)"
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.style.transform = "scale(1)"
                          }
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </MotionPaper>
      </Box>
      
   </Box>
  );
};


export default SalesGraph;
