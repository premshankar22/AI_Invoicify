import React, { useState } from "react";
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl, Grid } from "@mui/material";

const productCategories = [
  "Grocery", "Electronic", "Mobile", "Accessories", "Cloths",
  "Furniture", "Sports", "Home", "Kitchen"
];
const unitMeasurements = ["Kg", "Litre", "Meter", "Piece", "Box"];
const taxRates = ["0%", "5%", "12%", "18%", "28%"];
const discountTypes = ["Fixed", "Percentage"];
const productStatusOptions = ["Out of Stock", "Available", "Discontinued"];
const getDefaultDate = () => new Date().toISOString().split("T")[0];

const UpdateProduct = ({ product, onBack }) => {
  // Use product.product_id (not productId) for consistency with DB
  const [formData, setFormData] = useState({
    product_id: product?.product_id || "",
    category: product?.category || "",
    brand: product?.brand || "",
    tags: product?.tags || "",
    product_name: product?.product_name || "",
    unitMeasurement: product?.unitMeasurement || "",
    quantity: product?.quantity || "",
    wholesalePrice: product?.wholesalePrice || "",
    unitPrice: product?.unitPrice || "",
    tax: product?.tax || "0%",
    discountType: product?.discountType || "Fixed",
    discountValue: product?.discountValue || "",
    productStatus: product?.productStatus || "Available",
    stockThreshold: product?.stockThreshold || "",
    dateOfEntry: product?.dateOfEntry || getDefaultDate(),
    expiryDate: product?.expiryDate || "",
    warrantyInfo: product?.warrantyInfo || "",
    description: product?.description || "",
    image: product?.image || null, // image URL for preview
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "discountType") {
      setFormData((prev) => ({
        ...prev,
        discountType: value,
        discountValue: "" 
      }));
      return;
    }

    if (name === "discountValue") {
      let newValue = value;
      if (formData.discountType === "Percentage") {
        newValue = Math.max(0, Math.min(100, value));
      }
      setFormData({ ...formData, discountValue: newValue });
      return;
    }

    if (["quantity", "wholesalePrice", "unitPrice", "stockThreshold"].includes(name)) {
      if (isNaN(value) || value < 0) return;
    }

    setFormData({ ...formData, [name]: value });
  };


    // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };
    
  const validateForm = () => {
    if (!formData.product_name.trim()) {
      alert("Product name cannot be empty.");
      return false;
    }
    if (!formData.unitPrice || isNaN(formData.unitPrice) || formData.unitPrice < 0) {
      alert("Unit Price must be a valid number greater than 0.");
      return false;
    }
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity < 0) {
      alert("Quantity must be a valid number greater than 0.");
      return false;
    }
    if (formData.expiryDate && formData.expiryDate < formData.dateOfEntry) {
      alert("Expiry date must be later than the date of entry.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
      // Ensure date fields are properly formatted before sending
      const formattedData = {
        ...formData,
        dateOfEntry: formData.dateOfEntry ? new Date(formData.dateOfEntry).toISOString().split("T")[0] : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString().split("T")[0] : null,
      };

    try {
      const response = await fetch(`http://localhost:5000/api/products/${formData.product_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        console.error("Error updating product:", await response.json());
      } else {
        console.log("Product updated successfully:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
       // Reset the form after successful update
       // Reset the form after successful update
       setFormData({
        product_id: "",
        product_name: "",
        unitPrice: "",
        quantity: "",
        category: "",
        dateOfEntry: "",
        expiryDate: "",
        image: "",
      });
    }
  };


      return (
        <Box sx={{ padding: 3, maxWidth: 700, margin: "auto", textAlign: "center" }}>
          <Typography variant="h5" mb={2}>Update Product</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Product ID"  name="product_id" value={formData.product_id}  margin="normal" disabled />
    
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Product Name"  name="product_name"  value={formData.product_name}  onChange={handleChange} margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Brand" name="brand" value={formData.brand} onChange={handleChange} margin="normal" />
              </Grid>
    
              <Grid item xs={6}>
                <TextField fullWidth label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Wholesale Price" name="wholesalePrice" type="number" value={formData.wholesalePrice} onChange={handleChange} margin="normal" />
              </Grid>
    
              <Grid item xs={6}>
                <TextField fullWidth label="Unit Price" name="unitPrice" type="number" value={formData.unitPrice} onChange={handleChange} margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tax</InputLabel>
                  <Select name="tax" value={formData.tax} onChange={handleChange}>
                    {taxRates.map((rate) => <MenuItem key={rate} value={rate}>{rate}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
    
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Discount Type</InputLabel>
                  <Select name="discountType" value={formData.discountType} onChange={handleChange}>
                    {discountTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
              <TextField
                            fullWidth
                            label={formData.discountType === "Fixed" ? "Discount Amount" : "Discount (%)"}
                            name="discountValue"
                            type="number"
                            value={formData.discountValue}
                            onChange={handleChange}
                            margin="normal"
                            inputProps={{ min: 0, max: formData.discountType === "Percentage" ? 100 : undefined }}
                        />
              </Grid>
    
              <Grid item xs={12}>
                <TextField fullWidth label="Tags" name="tags" value={formData.tags} onChange={handleChange} margin="normal" />
              </Grid>
    
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select name="category" value={formData.category} onChange={handleChange}>
                    {productCategories.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Unit Measurement</InputLabel>
                  <Select name="unitMeasurement" value={formData.unitMeasurement} onChange={handleChange}>
                    {unitMeasurements.map((unit) => <MenuItem key={unit} value={unit}>{unit}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
    
              <Grid item xs={6}>
                <TextField fullWidth label="Stock Threshold" name="stockThreshold" type="number" value={formData.stockThreshold} onChange={handleChange} margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Date of Entry" name="dateOfEntry" type="date" value={formData.dateOfEntry} onChange={handleChange} margin="normal" />
              </Grid>
    
              <Grid item xs={6}>
                <TextField fullWidth label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Warranty Info" name="warrantyInfo" value={formData.warrantyInfo} onChange={handleChange} margin="normal" />
              </Grid>
    
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} margin="normal" />
              </Grid>
    
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Product Status</InputLabel>
                  <Select name="productStatus" value={formData.productStatus} onChange={handleChange}>
                    {productStatusOptions.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

               {/* Image Upload Field */}
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>Upload Product Image</Typography>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </Grid>

          {/* Display Image Preview */}
          {formData.image && (
            <Grid item xs={12}>
              <img src={formData.image} alt="Product Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", marginTop: 10 }} />
            </Grid>
          )}
            </Grid>
    
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" type="submit">Update</Button>
              <Button variant="outlined" color="secondary" onClick={onBack}>Back</Button>
            </Box>
          </form>
        </Box>
      );
    };
    
    export default UpdateProduct;