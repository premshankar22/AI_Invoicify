import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { keyframes } from '@mui/material/styles';
import CustomCard from './CustomCard';
import SalesOverview from './SalesOverview';
import AIPredictions from './AIPredictions';
import ExpenseMonitoring from './ExpenseMonitoring';
import InventoryInsights from './InventoryInsights';
import PaymentInsights from './PaymentInsights';

// Define animations
const spinSlow = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.75; }
  100% { opacity: 1; }
`;

const AIPoweredInsights = () => {
  return (
    <Box
    sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3, // Reduced padding for better fit
        background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', // Warm gradient
        width: '100%', // Ensure it spans full width
        minHeight: '180px', // Ensure minimum height
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Animated Icon */}
        <RocketLaunchIcon
          sx={{
            fontSize: { xs: 40, md: 60 },
            color: 'yellow',
            animation: `${spinSlow} 6s linear infinite`,
          }}
        />
        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '4rem' },
            textShadow: '0px 4px 6px rgba(0,0,0,0.3)',
            animation: `${pulse} 2s infinite`,
          }}
        >
          AI-Powered Insights
        </Typography>
      </Box>
      <Typography
        variant="subtitle1"
        sx={{
          color: 'white',
          mt: 2,
          fontSize: { xs: '1rem', md: '1.25rem' },
          textAlign: 'center',
        }}
      >
        Unlock the power of AI-driven analytics, trends, and predictions.
      </Typography>
    </Box>
  );
};

const Dashboard = () => {
  return (
    <Box sx={{ p: 0, m: 0 }}>
      <AIPoweredInsights />

      {/* Grid Layout for Cards */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(to right, #1e3c72, #2a5298)', // Cool blue theme
              color: 'white',
              height: '100%',
            }}
          >
            <CustomCard title="📊 Sales Overview" component={<SalesOverview />} />
          </Paper>
        </Grid>
         {/* AI Predictions Section */}
         <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(to right, #4e54c8, #8f94fb)', // Another shade
              color: 'white',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'center',
             // alignItems: 'center',
              height: '100%',
            }}
          >
            <CustomCard title="🤖 AI Predictions" component={<AIPredictions />} />
          </Paper>
        </Grid>
        {/* Expense Monitoring Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(to right, #ff8a00, #e52e71)', // Warm gradient
              color: 'white',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CustomCard title="💰 Expense Monitoring" component={<ExpenseMonitoring />} />
          </Paper>
        </Grid>
        {/* Inventory Insights Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(to right, #2196f3, #00bcd4)', // Blue gradient
              color: 'white',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.3)',
              },
              height: '100%',
            }}
          >
            <CustomCard title="📦 Inventory Insights" component={<InventoryInsights />} />
          </Paper>
        </Grid>
        {/* Payment Insights Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(to right, #ff6347, #ff9966)', // Peachy gradient
              color: 'white',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.3)',
              },
              height: '100%',
            }}
          >
            <CustomCard title="💳 Payment Insights" component={<PaymentInsights />} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
