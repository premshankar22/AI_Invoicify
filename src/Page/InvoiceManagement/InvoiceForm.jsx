import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Invoice from "./Invoice"; 
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const categories = ["Grocery", "Electronic", "Mobile", "Accessories", "Cloths", "Furniture", "Sports", "Home", "Kitchen"];
const units = ["Kg", "Litre", "Meter", "Piece", "Box"];
const discountTypes = ["Fixed", "Percentage"];
const gstRates = ["0%", "5%", "12%", "18%", "25%"];

const InvoiceForm = ({ onClose }) => {
   // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("productId");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

    const [showInvoice, setShowInvoice] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        productId: "",
        category: "",
        productName: "",
        brand: "",
        quantity: "",
        unitPrice: "",
        unit: "",
        gst: "",
        discountType: "",
        discountValue: "",
      });



     // Fetch all products once when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Automatically filter products as searchTerm or searchOption changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      return;
    }
    // Map our searchOption to the API field name
    const fieldMap = {
      productId: "product_id",
      productName: "product_name",
      category: "category",
      brand: "brand",
    };

    const field = fieldMap[searchOption];

    const results = allProducts.filter((product) =>
      product[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, searchOption, allProducts]);

  // When a product suggestion is clicked, auto-fill form fields
  const handleSelectProduct = (product) => {
    setFormData({
      productId: product.product_id || "",
      productName: product.product_name || "",
      category: product.category || "",
      brand: product.brand || "",
      unit: product.unit_measurement || "",
      unitPrice: product.unit_price ? product.unit_price.toString() : "",
      discountType: product.discount_type || "",
      discountValue: product.discount_value ? product.discount_value.toString() : "",
      gst: product.tax || "", // Assuming your API field for GST is "tax"
      quantity: "", // Let user enter quantity
    });
    setFilteredProducts([]);
    setSearchTerm("");
  };
  
     // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Handle change for all controlled fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
   
   // Compute Sub Total and Net Amount dynamically
   const quantity = parseFloat(formData.quantity) || 0;
   const unitPrice = parseFloat(formData.unitPrice) || 0;
   const discountValue = parseFloat(formData.discountValue) || 0;
   const subTotal = quantity * unitPrice;
   let discount = 0;
   if (formData.discountType === "Percentage") {
     discount = subTotal * (discountValue / 100);
   } else if (formData.discountType === "Fixed") {
     discount = discountValue;
   }
   const gstRate = formData.gst ? parseFloat(formData.gst.replace("%", "")) : 0;
   const netBeforeGST = subTotal - discount;
   const netAmount = netBeforeGST * (1 + gstRate / 100);

    // Add product to the products array
  const handleAddProduct = () => {
    // Create new product object with all details and computed values
    const newProduct = {
      ...formData,
      // Parse numeric values
      quantity: quantity,
      unitPrice: unitPrice,
      discountValue: discountValue,
      subTotal: subTotal,
      netAmount: netAmount,
      image: selectedImage,
    };

    // Add to products list
    setProducts((prev) => [...prev, newProduct]);

    // Reset form fields and image
    setFormData({
      productId: "",
      category: "",
      productName: "",
      brand: "",
      quantity: "",
      unitPrice: "",
      unit: "",
      gst: "",
      discountType: "",
      discountValue: "",
    });
    setSelectedImage(null);
  };

   // Update product's quantity and recalc subTotal and netAmount
   const updateProductQuantity = (index, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) => {
        if (i === index) {
          const qty = newQuantity;
          const newSubTotal = qty * product.unitPrice;
          let newDiscount = 0;
          if (product.discountType === "Percentage") {
            newDiscount = newSubTotal * (product.discountValue / 100);
          } else if (product.discountType === "Fixed") {
            newDiscount = product.discountValue;
          }
          const gstRate = product.gst ? parseFloat(product.gst.replace("%", "")) : 0;
          const newNetBeforeGST = newSubTotal - newDiscount;
          const newNetAmount = newNetBeforeGST * (1 + gstRate / 100);
          return { ...product, quantity: qty, subTotal: newSubTotal, netAmount: newNetAmount };
        }
        return product;
      })
    );
  };

  const handleIncrementQuantity = (index) => {
    const product = products[index];
    const newQuantity = product.quantity + 1;
    updateProductQuantity(index, newQuantity);
  };

  const handleDecrementQuantity = (index) => {
    const product = products[index];
    if (product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      updateProductQuantity(index, newQuantity);
    }
  };

  // Remove product from list
  const handleRemoveProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };
 
  // Calculate Grand Total (sum of net amounts)
  const grandTotal = products.reduce((acc, product) => acc + product.netAmount, 0);

    // If "Next" is clicked, show the Invoice component
    if (showInvoice) {
        return <Invoice products={products} grandTotal={grandTotal} onBack={() => setShowInvoice(false)} />;
      }


  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        p: 3,
        maxWidth: "100%",
        mx: "auto",
      }}
    >
      {/* Close Button */}
      <Box mt={2} textAlign="right">
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Close
        </Button>
      </Box>

      {/* Two-Column Layout */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Box 1: Product Details (Left Side - 60%) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
               {/* Search Bar */}
            {/* Search Bar (no search button) */}
            <Box mb={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputLabel-root": { color: "primary.main" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "primary.main" },
                        "&:hover fieldset": { borderColor: "primary.dark" },
                        "&.Mui-focused fieldset": { borderColor: "primary.dark" },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "primary.main" }}>Search By</InputLabel>
                    <Select
                      label="Search By"
                      value={searchOption}
                      onChange={(e) => setSearchOption(e.target.value)}
                      sx={{
                        "& .MuiSelect-select": { color: "primary.main" },
                        "& fieldset": { borderColor: "primary.main" },
                      }}
                    >
                      <MenuItem value="productId">Product ID</MenuItem>
                      <MenuItem value="category">Category</MenuItem>
                      <MenuItem value="productName">Product Name</MenuItem>
                      <MenuItem value="brand">Brand</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {/* Suggestions List */}
              {filteredProducts.length > 0 && (
                <Paper sx={{ maxHeight: 200, overflowY: "auto", mt: 1 }}>
                  {filteredProducts.map((product) => (
                    <Box
                      key={product.product_id}
                      sx={{
                        p: 1,
                        borderBottom: "1px solid #ccc",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                      onClick={() => handleSelectProduct(product)}
                    >
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {product.product_name} ({product.product_id})
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>

              {/* Product Details Form */}
            <Grid container spacing={2} alignItems="center">
              {/* Product ID and Category (Left Side) */}
              <Grid item xs={6}>
              <TextField
                  label="Product ID"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": { color: "primary.main" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
                <Box mt={2}>
                <FormControl fullWidth>
                    <InputLabel sx={{ color: "primary.main" }}>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      sx={{
                        "& .MuiSelect-select": { color: "primary.main" },
                        "& fieldset": { borderColor: "primary.main" },
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Product Image (Right Side) */}
              <Grid item xs={6} textAlign="center">
                <Typography variant="subtitle1">Product Image</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {/* Image Preview */}
                  {selectedImage ? (
                    <Avatar
                      src={selectedImage}
                      alt="Product"
                      sx={{ width: 100, height: 100, borderRadius: 2 }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: "#f0f0f0",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "gray",
                      }}
                    >
                      No Image
                    </Box>
                  )}

                  <Button variant="contained" component="label" sx={{ backgroundColor: "primary.main" }}>
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                </Box>
              </Grid>

              {/* Product Name and Brand */}
              <Grid item xs={6}>
              <TextField
                  label="Product Name"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": { color: "primary.main" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
              <TextField
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": { color: "primary.main" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>

              {/* Quantity and Unit Price */}
              <Grid item xs={4}>
              <FormControl fullWidth>
                  <InputLabel  sx={{ color: "primary.main" }}>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    sx={{
                      "& .MuiSelect-select": { color: "primary.main" },
                      "& fieldset": { borderColor: "primary.main" },
                    }}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
              <TextField
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": { color: "primary.main" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
              <TextField
                  label="Unit Price"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": { color: "primary.main" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>

              {/* Unit of Measurement & GST (Same Row) */}
              <Grid item xs={4}>
              <FormControl fullWidth>
                  <InputLabel sx={{ color: "primary.main" }}>GST</InputLabel>
                  <Select
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    sx={{
                      "& .MuiSelect-select": { color: "primary.main" },
                      "& fieldset": { borderColor: "primary.main" },
                    }}
                  >
                    {gstRates.map((gst) => (
                      <MenuItem key={gst} value={gst}>
                        {gst}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

               {/* Discount Type and Discount Value */}
               <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "primary.main" }}>Discount Type</InputLabel>
                  <Select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    sx={{
                      "& .MuiSelect-select": { color: "primary.main" },
                      "& fieldset": { borderColor: "primary.main" },
                    }}
                  >
                    {discountTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Discount Value"
                  name="discountValue"
                  onChange={handleChange}
                  value={formData.discountValue}
                  fullWidth
                  InputProps={{
                    startAdornment:
                      formData.discountType === "Fixed" ? (
                        <InputAdornment position="start">₹</InputAdornment>
                      ) : null,
                    endAdornment:
                      formData.discountType === "Percentage" ? (
                        <InputAdornment position="end">%</InputAdornment>
                      ) : null,
                  }}
                  sx={{
                    "& .MuiInputLabel-root": { color: "primary.main" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
               {/* Sub Total & Net Amount */}
              <Grid item xs={6}>
              <TextField
                  label="Sub Total"
                  value={subTotal.toFixed(2)}
                  fullWidth
                  disabled
                  sx={{
                    "& .MuiInputLabel-root": { color: "primary.main" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
              <TextField
                  label="Net Amount"
                  value={netAmount.toFixed(2)}
                  fullWidth
                  disabled
                  sx={{
                    "& .MuiInputLabel-root": { color: "primary.main" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>

              {/* Add Product Button */}
              <Grid item xs={12} textAlign="right">
              <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddProduct}
                  startIcon={<AddCircleIcon />}
                  sx={{
                    backgroundColor: "primary.main",
                    "&:hover": { backgroundColor: "primary.dark" },
                    fontWeight: "bold",
                    px: 3,
                  }}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Box 2: Product Table (Right Side - 40%) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Product Table
            </Typography>

            <TableContainer sx={{ maxHeight: 450, overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead sx={{
        "& .MuiTableCell-root": {
          backgroundColor: "#1565c0 ",
          color: "#fff",
          fontWeight: "bold",
        },
      }}>
                  <TableRow>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Image</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Product ID</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Category</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Product Name</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Brand</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Unit</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Quantity</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Unit Price</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>GST</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Discount Type</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Discount Value</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Sub Total</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Net Amount</TableCell>
                    <TableCell  sx={{ fontWeight: "bold", color: "#fff" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} align="center">
                        No Products Added
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {product.image ? (
                            <Avatar src={product.image} alt="Product" sx={{ width: 40, height: 40 }} />
                          ) : (
                            "No Image"
                          )}
                        </TableCell>
                        <TableCell>{product.productId}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <IconButton onClick={() => handleIncrementQuantity(index)} size="small">
                              +
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>{product.quantity}</Typography>
                            <IconButton onClick={() => handleDecrementQuantity(index)} size="small">
                              -
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>₹{product.unitPrice}</TableCell>
                        <TableCell>{product.gst}</TableCell>
                        <TableCell>{product.discountType}</TableCell>
                        <TableCell>
                          {product.discountType === "Fixed" ? "₹" : ""}
                          {product.discountValue}
                          {product.discountType === "Percentage" ? "%" : ""}
                        </TableCell>
                        <TableCell>₹{product.subTotal.toFixed(2)}</TableCell>
                        <TableCell>₹{product.netAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button color="error" onClick={() => handleRemoveProduct(index)}>
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
             {/* Grand Total */}
             <Box
                sx={{
                    mt: 2,
                    textAlign: "right",
                     fontWeight: "bold",
                    fontSize: "1.8rem",
                    color: "#00c853",
                  //  background: "linear-gradient(45deg, #FF8A00, #E52B50)",
                    p: 2,
                    borderRadius: 2,
                  //  boxShadow: 3,
                   // textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                 }}
               >
              Grand Total: ₹{grandTotal.toFixed(2)}
            </Box>
             {/* Next Button with Right Arrow Icon */}
             <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon />} onClick={() => setShowInvoice(true)}>
                Next
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceForm;
