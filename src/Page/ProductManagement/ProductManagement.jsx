import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, InputAdornment, Button, Snackbar, Alert, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KPISection from "./KPISection";
import ProductTable from "./ProductTable";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ThemeContext } from "./ThemeContext"; // Import theme context
import PlaceOrder from "./PlaceOrder"; 
import AddProductModal from "./AddProductModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";


const searchOptions = ["All Products", "Category", "Product Name", "Product ID"];

const ProductManagement = () => {
  const [searchType, setSearchType] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext); 
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const [products, setProducts] = useState([]); // Store fetched products here
  const [openAddProductModal, setOpenAddProductModal] = useState(false);

     // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          console.error("Error fetching products");
          return;
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query and type using correct property names
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case "Product Name":
        return product.product_name?.toLowerCase().includes(query);
      case "Category":
        return product.category?.toLowerCase().includes(query);
      case "Product ID":
        return product.product_id?.toLowerCase().includes(query);
      default:
        return (
          product.product_name?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.product_id?.toLowerCase().includes(query)
        );
    }
  });

 // If showPlaceOrder is true, render the PlaceOrder component instead
 if (showPlaceOrder) {
  return <PlaceOrder onBack={() => setShowPlaceOrder(false)} />;
}
  
  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh", p: 3 }}>

      {/* Header with Dark Mode Toggle */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", mb: 2 }}>
  {/* Title in Center */}
  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
    📦 Product Management
  </Typography>

  {/* Toggle Dark Mode Button on Right */}
  <IconButton 
    onClick={() => setDarkMode((prev) => !prev)}
    sx={{ position: "absolute", right: 0 }}
  >
    {darkMode ? <LightModeIcon sx={{ color: "#fdd835" }} /> : <DarkModeIcon sx={{ color: "#90caf9" }} />}
  </IconButton>
</Box>

      {/* 🔥 Search Bar & Place Order Button Layout */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    {/* Search Type Dropdown */}
    <TextField
      select
      value={searchType}
      onChange={(e) => setSearchType(e.target.value)}
      variant="outlined"
      sx={{
        minWidth: "180px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {searchOptions.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>

    {/* Search Input Field */}
    <TextField
      variant="outlined"
      placeholder={`Search ${searchType}...`}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        minWidth: "500px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "#1976d2" }} />
          </InputAdornment>
        ),
      }}
    />
  </Box>

  {/* 🛒 Place Order Button (Moved to Right) */}
  <Button
    variant="outline"
    //color="primary"
    startIcon={<ShoppingCartIcon />}
    sx={{
      backgroundColor: "#1976d2",
      fontSize: "16px",
      fontWeight: "bold",
      padding: "10px 20px",
      borderRadius: "8px",
      ml: "auto", // Moves button to the right
      "&:hover": {
        backgroundColor: "#135ba1",
      },
    }}
    onClick={() => setShowPlaceOrder(true)} 
  >
    Place Order
  </Button>

  {/* Add Product Button */}
  <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          sx={{
            backgroundColor: "#4caf50",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            ml: 2,
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          }}
          onClick={() => setOpenAddProductModal(true)}
        >
          Add Product
        </Button>
</Box>


      {/* KPI Section */}
      <KPISection />

      {/* Product Table with Initial and More Products   fetchMoreProducts={fetchMoreProducts}*/}
      <ProductTable initialProducts={filteredProducts} showToast={() => setToastOpen(true)} />

      {/* Toast Notification */}
      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="warning">⚠️ Some products are running low on stock!</Alert>
      </Snackbar>

      {/* AddProduct Modal */}
      {openAddProductModal && (
        <AddProductModal
          open={openAddProductModal}
          onClose={() => setOpenAddProductModal(false)}
          onAddProduct={(newProduct) => {
            // Here, you can either add the product to your local state or make an API call to add it to your database.
            // For this example, we'll add it to the local state:
            setProducts((prev) => [...prev, newProduct]);
          }}
        />
      )}
    </Box>
  );
};

export default ProductManagement;
