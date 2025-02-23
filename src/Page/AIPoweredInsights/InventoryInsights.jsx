import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Warning, ShoppingCart, TrendingUp, LocalShipping } from '@mui/icons-material';

const InventoryInsights = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [lowStock, setLowStock] = useState('');
  //const [restockSuggestion, setRestockSuggestion] = useState('');
  //const [fastestSelling, setFastestSelling] = useState('');

 /* useEffect(() => {
    // Fetch product data from the backend
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        setProductData(data);

        // Find the product with low stock (quantity <= stock_threshold)
        const lowStockProduct = data.find(product => product.quantity <= product.stock_threshold);
        if (lowStockProduct) {
          setLowStock(`⚠️ Low Stock Alert: ${lowStockProduct.product_name} (${lowStockProduct.quantity} left)`);
        }

        // Find the fastest selling product (based on sales data, assuming "sold_quantity" exists)
        const fastestSellingProduct = data.reduce((max, product) => {
          return product.sold_quantity > max.sold_quantity ? product : max;
        }, data[0]);
        setFastestSelling(`🔥 Fastest Selling Product: ${fastestSellingProduct.product_name}`);

        // Placeholder suggestion (can be enhanced later)
        setRestockSuggestion('🛒 Restock Suggestion: Order new stock within 3 days');
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  }, []); */

   // Fetch product data using async/await with cancellation
   useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProductData(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching product data:', err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  // Memoize low stock alert
  const lowStock = useMemo(() => {
    if (!productData.length) return '';
    // Find the first product with quantity <= stock_threshold
    const lowStockProduct = productData.find(
      (product) => product.quantity <= product.stock_threshold
    );
    return lowStockProduct
      ? `⚠️ Low Stock Alert: ${lowStockProduct.product_name} (${lowStockProduct.quantity} left)`
      : 'All products sufficiently stocked';
  }, [productData]);

  // Memoize fastest selling product
  const fastestSelling = useMemo(() => {
    if (!productData.length) return '';
    // Check if sold_quantity is defined on at least one product
    const validProducts = productData.filter(product => product.sold_quantity !== undefined);
    if (!validProducts.length) return 'No sales data available';
    const fastestSellingProduct = validProducts.reduce((max, product) => {
      return product.sold_quantity > max.sold_quantity ? product : max;
    }, validProducts[0]);
    return `🔥 Fastest Selling Product: ${fastestSellingProduct.product_name}`;
  }, [productData]);

  // Memoize restock suggestion (this could be dynamic based on trends in productData)
  const restockSuggestion = useMemo(() => {
    if (!productData.length) return '';
    // For now, a placeholder suggestion; you could enhance this based on additional data or user input.
    return '🛒 Restock Suggestion: Order new stock within 3 days';
  }, [productData]);


  
  return (
    <Card
      sx={{
        maxWidth: 420,
        boxShadow: 10,
        borderRadius: 3,
        bgcolor: '#121212',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
        },
        padding: 3,
      }}
    >
      <CardContent sx={{ color: 'white' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: '#ffd700',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TrendingUp sx={{ fontSize: 24, verticalAlign: 'middle', mr: 1 }} />
          Inventory Insights
        </Typography>

        {loading ? (
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'white' }}>
            Loading inventory insights...
          </Typography>
        ) : error ? (
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'error.main' }}>
            {error}
          </Typography>
        ) : (
          <>
            {lowStock && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  backgroundColor: '#ffebee',
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Warning sx={{ fontSize: 20, color: '#f44336', mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#d32f2f' }}>
                  {lowStock}
                </Typography>
              </Box>
            )}

            {restockSuggestion && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  backgroundColor: '#e8f5e9',
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <ShoppingCart sx={{ fontSize: 20, color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#388e3c' }}>
                  {restockSuggestion}
                </Typography>
              </Box>
            )}

            {fastestSelling && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#e3f2fd',
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <LocalShipping sx={{ fontSize: 20, color: '#2196f3', mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976d2' }}>
                  {fastestSelling}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryInsights;