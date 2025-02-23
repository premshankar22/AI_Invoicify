import React from "react";
import { Box, Typography } from "@mui/material";
import OverviewSection from "./OverviewSection";
import SalesGraph from "./SalesGraph";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { motion} from "framer-motion";
import { keyframes } from "@mui/material/styles";
import ProductOverview from "./ProductOverview"; 
import ExpensesOverview from "./ExpensesOverview";

// Define keyframe animations using MUI's keyframes for a subtle pulse effect (optional)
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.85; }
  100% { opacity: 1; }
`;

// AnalyticsDashboard with an advanced rocket launcher animation
const AnalyticsDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(45deg, #1D2671, #C33764)",
        overflow: "hidden",
      }}
    >
      {/* Animated Title Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 2,
          zIndex: 1,
        }}
      >
        {/* Wrap the Rocket Icon with a motion.div to animate rotation, vertical movement, and scaling */}
        <motion.div
          animate={{
            rotate: [0, 360],
            translateY: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 6, ease: "linear" },
            translateY: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          }}
        >
          <RocketLaunchIcon
            sx={{
              fontSize: { xs: 50, md: 60 },
              color: "#fff",
            }}
          />
        </motion.div>
        <Typography
          variant="h3"
          sx={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: "8px",
            padding: "10px 20px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
            letterSpacing: 2,
            mb: 3,
            animation: `${pulse} 2s infinite`,
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          Analytics Dashboard
        </Typography>
      </Box>

      {/* Render the OverviewSection and SalesGraph components */}
      <OverviewSection />
      <SalesGraph />
      <ProductOverview />
      <ExpensesOverview />
    </Box>
  );
};

export default AnalyticsDashboard;
