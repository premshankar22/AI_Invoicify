import React, { useEffect, useState, useMemo } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import FutureSalesSelector from './FutureSalesSelector'; // Adjust the path as needed

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const SalesOverview = () => {
  const [salesData, setSalesData] = useState([]);
  const [predictedSales, setPredictedSales] = useState([]);
  const [futureDays, setFutureDays] = useState(7); // Default to 1 Week
  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [error, setError] = useState(null);

  /*Fetch data from the backend
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sales');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched sales data:', data);
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []); */ 

  useEffect(() => {
    const controller = new AbortController();
    const fetchSalesData = async () => {
      setLoadingSales(true);
      try {
        const response = await fetch('http://localhost:5000/api/sales', { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched sales data:', data);
        setSalesData(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching sales data:', error);
          setError(error.message);
        }
      } finally {
        setLoadingSales(false);
      }
    };
  
    fetchSalesData();
    return () => controller.abort();
  }, []);


  /* Train TensorFlow model using the fetched grand_total values
  useEffect(() => {
    const trainModel = async () => {
      if (!salesData.length) return;

      try {
        // Extract grand_total values from the fetched data.
        const salesDataForTraining = salesData.map((item, index) => {
          const value = parseFloat(item.grand_total);
          if (isNaN(value)) {
            console.warn(`Invoice at index ${index} has an invalid grand_total:`, item.grand_total);
          }
          return value;
        });

        console.log('Sales data for training:', salesDataForTraining);

        // Create and compile a simple sequential model using Adam optimizer
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
        model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });

        // Create input tensors (using index as a proxy for time)
        const xs = tf.tensor2d([...Array(salesDataForTraining.length).keys()], [salesDataForTraining.length, 1]);
        const ys = tf.tensor2d(salesDataForTraining, [salesDataForTraining.length, 1]);

        console.log('Training model...');
        await model.fit(xs, ys, { epochs: 500 });
        console.log('Model training complete.');

        // Predict future sales for the selected number of days
        const futureXs = tf.tensor2d(
            [...Array(futureDays).keys()].map((i) => i + salesDataForTraining.length),
            [futureDays, 1]
        );

        const futurePredictions = model.predict(futureXs);
        const predictedValues = await futurePredictions.data();
        console.log('Predicted values for future sales:', predictedValues);

        // Combine historical and predicted values
        setPredictedSales([...salesDataForTraining, ...Array.from(predictedValues)]);
      } catch (err) {
        console.error('Error during model training/prediction:', err);
      }
    };

    trainModel();
  }, [salesData, futureDays]);  */

  useEffect(() => {
    const trainModel = async () => {
      if (!salesData.length) return;
  
      setLoadingModel(true);
      try {
        // Extract and validate training data
        const salesDataForTraining = salesData.map((item, index) => {
          const value = parseFloat(item.grand_total);
          if (isNaN(value)) {
            console.warn(`Invoice at index ${index} has an invalid grand_total:`, item.grand_total);
          }
          return value;
        });
        
        console.log('Sales data for training:', salesDataForTraining);
  
        // Create and compile a simple sequential model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
        model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });
  
        // Create input tensors
        const xs = tf.tensor2d([...Array(salesDataForTraining.length).keys()], [salesDataForTraining.length, 1]);
        const ys = tf.tensor2d(salesDataForTraining, [salesDataForTraining.length, 1]);
  
        console.log('Training model...');
        await model.fit(xs, ys, { epochs: 500 });
        console.log('Model training complete.');
  
        // Predict future sales
        const futureXs = tf.tensor2d(
          [...Array(futureDays).keys()].map((i) => i + salesDataForTraining.length),
          [futureDays, 1]
        );
        const futurePredictions = model.predict(futureXs);
        const predictedValues = await futurePredictions.data();
        console.log('Predicted values for future sales:', predictedValues);
  
        // Clean up tensors
        xs.dispose();
        ys.dispose();
        futureXs.dispose();
        futurePredictions.dispose();
  
        setPredictedSales([...salesDataForTraining, ...Array.from(predictedValues)]);
        
        // Optionally, cache the model using a ref if you plan to re-use it.
      } catch (err) {
        console.error('Error during model training/prediction:', err);
        setError(err.message);
      } finally {
        setLoadingModel(false);
      }
    };
  
    trainModel();
  }, [salesData, futureDays]);
  

  // Generate labels based on the number of data points
  const totalPoints = useMemo(() => {
  return predictedSales.length || salesData.length;
}, [predictedSales, salesData]);

const labels = useMemo(() => {
  return Array.from({ length: totalPoints }, (_, i) => `Day ${i + 1}`);
}, [totalPoints]);

const chartData = useMemo(() => {
  return {
    labels,
    datasets: [
      {
        label: 'Total Sales ($)',
        data: predictedSales.length > 0 
          ? predictedSales 
          : salesData.map((item) => parseFloat(item.grand_total)),
        backgroundColor: ['#ff4081', '#7c4dff', '#00e5ff', '#76ff03', '#ffea00', '#ff3d00'],
        borderRadius: 6,
        hoverBackgroundColor: '#1e88e5',
      },
    ],
  };
}, [labels, predictedSales, salesData]);

  return (
    <Card
      sx={{
        maxWidth: '100%',
        borderRadius: 3,
        boxShadow: 6,
        background: 'linear-gradient(135deg, #2e3b55 30%, #1a1a2e 90%)',
        color: '#fff',
        padding: 3,
      }}
    >
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#76ff03' }}>
            🚀 AI-Powered Sales Insights
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
            Analyze past trends & predict future sales with AI-powered analytics.
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.3)' }} />

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <FutureSalesSelector futureDays={futureDays} setFutureDays={setFutureDays} />
        </Box>

        {loadingSales && (
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#fff', mb: 2 }}>
            Loading sales data...
          </Typography>
        )}
        {loadingModel && (
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#fff', mb: 2 }}>
            Training model and predicting future sales...
          </Typography>
        )}
        {error && (
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'error.main', mb: 2 }}>
            {error}
          </Typography>
        )}


        <Box sx={{ overflowX: 'auto', p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, boxShadow: 4 }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Sales Data Over Time',
                  font: { size: 20, weight: 'bold' },
                  color: '#fff',
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleFont: { weight: 'bold' },
                  bodyFont: { size: 14 },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Days',
                    font: { size: 14, weight: 'bold' },
                    color: '#fff',
                  },
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255, 255, 255, 0.2)' },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Total Sales ($)',
                    font: { size: 14, weight: 'bold' },
                    color: '#fff',
                  },
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255, 255, 255, 0.2)' },
                },
              },
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            fontSize: '0.9rem',
            mt: 3,
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          🔮 The AI Model predicts future sales based on historical trends. Adjust the number of days to forecast upcoming sales.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SalesOverview;