import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import * as tf from '@tensorflow/tfjs';

// Styled components with more style
const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-5px)',
      transition: 'all 0.3s ease',
    },
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(33, 150, 243, 0.1))',
  }));
  
  const StyledTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: theme.palette.primary.main,
  }));

const AIPredictions = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [predictedGrowth, setPredictedGrowth] = useState(null);
  const [bestSellingHours, setBestSellingHours] = useState('');
  const [topProduct, setTopProduct] = useState('');

  /* Fetch invoices data
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sales');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched invoices:', data);
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, []);  */

  useEffect(() => {
    const controller = new AbortController();
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sales', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching invoices:', error);
        }
      }
    };
    fetchInvoices();
    return () => controller.abort();
  }, []);


  // Fetch invoice_products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/invoice-products');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched invoice products:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching invoice products:', error);
      }
    };
    fetchProducts();
  }, []);


   // TensorFlow useEffect for running a sample prediction (adjust as needed)
   useEffect(() => {
    const runTensorFlow = async () => {
      try {
        // Optionally set the backend ('webgl' for GPU acceleration, or 'cpu')
        await tf.setBackend('webgl');
        console.log("TensorFlow backend set:", tf.getBackend());

        // Load your model (ensure the path to model.json is correct)
        const model = await tf.loadLayersModel('model.json');
        console.log("Model loaded.");

        // Create an example input tensor
        const inputTensor = tf.tensor2d([1, 2, 3, 4], [2, 2]);

        // Use tf.tidy to manage memory for intermediate tensors
        tf.tidy(() => {
          const prediction = model.predict(inputTensor);
          prediction.print();
        });

        // Dispose of the input tensor if not handled by tf.tidy
        inputTensor.dispose();
      } catch (error) {
        console.error('Error during TensorFlow operations:', error);
      }
    };

    runTensorFlow();
  }, []);


  // Compute predicted growth and best selling hours from invoices
  useEffect(() => {
    if (invoices.length === 0) return;
    
    // Sort invoices by invoice_date (ascending)
    const sortedInvoices = [...invoices].sort(
      (a, b) => new Date(a.invoice_date) - new Date(b.invoice_date)
    );
    const mid = Math.floor(sortedInvoices.length / 2);
    const firstHalf = sortedInvoices.slice(0, mid);
    const secondHalf = sortedInvoices.slice(mid);

    const sumFirst = firstHalf.reduce(
      (sum, inv) => sum + parseFloat(inv.grand_total),
      0
    );
    const sumSecond = secondHalf.reduce(
      (sum, inv) => sum + parseFloat(inv.grand_total),
      0
    );

    let growthPercent = 0;
    if (sumFirst > 0) {
      growthPercent = ((sumSecond - sumFirst) / sumFirst) * 100;
    }
    setPredictedGrowth(Math.round(growthPercent));

    // Compute best selling hour
    const hourCounts = {};
    sortedInvoices.forEach((inv) => {
      const d = new Date(inv.invoice_date);
      const hr = d.getHours();
      hourCounts[hr] = (hourCounts[hr] || 0) + 1;
    });
    let bestHour = null;
    let maxCount = 0;
    for (const hr in hourCounts) {
      if (hourCounts[hr] > maxCount) {
        maxCount = hourCounts[hr];
        bestHour = parseInt(hr, 10);
      }
    }
    const endHour = (bestHour + 2) % 24;
    const formatHour = (hr) => {
      const suffix = hr >= 12 ? 'PM' : 'AM';
      let formatted = hr % 12;
      if (formatted === 0) formatted = 12;
      return `${formatted} ${suffix}`;
    };
    setBestSellingHours(`${formatHour(bestHour)} - ${formatHour(endHour)}`);
  }, [invoices]);

  // Compute top suggested product from invoice_products
  useEffect(() => {
    if (products.length === 0) return;
    
    const productFrequency = {};
    products.forEach((prod) => {
      const name = prod.product_name;
      productFrequency[name] = (productFrequency[name] || 0) + 1;
    });
    let top = '';
    let maxCount = 0;
    for (const name in productFrequency) {
      if (productFrequency[name] > maxCount) {
        maxCount = productFrequency[name];
        top = name;
      }
    }
    setTopProduct(top);
  }, [products]);

  return (
    <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <StyledTypography variant="h4" align="center">
        🤖 AI-Driven Sales Predictions
      </StyledTypography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={5}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                📈 Predicted Growth
              </Typography>
              <Typography variant="body2" sx={{ color: predictedGrowth >= 0 ? 'green' : 'red' }}>
                {predictedGrowth !== null
                  ? predictedGrowth >= 0
                    ? `+${predictedGrowth}%`
                    : `${predictedGrowth}%`
                  : 'Calculating...'}{' '}
                this month
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={5}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                🕒 Best Selling Hours
              </Typography>
              <Typography variant="body2">
                {bestSellingHours || 'Calculating...'}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={5}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                💡 Top Suggested Product
              </Typography>
              <Typography variant="body2">
                {topProduct || 'Calculating...'}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIPredictions;