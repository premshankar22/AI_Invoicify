import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const categoryOptions = [
    "Grocery",
    "Electronic",
    "Mobile",
    "Accessories",
    "Cloths",
    "Furniture",
    "Sports",
    "Home",
    "Kitchen",
  ];

const AddProductModal = ({ open, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    category: "",
    brand: "",
  });


// Auto-generate product_id when category changes
  useEffect(() => {
    if (formData.category) {
      // Generate prefix from first 3 letters of category, in uppercase
      const prefix = formData.category.slice(0, 3).toUpperCase();
      // Use Date.now() as a unique identifier
      const unique = Date.now();
      setFormData((prev) => ({ ...prev, product_id: `${prefix}-${unique}` }));
    } else {
      // Clear product_id if category is cleared
      setFormData((prev) => ({ ...prev, product_id: "" }));
    }
  }, [formData.category]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   // Function to call the backend POST API using fetch
   const createProduct = async (productData) => {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create product");
    }
    return await response.json();
  };

  const handleSubmit = async () => {
    try {
      await createProduct(formData);
      onAddProduct(formData);
      setFormData({
        product_id: "",
        product_name: "",
        category: "",
        brand: "",
      });
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          backgroundColor: "#1976d2",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AddCircleIcon />
        Add Product
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        > 
           <TextField
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Product ID"
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            disabled 
          />
          <TextField
            label="Product Name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
          />
    
          <TextField
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
