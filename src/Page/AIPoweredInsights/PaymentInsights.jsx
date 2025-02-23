import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { CreditCard, TrendingUp, Person } from '@mui/icons-material';
import * as tf from '@tensorflow/tfjs';

const PaymentInsights = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [topCustomers, setTopCustomers] = useState([]);
  const [retentionRate, setRetentionRate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* useEffect(() => {
    // Fetch sales data from backend
    fetch('http://localhost:5000/api/sales')
      .then(response => response.json())
      .then(data => {
        setPaymentData(data);

        // Process and analyze data using TensorFlow.js
        analyzeData(data);
      })
      .catch(error => console.error('Error fetching sales data:', error));
  }, []);  */
  
  useEffect(() => {
    const controller = new AbortController();
    const fetchSalesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sales', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPaymentData(data);
        analyzeData(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching sales data:', err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
    return () => controller.abort();
  }, []);


   /*const analyzeData = (data) => {
    // Example analysis using TensorFlow.js (you can improve this with more complex models)
    
    // Convert payment data to a tensor (this is an example of pre-processing)
    const paymentValues = data.map(item => item.payment_amount); // Assuming 'payment_amount' exists
    const paymentTensor = tf.tensor(paymentValues);

    // Example prediction for "most used payment method" based on frequency (simple analysis)
    const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Cash'];
    const paymentMethodFrequency = paymentMethods.map(method => 
      data.filter(item => item.payment_method === method).length
    );

    const mostUsedPaymentMethodIndex = tf.argMax(tf.tensor(paymentMethodFrequency)).dataSync()[0];
    setPaymentMethod(`💳 Most Used Payment Method: ${paymentMethods[mostUsedPaymentMethodIndex]} (${paymentMethodFrequency[mostUsedPaymentMethodIndex]}%)`);

    // Analyze top spending customers (simple sorting by payment amount)
    const topSpenders = data
      .sort((a, b) => b.payment_amount - a.payment_amount)
      .slice(0, 2)
      .map(item => `${item.customer_name} ($${item.payment_amount})`);

    setTopCustomers(topSpenders);

    // Calculate customer retention rate (simplified calculation)
    const totalCustomers = new Set(data.map(item => item.customer_id)).size;
    const retainedCustomers = data.filter(item => item.payment_count > 1).length; // Assuming 'payment_count' exists
    const retention = (retainedCustomers / totalCustomers) * 100;

    setRetentionRate(`📊 Customer Retention Rate: ${retention.toFixed(2)}%`);
  };  */

  const analyzeData = (data) => {
    // Preprocess and validate payment values
    const paymentValues = data.map(item => {
      const amount = parseFloat(item.payment_amount);
      return isNaN(amount) ? 0 : amount;
    });
    
    // Create tensor for analysis
    const paymentTensor = tf.tensor(paymentValues);
    
    // (Perform any TensorFlow-based operations if needed)
    
    // Dispose of the tensor after analysis
    paymentTensor.dispose();
  
    // ...continue with your simple JS analysis
    const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Cash'];
    const paymentMethodFrequency = paymentMethods.map(method => 
      data.filter(item => item.payment_method === method).length
    );
  
    // Use TensorFlow for argMax if you want – then dispose that tensor
    const frequencyTensor = tf.tensor(paymentMethodFrequency);
    const mostUsedPaymentMethodIndex = tf.argMax(frequencyTensor).dataSync()[0];
    frequencyTensor.dispose();
  
    setPaymentMethod(`💳 Most Used Payment Method: ${paymentMethods[mostUsedPaymentMethodIndex]} (${paymentMethodFrequency[mostUsedPaymentMethodIndex]}%)`);
  
    // Analyze top spending customers
    const topSpenders = data
      .sort((a, b) => b.payment_amount - a.payment_amount)
      .slice(0, 2)
      .map(item => `${item.customer_name} ($${item.payment_amount})`);
    setTopCustomers(topSpenders);
  
    // Calculate customer retention rate
    const totalCustomers = new Set(data.map(item => item.customer_id)).size;
    const retainedCustomers = data.filter(item => item.payment_count > 1).length;
    const retention = (retainedCustomers / totalCustomers) * 100;
    setRetentionRate(`📊 Customer Retention Rate: ${retention.toFixed(2)}%`);
  };
  

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
      <Card sx={{ 
        maxWidth: 400, 
        boxShadow: 10, 
        borderRadius: 3, 
        bgcolor: 'linear-gradient(135deg, #ff7e5f, #feb47b)', 
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
        '&:hover': { transform: 'scale(1.05)', boxShadow: 20 } 
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.contrastText' }}>
            <CreditCard sx={{ fontSize: 30, verticalAlign: 'middle', mr: 1 }} />
            Payment & Customer Insights
          </Typography>

          {loading ? (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'primary.contrastText' }}>
              Loading insights...
            </Typography>
          ) : error ? (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'error.main' }}>
              {error}
            </Typography>
          ) : (
            <>
              {paymentMethod && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUp sx={{ fontSize: 24, color: 'info.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {paymentMethod}
                  </Typography>
                </Box>
              )}

              {topCustomers.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    <Person sx={{ fontSize: 24, color: 'warning.main', mr: 2 }} />
                    Top Spending Customers:
                  </Typography>
                  {topCustomers.map((customer, index) => (
                    <Typography key={index} variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      🛍️ {customer}
                    </Typography>
                  ))}
                </Box>
              )}

              {retentionRate && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 24, color: 'success.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {retentionRate}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentInsights;