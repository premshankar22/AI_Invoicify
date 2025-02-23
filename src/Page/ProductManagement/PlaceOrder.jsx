import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tooltip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  InputAdornment
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";

  const categories = ["Grocery","Electronic","Mobile", "Accessories", "Cloths","Furniture", "Sports", "Home", "Kitchen",];
  const units = ["Kg", "Litre", "Meter", "Piece", "Box"];
  const paymentMethods = ["Cash", "Credit Card", "UPI", "Bank Transfer"];
  const paymentStatuses = ["Pending", "Completed", "Failed"];
  const currencies = ["INR", "USD", "EUR"];
  const orderStatuses = ["Pending", "Confirmed", "Shipped", "Delivered"];

  const PlaceOrder = ({ onBack }) => {

  // Section 1: Form state for adding product details
  const [category, setCategory] = useState("");
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);

  // Section 2: Order products list
  const [orderProducts, setOrderProducts] = useState([]);

  // Section 3: Order detail state (e.g., customer details)
  const [orderNotes, setOrderNotes] = useState("");
  const [searchType, setSearchType] = useState("all"); // Default to 'All'
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [shippingAddress, setShippingAddress] = useState("");
    // Auto-generate Order ID and Date
 const [orderID, setOrderID] = useState("");
 const [orderDate, setOrderDate] = useState("");
 const [orderStatus, setOrderStatus] = useState("");
 const [transactionId, setTransactionId] = useState("");
  
  // SECTION 3: Supplier Data (fetched from API)
  const [suppliers, setSuppliers] = useState([]);
  const [showSupplierList, setShowSupplierList] = useState(false);
  
  // Section 1: Search bar state for finding products
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productSearchType, setProductSearchType] = useState("ALL"); // Options: "ALL", "Product ID", "Category", "Product Name"
  const [fetchedProducts, setFetchedProducts] = useState([]); // Fetched from API
  

   // --- On mount, generate Order ID and Order Date ---
   useEffect(() => {
    setOrderID(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
    setOrderDate(new Date().toLocaleString());
  }, []);


   // Fetch suppliers from the API on mount
   useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/suppliers");
        if (!response.ok) {
          console.error("Error fetching suppliers");
          return;
        }
        const data = await response.json();
        // Optionally transform data if needed. Here we assume each supplier has supplier_id and name.
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);


   // --- Fetch product data from API on mount ---
   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          console.error("Error fetching products");
          return;
        }
        const data = await response.json();
        setFetchedProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);


   // --- Search filtering ---
   const filteredProducts = fetchedProducts.filter((product) => {
    if (!productSearchQuery) return false; // Show suggestions only if there's a query
    const query = productSearchQuery.toLowerCase();
    if (productSearchType === "ALL") {
      return (
        product.product_id.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.product_name.toLowerCase().includes(query)
      );
    } else if (productSearchType === "Product ID") {
      return product.product_id.toLowerCase().includes(query);
    } else if (productSearchType === "Category") {
      return product.category.toLowerCase().includes(query);
    } else if (productSearchType === "Product Name") {
      return product.product_name.toLowerCase().includes(query);
    }
    return false;
  });

   // --- Handle Category Selection ---
   const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    //setProductID(generateProductID(selectedCategory));
  };

  // --- Calculate Total Amount based on Price and Quantity ---
  const calculateTotalAmount = (price, quantity) => {
    return price && quantity ? (price * quantity).toFixed(2) : "";
  };

  const handlePriceChange = (event) => {
    setProductPrice(event.target.value);
    setTotalAmount(calculateTotalAmount(event.target.value, productQuantity));
  };

  const handleQuantityChange = (event) => {
    setProductQuantity(event.target.value);
    setTotalAmount(calculateTotalAmount(productPrice, event.target.value));
  };


  // --- Handler to add a product to the orderProducts array ---
  const handleAddProduct = () => {
    if (!category || !productName || !productPrice || !productQuantity || !unit) {
      alert("Please fill in all product details.");
      return;
    }

    const newProduct = {
      id: productID,
      category,
      name: productName,
      unit,
      price: productPrice,
      quantity: productQuantity,
      total: totalAmount,
    };

    const updatedOrderProducts = [...orderProducts, newProduct];
    setOrderProducts(updatedOrderProducts);

    // Update grand total
    const newGrandTotal = updatedOrderProducts.reduce(
      (sum, item) => sum + Number(item.total),
      0
    );
    setGrandTotal(newGrandTotal);

    // Clear product form fields
    setCategory("");
    setProductID("");
    setProductName("");
    setProductPrice("");
    setProductQuantity("");
    setUnit("");
    setTotalAmount("");
  };

  
  // --- Handler to place the order ---
  const handlePlaceOrder = async () => {
    if (orderProducts.length === 0) {
      alert("Please add at least one product to the order.");
      return;
    }
    if (!supplierID) {
      alert("Please enter the supplier ID.");
      return;
    }
    if (!deliveryDate) {
      alert("Please enter the delivery date.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (!paymentStatus) {
      alert("Please select a payment status.");
      return;
    }
    if (!shippingAddress) {
      alert("Please enter the shipping address.");
      return;
    }
    if (paymentMethod !== "Cash" && !transactionId) {
      alert("Please enter the Transaction ID for the selected payment method.");
      return;
    }

    // Compute grand total from orderProducts (if not already computed)
  const computedGrandTotal = orderProducts.reduce(
    (sum, product) => sum + Number(product.total),
    0
  );
  
    // Generate a formatted order date in "YYYY-MM-DD HH:MM:SS" format
    const formattedOrderDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  
    // Combine order details and products
    const orderData = {
      orderID,
      orderDate: formattedOrderDate,  // Use the correctly formatted date
      supplierID,
      deliveryDate,                   // Ensure deliveryDate is in a proper date format (YYYY-MM-DD) if needed
      paymentMethod,
      paymentStatus,
      currency,
      shippingAddress,
      orderNotes,
      orderStatus,
      transactionId: paymentMethod !== "Cash" ? transactionId : "",
      grandTotal: computedGrandTotal,
      products: orderProducts,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert("Error placing order: " + errorData.error);
        return;
      }
      const data = await response.json();
      console.log("Order placed successfully:", data);
      alert("Order placed successfully!");
  
      // Clear order details and regenerate Order ID & Order Date for the next order
      setOrderProducts([]);
      setSupplierID("");
      setDeliveryDate("");
      setPaymentMethod("");
      setPaymentStatus("");
      setCurrency("INR");
      setShippingAddress("");
      setOrderNotes("");
      setOrderStatus("");
      setTransactionId("");
      setOrderID(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
      // Update order date with the new formatted date
      setOrderDate(new Date().toISOString().slice(0, 19).replace("T", " "));
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };
  

  // --- Supplier Search Handlers ---
  const handleSupplierSearchChange = (e) => {
    setSupplierSearch(e.target.value);
    setShowSupplierList(true);
  };
  
  const handleSupplierSelect = (selectedSupplier) => {
    setSupplierID(selectedSupplier.supplier_id); // Auto-fill Supplier ID from API field
    setSupplierSearch(selectedSupplier.name); // Display supplier name in search input
    setShowSupplierList(false); // Close the dropdown list
  };

  
  // Filter suppliers based on search criteria
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (searchType === "name") {
      return supplier.name.toLowerCase().includes(supplierSearch.toLowerCase());
    } else if (searchType === "id") {
      return supplier.id.toLowerCase().includes(supplierSearch.toLowerCase());
    }
    return supplier; // Show all if "All" is selected
  });

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        p: 3,
      }}
    >
    {/* Header with Title and Back Button */}
<Box 
  display="flex" 
  alignItems="center" 
  justifyContent="space-between" 
  position="relative" 
  p={2} 
  borderBottom={1} 
  borderColor="grey.300"
  sx={{
    backgroundColor: "#f4f6f8",
    borderRadius: "8px 8px 0 0",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
  }}
>
  {/* Back Button (Left Side) */}
  <Tooltip title="Go back to Product Management" arrow>
    <Button
      variant="contained"
      startIcon={<ArrowBackIosIcon />}
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#115293",
        },
      }}
      onClick={onBack}
    >
      Back
    </Button>
  </Tooltip>

  {/* Centered Title */}
  <Typography 
    variant="h5" 
    sx={{ 
      fontWeight: "bold", 
      flexGrow: 1, 
      textAlign: "center",
      color: "#333",
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    }}
  >
    Place Order
  </Typography>
</Box>

      {/* ================== Section 1: Add Product Form ================== */}
      
          {/* Section 1: Add Product */}
<Box mb={4} p={2} border={1} borderColor="grey.300" borderRadius={2}>
  <Typography variant="h6" sx={{ mb: 2 }}>Add Product to Order</Typography>
    
     {/* --- Search Bar --- */}
     <Box mb={2}>
     <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={productSearchQuery}
          onChange={(e) => setProductSearchQuery(e.target.value)}
          sx={{ flex: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Search By"
          variant="outlined"
          fullWidth
          value={productSearchType}
          onChange={(e) => setProductSearchType(e.target.value)}
          sx={{ flex: 1 }}
        >
          <MenuItem value="ALL">ALL</MenuItem>
          <MenuItem value="Product ID">Product ID</MenuItem>
          <MenuItem value="Category">Category</MenuItem>
          <MenuItem value="Product Name">Product Name</MenuItem>
        </TextField>
      </Box>

      {/* Suggestions List */}
      {filteredProducts.length > 0 && (
        <Paper
          sx={{
            mt: 1,
            maxHeight: 200,
            overflowY: "auto",
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          {filteredProducts.map((product) => (
            <Box
              key={product.product_id}
              sx={{
                p: 1,
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => {
                setProductID(product.product_id);
                setCategory(product.category);
                setProductName(product.product_name);
                setProductSearchQuery("");
                setProductSearchType("ALL");
              }}
            >
              <Typography variant="body2">
                {product.product_id} - {product.product_name} ({product.category})
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
   </Box>
  <Grid container spacing={2}>
    {/* Category Selection & Product ID */}
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={handleCategoryChange}>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} md={6}>
  <TextField 
    label="Product ID" 
    value={productID} 
    fullWidth 
    onChange={(e) => setProductID(e.target.value)}
  />
</Grid>

    {/* Product Name & Unit of Measure */}
    <Grid item xs={12} md={6}>
      <TextField label="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} fullWidth />
    </Grid>
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <InputLabel>Unit of Measure</InputLabel>
        <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
          {units.map((unit) => (
            <MenuItem key={unit} value={unit}>
              {unit}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    {/* Price & Quantity */}
    <Grid item xs={12} md={6}>
      <TextField label="Product Price" type="number" value={productPrice} onChange={handlePriceChange} fullWidth />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField label="Quantity" type="number" value={productQuantity} onChange={handleQuantityChange} fullWidth />
    </Grid>

    {/* Auto-Calculated Total Amount */}
    <Grid item xs={12}>
       <Typography variant="subtitle1" fontWeight="bold">
        Total Amount: ₹{totalAmount}
      </Typography>
    </Grid>

    {/* Add Product Button */}
    <Grid item xs={12} display="flex" justifyContent="center">
      <Button variant="contained" color="primary" onClick={handleAddProduct}>
        Add Product
      </Button>
    </Grid>
  </Grid>
</Box>

      {/* ================== Section 2: Order Products Table ================== */}
       {/* Section 2: Order Products Table */}
      <Box mb={4} p={2} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>Order Products</Typography>
        {orderProducts.length === 0 ? (
          <Typography>No products added.</Typography>
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
         <Box display="flex" justifyContent="flex-end" mt={2}>
         <Typography variant="h6" fontWeight="bold">
         Grand Total: ₹{Number(grandTotal).toFixed(2)}
        </Typography>
</Box>
      </Box>

      {/* ================== Section 3: Order Details ================== */}
      <Box
  mb={4}
  p={2}
  border={1}
  borderColor="grey.300"
  borderRadius={2}
>

  {/* Supplier Search */}
  <Box mb={3} p={2} border={1} borderColor="grey.300" borderRadius={2}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Search Supplier / Wholesaler
    </Typography>
    <Grid container spacing={2}>
    {/* Search Type Selection */}
    <Grid item xs={12} md={4}>
      <FormControl fullWidth>
        <InputLabel>Search By</InputLabel>
        <Select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="name">By Name</MenuItem>
          <MenuItem value="id">By ID</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Search Input */}
    <Grid item xs={12} md={8}>
      <TextField
        fullWidth
        label="Search Supplier"
        value={supplierSearch}
        onChange={handleSupplierSearchChange}
      />
    </Grid>
  </Grid>

  {/* Search Results Dropdown */}
  {supplierSearch && showSupplierList && (
    <Paper
      sx={{
        mt: 1,
        maxHeight: "150px",
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      {filteredSuppliers.length > 0 ? (
        filteredSuppliers.map((supplier) => (
          <Box
          key={supplier.supplier_id}
            sx={{
              p: 1,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
            onClick={() => handleSupplierSelect(supplier)}
          >
             {supplier.name} ({supplier.supplier_id})
          </Box>
        ))
      ) : (
        <Typography sx={{ p: 1 }}>No Suppliers Found</Typography>
      )}
    </Paper>
  )}  
  </Box>
  

  {/* Order Details */}
  <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Order Details
    </Typography>
    <Grid container spacing={2}>
      {/* Row 1: Order ID and Order Date */}
      <Grid item xs={12} md={6}>
        <TextField label="Order ID" value={orderID} fullWidth disabled />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Order Date & Time"
          value={orderDate}
          fullWidth
          disabled
        />
      </Grid>
      {/* Row 2: Supplier ID and Delivery Date */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Supplier ID"
          value={supplierID}
          disabled
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Delivery Date"
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      {/* Row 3: Payment Method, Payment Status & Currency in one row */}
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            {paymentStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {currencies.map((curr) => (
              <MenuItem key={curr} value={curr}>
                {curr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {/* Row 4: New fields - Order Status and Transaction ID (conditionally rendered) */}
      <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {paymentMethod !== "Cash" && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  fullWidth
                />
              </Grid>
            )}
      {/* Row 4: Shipping Address */}
      <Grid item xs={12}>
        <TextField
          label="Shipping Address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
      {/* Row 5: Order Notes */}
      <Grid item xs={12}>
        <TextField
          label="Order Notes"
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  </Box>

  {/* Place Order Button */}
  <Box mt={3} display="flex" justifyContent="center">
    <Button variant="contained" color="secondary" onClick={handlePlaceOrder}>
      Place Order
    </Button>
  </Box>
</Box>
      </Box>
  );
};

export default PlaceOrder;
